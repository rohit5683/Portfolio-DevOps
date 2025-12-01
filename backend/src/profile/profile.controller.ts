import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile() {
    return this.profileService.findOne();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createProfile(@Body() body: any) {
    return this.profileService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateProfile(@Param('id') id: string, @Body() body: any) {
    return this.profileService.update(id, body);
  }
}
