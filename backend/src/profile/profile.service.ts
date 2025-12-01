import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async create(createProfileDto: any): Promise<Profile> {
    const createdProfile = new this.profileModel(createProfileDto);
    return createdProfile.save();
  }

  async findOne(): Promise<Profile | null> {
    return this.profileModel.findOne().exec();
  }

  async update(id: string, updateProfileDto: any): Promise<Profile | null> {
    return this.profileModel
      .findByIdAndUpdate(id, updateProfileDto, { new: true })
      .exec();
  }
}
