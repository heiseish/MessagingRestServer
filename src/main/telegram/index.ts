process.env.NTBA_FIX_319 = '1';
import moduleBot from 'node-telegram-bot-api';
import { TELEGRAM_TOKEN } from '../environment';
if (!TELEGRAM_TOKEN) {
	throw new Error('missing telegram token');
}
const telegramBot: any = new moduleBot(TELEGRAM_TOKEN, {polling: true});
export default telegramBot;
