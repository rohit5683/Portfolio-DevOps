import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { CreateSkillDto, UpdateSkillDto } from './dto/skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const createdSkill = new this.skillModel(createSkillDto);
    return createdSkill.save();
  }

  async findAll(): Promise<Skill[]> {
    return this.skillModel.find().exec();
  }

  async findOne(id: string): Promise<Skill | null> {
    return this.skillModel.findById(id).exec();
  }

  async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<Skill | null> {
    return this.skillModel
      .findByIdAndUpdate(id, updateSkillDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Skill | null> {
    return this.skillModel.findByIdAndDelete(id).exec();
  }
}
