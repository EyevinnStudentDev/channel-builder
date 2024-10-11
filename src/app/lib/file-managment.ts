import * as Minio from 'minio'
import type internal from 'stream'
 
// init minio client
export const minioClient = new Minio.Client({
  endPoint: process.env.AWS_URL || '',
  port: 443,
  useSSL: process.env.AWS_SSL === 'true',
  accessKey: process.env.AWS_ACCESS_KEY || '',
  secretKey: process.env.AWS_SECRET_ACCESS_KEY || '',
})

export async function createPresignedUrlToUpload({
    bucketName,
    fileName,
    expiry = 60 * 60, // 1 hour
  }: {
    bucketName: string;
    fileName: string;
    expiry?: number;
  }): Promise<string> {
    try {
      // Generate a pre-signed PUT URL for uploading the file to the MinIO bucket
      const presignedUrl = await minioClient.presignedPutObject(bucketName, fileName, expiry);
      return presignedUrl;
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      throw new Error('Failed to generate pre-signed URL');
    }
  }
  