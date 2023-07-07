import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto, createdBy: number): Promise<News> {
    try {
      return await this.newsRepository.save({
        ...createNewsDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy,
      });
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<News[]> {
    try {
      return await this.newsRepository.find();
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<News> {
    try {
      return await this.newsRepository.findOneBy({ id });
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  //TODO: add check on userId === createdBy
  async update(
    id: number,
    updateNewsDto: UpdateNewsDto,
  ): Promise<UpdateResult> {
    try {
      return await this.newsRepository.update(
        { id },
        { ...updateNewsDto, updatedAt: new Date().toISOString() },
      );
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  //TODO: add check on userId === createdBy
  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.newsRepository.delete(id);
    } catch (e) {
      Logger.log(e);
      throw new InternalServerErrorException();
    }
  }
}
