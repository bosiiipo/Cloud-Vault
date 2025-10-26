import {Request, Response} from 'express';
import {UploadService} from '../services/upload.service';
import {config} from '../config';
import {AppError} from '../responses/errors';
import {StatusCode} from '../responses';
import * as folderService from '../services/folder.service';

const uploadService = new UploadService();

export const createFolder = async (req: Request, res: Response) => {
  try {
    const {folderName} = req.body;

    if (!req?.user?.userId) {
      throw new Error('userId is required');
    }

    const userId = req.user.userId;

    const url = await uploadService.createFolderOnS3(folderName, config.s3Bucket!, userId);

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

export const getFolder = async (req: Request, res: Response) => {
  try {
    const folderId = req.params.folderId;

    if (!req?.user?.userId) {
      return res.status(401).json({message: 'Unauthorized: userId is required'});
    }

    const userId = req.user.userId;

    if (!folderId) {
      return res.status(400).json({message: 'FolderId is required'});
    }

    const input = {
      folderId,
      userId,
    };

    const folder = await folderService.getFolder(input);

    return res.status(200).json(folder);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({err: error.message});
    } else {
      // eslint-disable-next-line no-console
      console.error('An unknown error occurred');
    }

    return res.status(StatusCode.SERVER_ERROR).json({err: 'Failed to fetch folder details!'});
  }
};

export const getAllFolders = async (req: Request, res: Response) => {
  try {
    const {userId} = req.params;

    const folder = await folderService.getAllFolders(userId);

    return res.status(200).json(folder);
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
