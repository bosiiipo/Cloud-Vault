"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
const signUp_router_1 = require("./routes/Auth/signUp.router");
const signIn_router_1 = require("./routes/Auth/signIn.router");
const uploadFile_router_1 = require("./routes/Files/uploadFile.router");
const downloadFile_router_1 = require("./routes/Files/downloadFile.router");
const uploadFileToFolder_router_1 = require("./routes/Files/uploadFileToFolder.router");
const signOut_router_1 = require("./routes/Auth/signOut.router");
const getPendingUploads_router_1 = require("./routes/Admin/getPendingUploads.router");
const flagFile_router_1 = require("./routes/Admin/flagFile.router");
const unflagFile_router_1 = require("./routes/Admin/unflagFile.router");
const flagFileAsUnsafe_router_1 = require("./routes/Admin/flagFileAsUnsafe.router");
dotenv_1.default.config();
const app = (0, express_1.default)();
const api = config_1.config.api;
// middleware
app.use(express_1.default.json());
// Auth
app.use(signUp_router_1.signUpRouter);
app.use(signIn_router_1.signInRouter);
app.use(signOut_router_1.signOutRouter);
// Upload / Download
app.use(uploadFile_router_1.uploadFileRouter);
app.use(uploadFileToFolder_router_1.uploadFileToFolderRouter);
// app.use(uploadFilesRouter);
app.use(downloadFile_router_1.downloadFileRouter);
app.use(getPendingUploads_router_1.getPendingFilesRouter);
app.use(flagFile_router_1.flagFileRouter);
app.use(unflagFile_router_1.unFlagFileRouter);
app.use(flagFileAsUnsafe_router_1.flagFileAsUnsafeRouter);
app.disable('x-powered-by');
app.use((0, morgan_1.default)((tokens, req, res) => {
    return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status_code: tokens.status(req, res),
        content_length: tokens.res(req, res, 'content-length'),
        duration: `${tokens['response-time'](req, res)}ms`,
    });
}));
if (process.env.NODE_ENV !== 'test') {
    app.listen(config_1.config, () => {
        console.log(`Server running at ${config_1.config.port}`);
    });
}
;
exports.default = app;
// Run the seed
// main()
//   .catch((e) => {
//     console.error("Fatal error in main:", e);
//     process.exit(1);
//   });
