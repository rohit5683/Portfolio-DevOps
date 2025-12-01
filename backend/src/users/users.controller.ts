import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }

  @Post()
  async create(
    @Body()
    createUserDto: {
      email: string;
      password: string;
      role?: string;
      mfaEnabled?: boolean;
    },
  ) {
    // Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersService.create({
      email: createUserDto.email,
      passwordHash,
      role: createUserDto.role || 'user',
      mfaEnabled:
        createUserDto.mfaEnabled !== undefined
          ? createUserDto.mfaEnabled
          : true,
    });

    return {
      success: true,
      message: 'User created successfully',
      user: {
        _id: (user as any)._id,
        email: user.email,
        role: user.role,
        mfaEnabled: user.mfaEnabled,
      },
    };
  }

  @Patch(':id/mfa')
  async toggleMfa(@Param('id') id: string, @Body('enabled') enabled: boolean) {
    const user = await this.usersService.toggleMfa(id, enabled);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      success: true,
      message: `MFA ${enabled ? 'enabled' : 'disabled'} successfully`,
      user,
    };
  }

  @Patch(':id/mfa-method')
  async updateMfaMethod(
    @Param('id') id: string,
    @Body('method') method: string,
  ) {
    const user = await this.usersService.update(id, { mfaMethod: method });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      success: true,
      message: `MFA method updated to ${method}`,
      user,
    };
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body('password') password: string,
  ) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.update(id, { passwordHash });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      success: true,
      message: 'Password updated successfully',
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const user = await this.usersService.delete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
