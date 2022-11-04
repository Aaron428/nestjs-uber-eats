import {
  Injectable,
  UnauthorizedException,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    if ('token' in req.headers) {
      const token = req.headers['token'];
      try {
        const decoded = this.jwtService.verify(token);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.userService.getUserById(decoded.id);
          req['user'] = user;
        }
      } catch (e) {
        throw new UnauthorizedException('invalidate token');
      }
    }
    next();
  }
}
