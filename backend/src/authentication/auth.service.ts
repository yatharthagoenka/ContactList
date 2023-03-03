import { sign } from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interface/user.interface';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from './interface/payload';

@Injectable()
export class AuthService {
  constructor( @InjectModel('User') private userModel: Model<User>) {}
  
  async signPayload(payload: Payload) {
    return sign(payload, "secretKey", { expiresIn: '3d' });
  }
  
  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user)
    } else {
      throw new HttpException('Invalid credentials. Try again', HttpStatus.BAD_REQUEST);
    }
  } 
  
  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async create(registerDTO: RegisterDTO) {
      const { email } = registerDTO;
      const user = await this.userModel.findOne({ email });
      if (user) {
          throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const createdUser = new this.userModel(registerDTO);
      await createdUser.save();
      return this.sanitizeUser(createdUser);
  }

  sanitizeUser(user: User) {
      const sanitized = user.toObject();
      delete sanitized['password'];
      return sanitized;
  }
}
