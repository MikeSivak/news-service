import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IAuth } from './interfaces/IAuth';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { DoesUserExist } from './guards/doesUserExists.guard';
import { LoginDto } from './dto/login.dto';

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
}
