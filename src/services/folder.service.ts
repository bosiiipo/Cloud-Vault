import prisma from '../lib/prisma';
import {ResourceNotFound} from '../responses/errors';

export interface getFolderInput {
  folderId: string;
  userId: string;
}

export const getFolder = async (input: getFolderInput) => {
  const {folderId, userId} = input;

  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      userId,
    },
    include: {
      files: true,
      children: true,
    },
  });

  if (!folder) {
    throw new ResourceNotFound('Folder not found');
  }

  return folder;
};

export const getAllFolders = async (userId?: string) => {
  const whereClause = userId ? {userId} : {};

  const folders = await prisma.folder.findMany({
    where: whereClause,
    include: {
      files: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return folders;
};
