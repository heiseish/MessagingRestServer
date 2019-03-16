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
const _1 = __importDefault(require("./"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const codeforce_1 = require("../externalApis/codeforce");
const logger_1 = __importDefault(require("../logger"));
class CodeforceStream {
    /**
     *
     * @param handle Create a codeforce stream with a user
     */
    constructor(firebase) {
        this.stopStreaming = () => {
            logger_1.default.warn('Terminating codeforce streaming job');
            this.scheduler.cancel();
        };
        this.firebase = firebase;
    }
    /**
     * Schedule a job @8.30 am every day to send daily nasa picture
     * @param list list of person to send message to
     */
    startStreaming(list) {
        this.scheduler = node_schedule_1.default.scheduleJob('*/20 * * * *', () => __awaiter(this, void 0, void 0, function* () {
            let handle = yield this.firebase.getCodeforceHandle();
            let info = yield codeforce_1.getUserRating(handle);
            let current = yield this.firebase.getCurrentCodeforceStanding();
            if (!current || info.rating != current.rating) {
                yield this.firebase.setCurrentCodeforceStanding(info);
                _1.default({
                    text: 'New codeforce rating: ' + info.rating + '\nNew rank: ' + info.rank
                }, list);
            }
        }));
    }
}
exports.default = CodeforceStream;
//# sourceMappingURL=codeforce.js.map