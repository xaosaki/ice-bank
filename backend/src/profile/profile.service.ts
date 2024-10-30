import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../common/models/user.model';
import { ProfileDTO } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async getProfile(userId: string): Promise<ProfileDTO> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return new ProfileDTO(user.toDTO());
  }
}
