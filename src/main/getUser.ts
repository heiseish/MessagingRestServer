import Logger from './logger';
import { getUserName } from './messenger/api/graphApi';

/**
* Return a partial unique userId from incoming event to identify user
* @param {supportedPlatform} platform supported platform currently
* @param {any} payload
* @return promise contains the updated user
*/
export default async (partialUniqueId: string, platform: supportedPlatform,
                      payload: any, cache: any): Promise<Dawn.userType> => {
	try {
		const user = await cache.getUser(partialUniqueId);
		if (user) return user;
		const newUser = await createNewUser(partialUniqueId, platform, payload);
		cache.saveUser(partialUniqueId, newUser);
		return newUser;
	} catch (e) {
		return Promise.reject(e);
	}

};

/**
 * Create new user based on the payload
 * @param {string} partialUniqueId
 * @param {supportedPlatform} platform
 * @param {any} payload
 * @return user object
 */
const createNewUser = async (partialUniqueId: string, platform: supportedPlatform,
                             payload: any): Promise<Dawn.userType> => {
	const log = Logger.info('Creating new user...', true);
	try {

		const user: Dawn.userType = {
			id: partialUniqueId,
			locale: 'eng',
			entity: {
				lastIntent: null,
			},
			platform: platform
		};
		let name;
		switch (platform) {
		case 'telegram':
			user.name = {
				first: payload.from.first_name,
			};
			break;

		case 'messenger':
			name = await getUserName(user.id.replace('mes', ''));
			if (name) {
				const { firstName, lastName } = name;
				user.name = {
					first: firstName,
					last: lastName,
					full: `${firstName} ${lastName}`,
				};
			}
			break;

		default:

		}
		log.stop('Created new user.');
		return user;
	} catch (e) {
		log.stop('');
		return Promise.reject(e);
	}

};
