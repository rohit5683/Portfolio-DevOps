import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('file/:id')
  async getFileById(@Param('id') id: string, @Res() res: Response) {
    return this.serveFile(id, res);
  }

  @Get('file/:id/:filename')
  async getFileByIdAndFilename(@Param('id') id: string, @Res() res: Response) {
    return this.serveFile(id, res);
  }

  private async serveFile(id: string, res: Response) {
    const file = await this.uploadService.getFile(id);
    res.set({
      'Content-Type': file.contentType,
      'Content-Length': file.size,
      'Content-Disposition': `inline; filename="${file.filename}"`,
    });
    res.send(file.data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('projects')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async uploadProjectImages(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadedFiles = await Promise.all(
      files.map((file) => this.uploadService.saveFile(file)),
    );

    const fileUrls = uploadedFiles.map(
      (file) => `/upload/file/${file._id}/${encodeURIComponent(file.filename)}`,
    );

    return {
      message: 'Files uploaded successfully',
      urls: fileUrls,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('education')
  @UseInterceptors(
    FilesInterceptor('documents', 10, {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/)) {
          return callback(
            new Error('Only image and PDF files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async uploadEducationDocuments(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedFiles = await Promise.all(
      files.map((file) => this.uploadService.saveFile(file)),
    );

    const fileUrls = uploadedFiles.map(
      (file) => `/upload/file/${file._id}/${encodeURIComponent(file.filename)}`,
    );

    return {
      message: 'Education documents uploaded successfully',
      urls: fileUrls,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('skills')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|svg\+xml|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadSkillIcon(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }

    const savedFile = await this.uploadService.saveFile(file);

    return {
      url: `/upload/file/${savedFile._id}/${encodeURIComponent(savedFile.filename)}`,
    };
  }
}
