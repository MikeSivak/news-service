import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  //TODO: implement guard to get user info -> set createdBy = userId from req;
  @Post()
  async create(@Body() createNewsDto: CreateNewsDto): Promise<News> {
    return await this.newsService.create(createNewsDto);
  }

  @Get()
  async findAll(): Promise<News[]> {
    return await this.newsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<News> {
    return await this.newsService.findOne(id);
  }

  //TODO: implement guard to get user info -> check if createdBy = userId from req;
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
  ): Promise<boolean> {
    const updatedNews: UpdateResult = await this.newsService.update(
      id,
      updateNewsDto,
    );
    if (!updatedNews?.affected) {
      throw new NotFoundException(`News with id = ${id} doesn't exists.`);
    }
    return true;
  }

  //TODO: implement guard to get user info -> check if createdBy = userId from req;
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const deletedNews: DeleteResult = await this.newsService.remove(id);
    if (!deletedNews?.affected) {
      throw new NotFoundException(`News with id = ${id} doesn't exists.`);
    }
    return true;
  }
}
