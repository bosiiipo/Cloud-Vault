import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { format } from "date-fns";
import { extname } from "path";
import { createId } from "@paralleldrive/cuid2";
import { config } from "../config";
import prisma from "../lib/prisma";

export class UploadService {
  private s3: S3Client;
  private env: string;

  constructor() {
    this.env = config.nodeEnv || "development";

    this.s3 = new S3Client({
      region: "auto",
      endpoint: config.r2Endpoint!, 
      credentials: {
        accessKeyId: config.r2AccessKeyId!,   
        secretAccessKey: config.r2SecretAccessKey!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, bucketType: string, userId: string, folderName?: string) {
    const ext = extname(file.originalname);
    const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
    const key = folderName ? `${folderName}/${createId()}-${timestamp}${ext}` : `${createId()}-${timestamp}${ext}`;

    const bucketName = this.resolveBucket(bucketType);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    // const fileRecord = await prisma.file.create({
    //   data: {
    //     userId,
    //     s3Key: key,
    //     fileName: file.originalname,
    //     size: file.size,
    //     contentType: file.mimetype,
    //     // bucketType: 'cloud-vault',
    //     folderName: folderName || null,
    //   },
    // });

    let folderId: string | null = null;

    if (folderName) {
      const folder = await prisma.folder.findFirst({
        where: {
          name: folderName,
          userId,
        },
      });

      if (folder) {
        folderId = folder.id;
      } else {
        const newFolder = await prisma.folder.create({
          data: {
            name: folderName,
            userId,
          },
        });
        folderId = newFolder.id;
      }
    }

    const fileRecord = await prisma.file.create({
      data: {
        userId,
        s3Key: key,
        fileName: file.originalname,
        size: BigInt(file.size),
        contentType: file.mimetype,
        folderId,  
      },
    });

    return {
      message: "File uploaded successfully!",
      key,
    };
  }

  async uploadMultipleFiles(files: Express.Multer.File[], bucketType: string) {
    console.log("IMPLEMENT")
  }

  // async uploadMultipleFiles(files: Express.Multer.File[], bucketType: string) {
  //   const uploads = await Promise.all(files.map((file) => this.uploadFile(file, bucketType)));
  //   return {
  //     message: "Files uploaded successfully to R2.",
  //     uploads,
  //   };
  // }

  async generateDownloadUrl(fileKey: string, bucketType: string) {
    const bucketName = this.resolveBucket(bucketType);


    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 60 * 60 });

    console.log('Generated URL:', url);
    console.log('URL length:', url.length);

    return { url };
  }

  async deleteFromS3(fileKey: string, bucketType: string) {    
    const command = new DeleteObjectCommand({
      Bucket: bucketType,
      Key: fileKey
    });
    
    await this.s3.send(command);

    return "File deleted successfully!"
  }

  private resolveBucket(bucketType: string): string {
    const bucketNames: Record<string, string> = {
      test: config.s3Bucket!,
    };

    if (["development", "test", "local"].includes(this.env)) {
      return bucketNames.test;
    }

    const bucket = bucketNames[bucketType];
    if (!bucket) throw new Error(`Invalid bucket type: ${bucketType}`);
    return bucket;
  }
}

