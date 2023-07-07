import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuth } from './interfaces/IAuth';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
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
    const token: string = await this.generateToken(user);
    return { user, token };
  }

  public async create(createUserDto: CreateUserDto): Promise<IAuth> {
    const pass: string = await this.hashPassword(createUserDto.password);
    const newUser: User = await this.usersService.create({
      ...createUserDto,
      password: pass,
    });
    const { password, ...result } = newUser;
    const token: string = await this.generateToken(result);
    return { user: result, token };
  }

  private async generateToken(user: any): Promise<string> {
    return await this.jwtService.signAsync(user);
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
}
