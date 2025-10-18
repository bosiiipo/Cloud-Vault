import {Request, Response} from 'express';
import {UploadService} from '../services/upload.service';
import {config} from '../config';
import {AppError, ValidationError} from '../responses/errors';
import {StatusCode} from '../responses';

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

    const result = await uploadService.uploadFile(file, 'cloud-vault', userId, folderName);

    return res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({err: error.message});
    } else {
      // eslint-disable-next-line no-console
      console.error('An unknown error occurred');
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
