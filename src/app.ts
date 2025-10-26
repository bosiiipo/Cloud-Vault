import express, {NextFunction, Request, Response} from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Routes
import {signUpRouter} from './routes/Auth/signUp.router';
import {signInRouter} from './routes/Auth/signIn.router';
import {uploadFileRouter} from './routes/Uploads/uploadFile.router';
import {downloadFileRouter} from './routes/Uploads/downloadFile.router';
import {uploadFileToFolderRouter} from './routes/Uploads/uploadFileToFolder.router';
import {signOutRouter} from './routes/Auth/signOut.router';
// import {getPendingFiles} from './controllers/admin.controller';
import {getPendingFilesRouter} from './routes/Files/getPendingUploads.router';
import {flagFileRouter} from './routes/Files/flagFile.router';
import {unFlagFileRouter} from './routes/Files/unflagFile.router';
import {flagFileAsUnsafeRouter} from './routes/Files/flagFileAsUnsafe.router';
import {createFolderRouter} from './routes/Folders/createFolder.router';
import {getFoldersRouter} from './routes/Folders/getFolders.router';
import {getFolderRouter} from './routes/Folders/getFolder.router';

import {AuthenticationError} from './responses/errors';
// import errorHandlerMiddleware from './middlewares/errorHandler.middleware';

dotenv.config();
const app = express();

// middleware
app.use(express.json());

app.use(
  morgan((tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status_code: tokens.status(req, res),
      content_length: tokens.res(req, res, 'content-length'),
      duration: `${tokens['response-time'](req, res)}ms`,
    });
  }),
);

// Auth
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

// Upload / Download
app.use(uploadFileRouter);
app.use(uploadFileToFolderRouter);
app.use(downloadFileRouter);

app.use(getPendingFilesRouter);

app.use(flagFileRouter);
app.use(unFlagFileRouter);
app.use(flagFileAsUnsafeRouter);

app.use(createFolderRouter);
app.use(getFoldersRouter);
app.use(getFolderRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({message: 'Welcome to Cloud Vault!'});
});

// app.use(errorHandlerMiddleware);
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      status: 'error',
      message: err.message,
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });

  next();
});

export default app;
