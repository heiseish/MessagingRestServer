"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("lodash/core"));
const moji_translate_1 = __importDefault(require("moji-translate"));
const request_1 = require("../utils/request");
const WORLD_CUP_URI = 'http://worldcup.sfg.io/matches';
const string_1 = require("../utils/string");
const MAX_COUNTRY_LENGTH = 10;
const MAX_GOALS_LENGTH = 2;
/**
 * Pad right of the text
 * @param value value to pad right
 * @param char character to be padded
 * @param length length of the padding
 * @returns padded string
 */
const rpad = (value, char, length) => {
    return (value + char.repeat(length)).substring(0, length);
};
/**
 * Check if a match is completed or in progress
 * @param match match that need to check
 * @returns true if the match is completed or in progress, false otherwise
 */
const isCompletedOrInProgress = (match) => {
    return match.status === 'completed' || match.status === 'in progress';
};
/**
 * Check if a match is happening today
 * @param match match that needs to be checked
 * @returns true if the match is happening today, false otherwise
 */
const matchHappeningToday = (match) => {
    const date = new Date(match.datetime);
    const today = new Date();
    return ((date.getDate() === today.getDate()
        && date.getMonth() === today.getMonth())
        || (date.getMonth() === today.getMonth()
            && date.getDate() === today.getDate() + 1
            && date.getHours() === 2))
        && (date.getDate() + date.getHours().toString() !== today.getDate() + '2');
};
/**
 * Get country flag with moji module
 * @param value country name
 * @return country flag code
 */
const getCountryFlag = (value) => {
    return moji_translate_1.default.translate(value.replace(/ /g, '_'), true);
};
/**
 * Get nicely formatted message about the happening match
 * @param match Match
 * @returns nicely formatted string
 */
const toConsoleOutput = (match) => {
    let homeFlag = getCountryFlag(match.home_team.country);
    if (!homeFlag) {
        homeFlag = '  ';
    }
    const home = string_1.padRight(match.home_team.country, ' ', MAX_COUNTRY_LENGTH);
    const homeGoals = rpad(match.home_team.goals, ' ', MAX_GOALS_LENGTH) || '';
    const awayFlag = getCountryFlag(match.away_team.country);
    const away = string_1.padLeft(match.away_team.country, ' ', MAX_COUNTRY_LENGTH);
    const awayGoals = rpad(match.away_team.goals, ' ', MAX_GOALS_LENGTH) || '';
    const hours = new Date(match.datetime).getHours();
    const presentableHours = hours < 12 ?
        hours.toString() + 'am'
        : (hours - 12).toString() + 'pm';
    return `${homeFlag} ${home} ${homeGoals} -  ${awayGoals} ${away} ${awayFlag} ${presentableHours}`;
};
/**
 * Get the matches
 * @return {Promise<Match[]>} World cup matches
 */
const getMatches = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const matches = yield request_1.externalAPIRequest({ uri: WORLD_CUP_URI });
        return matches;
    }
    catch (e) {
        return Promise.reject(e);
    }
});
/**
* Get the last n matches of specific synchronous filter
* @param {Match[]} matches
* @param {Function} filter
* @param {number} n
*/
const synchFilter = (matches, filter, n) => {
    return new Promise((resolve) => {
        n = n ? n : 3;
        const temp = matches;
        const result = [];
        temp
            .filter(filter)
            .map(toConsoleOutput)
            .forEach((r) => result.push(r));
        resolve(result.slice(Math.max(result.length - n, 1)));
    });
};
/**
 * Get nicely formatted message on currently ongoing WC games
 * @returns formatted string
 */
const getWCSchedule = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const NO_MATCH_TODAY = "There isn't any match today!";
        const matches = yield getMatches();
        const past = yield synchFilter(matches, isCompletedOrInProgress, 3);
        const present = yield synchFilter(matches, matchHappeningToday, 10);
        let message = 'Last 3 matches: \n';
        if (!core_1.default.isEmpty(past)) {
            for (const match of past) {
                message += match + '\n';
            }
        }
        message += 'Today matches: \n';
        if (!core_1.default.isEmpty(present)) {
            for (const match of present) {
                message += match + '\n';
            }
        }
        if (!core_1.default.isEmpty(past) || !core_1.default.isEmpty(present)) {
            return message;
        }
        else {
            return NO_MATCH_TODAY;
        }
    }
    catch (e) {
        return Promise.reject(e);
    }
});
exports.default = getWCSchedule;
//# sourceMappingURL=worldCup.js.map