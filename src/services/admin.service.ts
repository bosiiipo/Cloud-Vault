import {config} from '../config';
import prisma from '../lib/prisma';
import {UploadService} from './upload.service';

export const getPendingUploads = async () => {
  const files = await prisma.file.findMany({
    where: {
      OR: [{isFlagged: true}, {status: 'FLAGGED'}],
    },
    include: {
      user: {
        select: {id: true, email: true, fullName: true},
      },
      reviews: {
        include: {
          admin: {select: {email: true, fullName: true}},
        },
        orderBy: {createdAt: 'desc'},
      },
    },
    // orderBy: { flaggedAt: 'desc' }
  });
  return files;
};

export const flagFile = async (input: {fileId: string; reason: string; adminId: string}) => {
  const {fileId, reason, adminId} = input;

  const file = await prisma.file.findUnique({
    where: {id: fileId},
    include: {user: true},
  });

  if (!file) {
    // const err: any = new Error('File not found!');
    // err.statusCode = 404;
    // throw err;
    throw new Error('File not found!');
  }

  if (file.isDeleted) {
    throw new Error('File has been deleted!');
  }

  if (file.isFlagged) {
    throw new Error('File has been flagged already!');
  }

  const review = await prisma.fileReview.create({
    data: {
      fileId,
      adminId,
      verdict: 'PENDING',
      reason,
    },
  });

  // Update file status
  const updatedFile = await prisma.file.update({
    where: {id: fileId},
    data: {
      status: 'FLAGGED',
      isFlagged: true,
      flaggedBy: adminId,
    },
  });

  return {
    success: true,
    file: updatedFile,
    review,
    message: 'File flagged successfully!',
  };
};

export const flagFileAsUnsafe = async (input: {
  fileId: string;
  reason: string;
  adminId: string;
}) => {
  const {fileId, reason, adminId} = input;

  const file = await prisma.file.findUnique({
    where: {id: fileId},
    include: {user: true},
  });

  if (!file) {
    throw new Error('File not found!');
  }

  if (file.isDeleted) {
    throw new Error('File has been deleted!');
  }

  const review = await prisma.fileReview.create({
    data: {
      fileId,
      adminId,
      verdict: 'REJECTED',
      reason,
    },
  });

  const updatedFile = await prisma.file.update({
    where: {id: fileId},
    data: {
      status: 'UNSAFE',
      isFlagged: true,
      flaggedBy: adminId,
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: adminId,
    },
  });

  const uploadService = new UploadService();

  await uploadService.deleteFromS3(file.s3Key, config.s3Bucket!);

  return {
    success: true,
    file: updatedFile,
    review,
    message: 'File deleted successfully!',
  };
};

export const unflagFile = async (input: {fileId: string; reason: string; adminId: string}) => {
  const {fileId, reason, adminId} = input;

  const file = await prisma.file.findUnique({
    where: {id: fileId},
    include: {user: true},
  });

  if (!file) {
    throw new Error('File not found!');
  }

  if (file.isDeleted) {
    throw new Error('File has been deleted!');
  }

  const review = await prisma.fileReview.create({
    data: {
      fileId,
      adminId,
      verdict: 'APPROVED',
      reason,
    },
  });

  // Update file status
  const updatedFile = await prisma.file.update({
    where: {id: fileId},
    data: {
      status: 'ACTIVE',
      isFlagged: false,
      flaggedBy: adminId,
    },
  });

  return {
    success: true,
    file: updatedFile,
    review,
  };
};
