import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly bucketRegion: string;

  constructor(private readonly config: ConfigService) {
    this.bucketName = this.config.getOrThrow<string>('s3.bucketName');
    this.bucketRegion = this.config.getOrThrow<string>('s3.bucketRegion');

    this.s3Client = new S3Client({
      region: this.bucketRegion,
      endpoint: `https://${this.bucketRegion}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('s3.accessKeyId'),
        secretAccessKey: this.config.getOrThrow<string>('s3.secretAccessKey'),
      },
    });
  }

  async create(file: any) {
    try {
      const { originalname, buffer, mimetype } = file;

      const timestamp = new Date().getTime();
      const uniqueName = `${timestamp}-${originalname}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: uniqueName,
          Body: buffer,
          ContentType: mimetype,
          ACL: 'public-read',
        }),
      );

      const accessUrl = `https://${this.bucketName}.${this.bucketRegion}.digitaloceanspaces.com/${uniqueName}`;

      return { image_url: accessUrl };
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException(error.message);
    }
  }

  async update(newFile: any, oldImageKey: string) {
    try {
      const image = await this.create(newFile);
      await this.remove(oldImageKey);
      return image;
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async remove(imageKey: string) {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: this.extractS3HashFromUrl(imageKey),
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));

      return { message: 'Image deleted successfully' };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  private extractS3HashFromUrl(url) {
    const urlParts = url.split('/');
    const hashPart = urlParts[urlParts.length - 1];
    return hashPart;
  }

  private async checkClientInitialization(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await this.s3Client.send(
        new HeadBucketCommand({
          Bucket: this.bucketName,
        }),
      );

      return {
        success: true,
        message: `S3 client initialized successfully. Connected to bucket: ${this.bucketName} in region: ${this.bucketRegion}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `S3 client initialization failed: ${error.message}`,
      };
    }
  }

  private getClientConfig() {
    return {
      region: this.bucketRegion,
      endpoint: `https://${this.bucketRegion}.digitaloceanspaces.com`,
      bucketName: this.bucketName,
      hasCredentials: !!(
        this.config.get('s3.accessKeyId') && this.config.get('s3.secretKey')
      ),
    };
  }

  async checkHealth() {
    const initializationCheck = await this.checkClientInitialization();
    const config = this.getClientConfig();

    return {
      status: initializationCheck.success ? 'healthy' : 'unhealthy',
      message: initializationCheck.message,
      config: {
        region: config.region,
        endpoint: config.endpoint,
        bucketName: config.bucketName,
        hasCredentials: config.hasCredentials,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
