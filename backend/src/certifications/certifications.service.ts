import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Certification,
  CertificationDocument,
} from './schemas/certification.schema';

@Injectable()
export class CertificationsService {
  constructor(
    @InjectModel(Certification.name)
    private certificationModel: Model<CertificationDocument>,
  ) {}

  async create(createCertificationDto: any): Promise<Certification> {
    const createdCertification = new this.certificationModel(
      createCertificationDto,
    );
    return createdCertification.save();
  }

  async findAll(): Promise<Certification[]> {
    return this.certificationModel.find().sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<Certification> {
    const certification = await this.certificationModel.findById(id).exec();
    if (!certification) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }
    return certification;
  }

  async update(
    id: string,
    updateCertificationDto: any,
  ): Promise<Certification> {
    const updatedCertification = await this.certificationModel
      .findByIdAndUpdate(id, updateCertificationDto, { new: true })
      .exec();
    if (!updatedCertification) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }
    return updatedCertification;
  }

  async remove(id: string): Promise<Certification> {
    const deletedCertification = await this.certificationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCertification) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }
    return deletedCertification;
  }
}
