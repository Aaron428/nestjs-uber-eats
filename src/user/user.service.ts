import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateUserInput, FindUserRes } from './dots/create-user.dto';
import { LoginUserInput } from './dots/login.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 通过 email 字段查询用户是否存在
  async getUserByEmail(email: string): Promise<FindUserRes> {
    try {
      const targetUser = await this.user.findOne({ where: { email } });
      return { ok: !!targetUser, user: targetUser };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getUserById(id: string) {
    try {
      const targetUser = await this.user.findOne({ where: { id } });
      return { ok: !!targetUser, user: targetUser };
    } catch (error) {
      return { ok: false, error };
    }
  }

  // 创建用户
  async createAccount(createUserInput: CreateUserInput) {
    try {
      const checkEmailIsUsed = await this.getUserByEmail(createUserInput.email);
      if (checkEmailIsUsed) {
        return { ok: false, error: '邮箱已被使用' };
      }
      const newUser = this.user.create(createUserInput);
      const res = await this.user.save(newUser);
      const token = this.jwtService.sign({ id: res.id });
      return { ok: true, error: null, token };
    } catch (e) {
      console.log(e);
      return { ok: false, error: '创建用户失败' };
    }
  }

  // 用户登陆
  async userLogin({ email, password }: LoginUserInput) {
    try {
      const user = await this.user.findOne({
        where: { email },
        select: ['password'],
      });
      if (!user) return { ok: false, error: '用户名或密码错误' };

      const isValidUser = await user.checkPassword(password);
      if (!isValidUser) return { ok: false, error: '用户名或密码错误' };

      return { ok: true, token: this.jwtService.sign({ id: user.id }) };
    } catch (e) {
      console.log(e);
      return { ok: false, token: null, error: '登陆失败' };
    }
  }
}
