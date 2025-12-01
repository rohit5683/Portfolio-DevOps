import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
export class UploadController {
  @UseGuards(AuthGuard('jwt'))
  @Post('projects')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/projects',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `project-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
      },
    }),
  )
  uploadProjectImages(@UploadedFiles() files: Express.Multer.File[]) {
    const fileUrls = files.map(
      (file) =>
        `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/projects/${file.filename}`,
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
      storage: diskStorage({
        destination: './uploads/education',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `education-${uniqueSuffix}${ext}`);
        },
      }),
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
        fileSize: 50 * 1024 * 1024, // 50MB limit for documents
      },
    }),
  )
  uploadEducationDocuments(@UploadedFiles() files: Express.Multer.File[]) {
    const fileUrls = files.map(
      (file) =>
        `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/education/${file.filename}`,
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
      storage: diskStorage({
        destination: './uploads/skills',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `skill-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|svg\+xml|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  uploadSkillIcon(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }
    return {
      url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/skills/${file.filename}`,
    };
  }
}
