import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperienceModule } from './experience/experience.module';
import { EducationModule } from './education/education.module';
import { SkillsModule } from './skills/skills.module';
import { UploadModule } from './upload/upload.module';
import { EmailModule } from './email/email.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300000, // 5 minutes in milliseconds
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: 'portfolio-devops',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProfileModule,
    ProjectsModule,
    ExperienceModule,
    EducationModule,
    SkillsModule,
    SkillsModule,
    UploadModule,
    EmailModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
