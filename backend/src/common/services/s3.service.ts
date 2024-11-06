import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private bucket = process.env.S3_BUCKET || '';

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: process.env.S3_HOST || '',
      credentials: {
        accessKeyId: process.env.S3_KEY || '',
        secretAccessKey: process.env.S3_SECRET || ''
      },
      s3ForcePathStyle: true
    });
  }

  async uploadFile(file: Express.Multer.File, key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    return this.s3.upload(params).promise();
  }

  getFileStream(key: string): any {
    const params = { Bucket: this.bucket, Key: key };
    return this.s3.getObject(params).createReadStream();
  }

  async deleteFile(key: string): Promise<void> {
    const params = { Bucket: this.bucket, Key: key };
    await this.s3.deleteObject(params).promise();
  }
}
