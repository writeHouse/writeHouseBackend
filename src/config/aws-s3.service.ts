import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import logger from '../utils/logger';

const {
  URL_EXPIRATION_SECONDS = 300,
  AWS_BUCKET = 'writehouse-sandbox',
  AWS_REGION = 'us-east-1',
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export interface GetUploadUrlParams {
  fileName: string;
  fileType?: string;
}

export const getUploadURL = async ({
  fileName,
  fileType,
}: GetUploadUrlParams): Promise<{ signedUrl: string | null }> => {
  try {
    const s3Params = {
      Bucket: AWS_BUCKET,
      Key: fileName,
      ContentType: fileType || 'image/jpeg',
    };

    const command = new PutObjectCommand(s3Params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: Number(URL_EXPIRATION_SECONDS) });

    return { signedUrl };
  } catch (error) {
    logger.error(error);
    return { signedUrl: null };
  }
};
