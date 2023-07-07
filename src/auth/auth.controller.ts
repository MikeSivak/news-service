import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IAuth } from './interfaces/IAuth';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { DoesUserExist } from './guards/doesUserExists.guard';
import { Response } from 'express';
import { ExtractUserDecorator } from './decorators/extract-user.decorator';
import { ExtractRefreshTokenDecorator } from './decorators/extract-refresh-token.decorator';
import { IRefreshTokenPayload } from './interfaces/IRefreshTokenPayload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any): Promise<IAuth> {
    return this.authService.login(req.user);
  }

  @UseGuards(DoesUserExist)
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<IAuth> {
    return await this.authService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh-token')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @ExtractUserDecorator() user: IRefreshTokenPayload,
    @ExtractRefreshTokenDecorator() refreshToken: string,
  ): Promise<IAuth> {
    const tokens: IAuth = await this.authService.refreshTokens(
      refreshToken,
      user.userId,
    );
    if (tokens) {
      await this.authService.setCookie(res, tokens.refreshToken);
    } else {
      throw new BadRequestException('Something went wrong.');
    }
    return tokens;
  }
}
