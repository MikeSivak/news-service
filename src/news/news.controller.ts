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
  UseGuards,
  Req,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @Req() req: any,
  ): Promise<News> {
    return await this.newsService.create(createNewsDto, req.user?.id);
  }

  @Get()
  async findAll(): Promise<News[]> {
    return await this.newsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<News> {
    return await this.newsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const deletedNews: DeleteResult = await this.newsService.remove(id);
    if (!deletedNews?.affected) {
      throw new NotFoundException(`News with id = ${id} doesn't exists.`);
    }
    return true;
  }
}
