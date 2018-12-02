"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== 'production')
    dotenv_1.default.load();
const App_1 = __importDefault(require("./App"));
const environment_1 = require("./main/environment");
const app = new App_1.default();
app.configureExpress(environment_1.PORT);
app.setUpDatabase();
app.startServer();
//# sourceMappingURL=index.js.map