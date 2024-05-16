import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';
import { CreateUserDto } from 'src/users/DTO/CreateUser.dto';
import { UpdateUserDto } from 'src/users/DTO/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  private isValidId(id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new NotFoundException();
  }

  @Get()
  getUsers() {
    return this.userService.fetchUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    this.isValidId(id);
    return this.userService.getUserById(id);
  }

  @Post()
  //@UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const createdUser = await this.userService.createUser(createUserDto);

    res.status(HttpStatus.CREATED).json({ data: createdUser });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    this.isValidId(id);

    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    if (!updatedUser) throw new NotFoundException();

    res
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'User updated successfully', result: updatedUser });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    this.isValidId(id);

    const deletedUser = await this.userService.deleteUser(id);
    if (!deletedUser) throw new NotFoundException();

    res
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'User deleted successfully', result: deletedUser });
  }
}
