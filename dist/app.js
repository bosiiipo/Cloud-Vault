"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const signUp_router_1 = require("./routes/Auth/signUp.router");
const signIn_router_1 = require("./routes/Auth/signIn.router");
const uploadFile_router_1 = require("./routes/Uploads/uploadFile.router");
const downloadFile_router_1 = require("./routes/Uploads/downloadFile.router");
const uploadFileToFolder_router_1 = require("./routes/Uploads/uploadFileToFolder.router");
const signOut_router_1 = require("./routes/Auth/signOut.router");
// import {getPendingFiles} from './controllers/admin.controller';
const getPendingUploads_router_1 = require("./routes/Files/getPendingUploads.router");
const flagFile_router_1 = require("./routes/Files/flagFile.router");
const unflagFile_router_1 = require("./routes/Files/unflagFile.router");
const flagFileAsUnsafe_router_1 = require("./routes/Files/flagFileAsUnsafe.router");
const errorHandler_middleware_1 = __importDefault(require("./middlewares/errorHandler.middleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use((0, morgan_1.default)((tokens, req, res) => {
    return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status_code: tokens.status(req, res),
        content_length: tokens.res(req, res, 'content-length'),
        duration: `${tokens['response-time'](req, res)}ms`,
    });
}));
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
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Cloud Vault!' });
});
app.use(errorHandler_middleware_1.default);
// app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof AuthenticationError) {
//     return res.status(401).json({
//       status: 'error',
//       message: err.message,
//     });
//   }
//   res.status(500).json({
//     status: 'error',
//     message: 'Internal server error',
//   });
//   next();
// });
exports.default = app;
