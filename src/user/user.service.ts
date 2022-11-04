import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserResponse } from './dots/create-user.dto';
import { LoginUserInput } from './dots/login.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 通过 email 字段查询用户是否存在
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.user.findOne({ where: { email } });
  }

  async getUserById(id: string) {
    return await this.user.findOne({ where: { id } });
  }

  // 创建用户
  async createAccount(createUserInput: CreateUserInput) {
    const response: CreateUserResponse = { ok: false };
    const checkEmailIsUsed = await this.getUserByEmail(createUserInput.email);
    if (checkEmailIsUsed) {
      Object.assign(response, { ok: false, error: '邮箱已被使用' });
      return response;
    }
    const newUser = this.user.create(createUserInput);
    const res = await this.user.save(newUser);
    const token = this.jwtService.sign({ id: res.id });
    Object.assign(response, { ok: true, error: null, token });
    return response;
  }

  // 用户登陆
  async userLogin({ email, password }: LoginUserInput) {
    const user = await this.getUserByEmail(email);
    if (!user) return { ok: false, error: '用户名或密码错误' };

    const isValidUser = await user.checkPassword(password);
    if (!isValidUser) return { ok: false, error: '用户名或密码错误' };

    return { ok: true, token: this.jwtService.sign({ id: user.id }) };
  }
}
