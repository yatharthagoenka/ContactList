import { sign } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { Payload } from './interface/payload.interface';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  
  async signPayload(payload: Payload) {
    return sign(payload, "secretKey", { expiresIn: '3d' });
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }
}
