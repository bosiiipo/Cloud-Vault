import {Request, Response} from 'express';
import {UploadService} from '../services/upload.service';
import {config} from '../config';
import {AppError, ValidationError} from '../responses/errors';
import {StatusCode} from '../responses';
import {Readable} from 'stream';

const uploadService = new UploadService();

export const uploadSingleFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    const folderName = req.query.folderName as string | undefined;

    if (!file) {
      throw new ValidationError('No file provided');
    }

    if (!req?.user?.userId) {
      throw new Error('userId is required');
    }

    const userId = req.user.userId;

    const result = await uploadService.uploadFile(file, config.s3Bucket!, userId, folderName);

    return res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({err: error.message});
    }

    res.status(StatusCode.SERVER_ERROR).json({err: 'An unknown error occurred'});
  }
};

export const generateDownloadUrl = async (req: Request, res: Response) => {
  try {
    const {key} = req.query;

    if (!key || typeof key !== 'string') {
      return res.status(400).json({message: 'File key is required'});
    }

    const url = await uploadService.generateDownloadUrl(key, config.s3Bucket!);

    return res.status(200).json({url});
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({err: error.message});
    } else {
      // eslint-disable-next-line no-console
      console.error('An unknown error occurred');
    }

    return res.status(StatusCode.SERVER_ERROR).json({err: 'Failed to generate download URL'});
  }
};

function isWebReadableStream<R = unknown>(
  body: unknown,
): body is import('stream/web').ReadableStream<R> {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as {getReader?: () => unknown}).getReader === 'function'
  );
}

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const {key} = req.query;

    if (!key || typeof key !== 'string') {
      return res.status(400).json({message: 'File key is required'});
    }

    const file = await uploadService.downloadFile(key);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(key.split('/').pop() || key)}"`,
    );
    res.setHeader('Content-Type', file.ContentType || 'application/octet-stream');

    let bodyStream: Readable;

    if (file.Body instanceof Readable) {
      // Native Node.js stream
      bodyStream = file.Body;
    } else if (isWebReadableStream(file.Body)) {
      // Convert Web ReadableStream → Node Readable
      bodyStream = Readable.fromWeb(file.Body);
    } else {
      throw new Error('Unsupported stream type from S3 response');
    }

    bodyStream.pipe(res);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({err: error.message});
    } else {
      console.error('File download failed:', error);
    }

    return res.status(StatusCode.SERVER_ERROR).json({err: 'Failed to download file'});
  }
};
