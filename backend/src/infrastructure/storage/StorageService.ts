// Service - Gestion du stockage d'images (local ou S3)

import fs from 'fs/promises';
import path from 'path';
import { config } from '../../config/index.js';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

export class StorageService {
  private s3Client?: S3Client;
  private localStorage: string;

  constructor() {
    this.localStorage = config.LOCAL_STORAGE_PATH;

    if (config.STORAGE_TYPE === 's3') {
      this.s3Client = new S3Client({
        region: config.AWS_REGION,
        credentials: {
          accessKeyId: config.AWS_ACCESS_KEY_ID,
          secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        },
      });
    } else {
      // Créer le dossier local si nécessaire
      this.ensureLocalStorageExists();
    }
  }

  async upload(buffer: Buffer, filename: string, mimetype: string): Promise<UploadResult> {
    if (config.STORAGE_TYPE === 's3' && this.s3Client) {
      return this.uploadToS3(buffer, filename, mimetype);
    } else {
      return this.uploadToLocal(buffer, filename);
    }
  }

  async getUrl(key: string): Promise<string> {
    if (config.STORAGE_TYPE === 's3' && this.s3Client) {
      // Génère une URL signée (expiration 7 jours)
      const command = new GetObjectCommand({
        Bucket: config.AWS_S3_BUCKET,
        Key: key,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 604800 }); // 7 days
    } else {
      // URL locale (relative au serveur)
      return `/uploads/${key}`;
    }
  }

  async delete(key: string): Promise<void> {
    if (config.STORAGE_TYPE === 's3' && this.s3Client) {
      // TODO: Implémenter suppression S3
    } else {
      const filepath = path.join(this.localStorage, key);
      await fs.unlink(filepath);
    }
  }

  private async uploadToS3(buffer: Buffer, filename: string, mimetype: string): Promise<UploadResult> {
    const key = `${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: config.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });

    await this.s3Client!.send(command);

    const url = await this.getUrl(key);

    return {
      url,
      key,
      size: buffer.length,
    };
  }

  private async uploadToLocal(buffer: Buffer, filename: string): Promise<UploadResult> {
    const key = `${Date.now()}-${filename}`;
    const filepath = path.join(this.localStorage, key);

    await fs.writeFile(filepath, buffer);

    const url = `/uploads/${key}`;

    return {
      url,
      key,
      size: buffer.length,
    };
  }

  private async ensureLocalStorageExists(): Promise<void> {
    try {
      await fs.access(this.localStorage);
    } catch {
      await fs.mkdir(this.localStorage, { recursive: true });
    }
  }
}
