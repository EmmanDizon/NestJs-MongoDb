import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { UserSettings } from 'src/schemas/UserSettings.schema';
import { CreateUserDto } from 'src/users/DTO/CreateUser.dto';
import { UpdateUserDto } from 'src/users/DTO/UpdateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name) private settingsModel: Model<UserSettings>,
  ) {}

  fetchUsers() {
    return this.userModel.find().populate(['settings', 'posts']);
  }

  async createUser({ settings, ...userData }: CreateUserDto): Promise<User> {
    try {
      const newSettings = new this.settingsModel(settings);
      const savedNewSettings = await newSettings.save();
      const newUser = new this.userModel({
        ...userData,
        settings: savedNewSettings._id,
      });

      return newUser.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate(['settings', 'posts']);

    if (!user) throw new NotFoundException();
    return user;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
