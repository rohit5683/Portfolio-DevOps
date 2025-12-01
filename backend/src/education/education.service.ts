import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Education, EducationDocument } from './schemas/education.schema';

@Injectable()
export class EducationService {
  constructor(
    @InjectModel(Education.name)
    private educationModel: Model<EducationDocument>,
  ) {}

  async create(createEducationDto: any): Promise<Education> {
    const createdEducation = new this.educationModel(createEducationDto);
    return createdEducation.save();
  }

  async findAll(): Promise<Education[]> {
    return this.educationModel.find().sort({ startDate: -1 }).exec();
  }

  async findOne(id: string): Promise<Education | null> {
    return this.educationModel.findById(id).exec();
  }

  async update(id: string, updateEducationDto: any): Promise<Education | null> {
    return this.educationModel
      .findByIdAndUpdate(id, updateEducationDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Education | null> {
    return this.educationModel.findByIdAndDelete(id).exec();
  }
}
