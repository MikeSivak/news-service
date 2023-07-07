import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { hashDataHelper } from '../shared/helpers/hash-data.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save({
        ...createUserDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  async findOneByUserName(username: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ username });
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    try {
      return await this.userRepository.update(
        { id },
        { ...updateUserDto, updatedAt: new Date().toISOString() },
      );
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  async updateRefreshToken(
    userId: number,
    refreshToken?: string,
  ): Promise<boolean> {
    const hashedToken = refreshToken
      ? await hashDataHelper(refreshToken)
      : null;
    console.log(hashedToken);
    try {
      const updatedUser: UpdateResult = await this.userRepository.update(
        { id: userId },
        { refreshToken: hashedToken },
      );
      if (updatedUser?.affected) return true;
    } catch (e) {
      Logger.log(e);
      throw new BadRequestException();
    }
    return false;
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.userRepository.delete(id);
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }
}
