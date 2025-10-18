"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const logger_1 = __importDefault(require("./lib/logger"));
const app_1 = __importDefault(require("./app"));
app_1.default.listen(config_1.config.port, () => {
    logger_1.default.info({ message: `Server started on port ${config_1.config.port}` }, 'SERVER_RUNNING');
});
