import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experience, ExperienceDocument } from './schemas/experience.schema';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private experienceModel: Model<ExperienceDocument>,
  ) {}

  async create(createExperienceDto: any): Promise<Experience> {
    const createdExperience = new this.experienceModel(createExperienceDto);
    return createdExperience.save();
  }

  async findAll(): Promise<Experience[]> {
    return this.experienceModel.find().exec();
  }

  async findOne(id: string): Promise<Experience | null> {
    return this.experienceModel.findById(id).exec();
  }

  async update(
    id: string,
    updateExperienceDto: any,
  ): Promise<Experience | null> {
    return this.experienceModel
      .findByIdAndUpdate(id, updateExperienceDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Experience | null> {
    return this.experienceModel.findByIdAndDelete(id).exec();
  }
}
