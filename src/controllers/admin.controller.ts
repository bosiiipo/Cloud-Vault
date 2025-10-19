import {Request, Response} from 'express';
import * as adminService from '../services/admin.service';

export const getPendingFiles = async (req: Request, res: Response) => {
  try {
    const user = await adminService.getPendingUploads();
    res.status(201).json({message: 'User registered successfully', user});
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({err: err.message});
    } else {
      res.status(400).json({err: 'An unknown error occurred'});
    }
  }
};

export const flagFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ error: 'Unauthorized: Admin ID is required' });
    }

    const input = {
      fileId,
      adminId,
      reason: req.body.reason,
    };

    const data = await adminService.flagFile(input);

    const sanitizedFile = {
      ...data.file,
      size: Number(data.file.size),
    };

    res.status(200).json({ ...data, file: sanitizedFile });
  } catch (err: any) {
    if (err instanceof Error) {
      // ✅ Use statusCode if available, otherwise default to 400
      const status = (err as any).statusCode || 400;
      return res.status(status).json({ err: err.message });
    }

    return res.status(400).json({ err: 'An unknown error occurred' });
  }
};

export const flagFileAsUnsafe = async (req: Request, res: Response) => {
  try {
    const {fileId} = req.params;

    const {reason} = req.body;

    if (!reason) {
      return res.status(400).json({error: 'Reason is required'});
    }

    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({error: 'Unauthorized: Admin ID is required'});
    }

    const input = {
      reason,
      fileId,
      adminId,
    };

    const data = await adminService.flagFileAsUnsafe(input);

    const sanitizedFile = {
      ...data.file,
      size: Number(data.file.size),
    };

    res.status(200).json({...data, file: sanitizedFile});
  } catch (err) {
    console.error('ERR FLAG UNSAFE:', err);
    if (err instanceof Error) {
      res.status(400).json({err: err.message});
    } else {
      res.status(400).json({err: 'An unknown error occurred'});
    }
  }
};

export const unFlagFile = async (req: Request, res: Response) => {
  try {
    const {fileId} = req.params;

    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({error: 'Unauthorized: Admin ID is required'});
    }

    const input = {
      fileId,
      adminId,
      reason: req.body.reason,
    };

    const data = await adminService.unflagFile(input);

    const sanitizedFile = {
      ...data.file,
      size: Number(data.file.size),
    };

    res.status(200).json(sanitizedFile);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({err: err.message});
    } else {
      res.status(400).json({err: 'An unknown error occurred'});
    }
  }
};
