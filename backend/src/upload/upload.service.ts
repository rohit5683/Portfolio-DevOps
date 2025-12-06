import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';

@Injectable()
export class UploadService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async saveFile(file: Express.Multer.File): Promise<FileDocument> {
    const newFile = new this.fileModel({
      filename: file.originalname,
      contentType: file.mimetype,
      data: file.buffer,
      size: file.size,
    });
    return newFile.save();
  }

  async getFile(id: string): Promise<FileDocument> {
    const file = await this.fileModel.findById(id).exec();
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }
}
