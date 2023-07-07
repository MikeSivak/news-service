import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuth } from './interfaces/IAuth';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findOneByUserName(username);
    if (!user) {
      return null;
    }
    const match: Boolean = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }

  public async login(user: any): Promise<IAuth> {
    return await this.generateToken(user);
  }

  public async create(createUserDto: CreateUserDto): Promise<IAuth> {
    const pass: string = await this.hashPassword(createUserDto.password);
    const newUser: User = await this.usersService.create({
      ...createUserDto,
      password: pass,
    });
    const { password, ...result } = newUser;
    return await this.generateToken(result);
  }

  private async generateToken(user: any): Promise<IAuth> {
    const accessToken: string = await this.jwtService.signAsync(
      { ...user },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      },
    );
    const refreshPayload = {
      userId: user.id,
    };
    const refreshToken: string = await this.jwtService.signAsync(
      refreshPayload,
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      },
    );
    await this.usersService.updateRefreshToken(user.id, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<Boolean> {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  async refreshTokens(refreshToken, userId): Promise<IAuth> {
    const user: User = await this.usersService.findOne(userId);
    if (!user.refreshToken) {
      throw new UnauthorizedException(`refresh token doesn't exist.`);
    }
    const compareRefresh: boolean = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!compareRefresh) {
      throw new UnauthorizedException('refresh token invalid.');
    }
    const payload = {
      id: user.id,
      username: user.username,
      refreshToken: user.refreshToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const tokens: IAuth = await this.generateToken(payload);
    const updatedRefreshToken: boolean =
      await this.usersService.updateRefreshToken(userId, tokens.refreshToken);
    if (updatedRefreshToken) {
      return tokens;
    }
  }

  async setCookie(res: any, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
  }
}
