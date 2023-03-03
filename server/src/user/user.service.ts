import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginDTO, RegisterDTO } from '../authentication/dto/auth.dto';
import { Payload } from '../authentication/interface/payload.interface';
import { User } from '../authentication/interface/user.interface';
import * as mongoose from 'mongoose';

@Injectable()
export class UserService {
    constructor( @InjectModel('User') private userModel: Model<User>) {}

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

    async findByLogin(UserDTO: LoginDTO) {
        const { email, password } = UserDTO;
        const user = await this.userModel
          .findOne({ email })
          .select('email password');
        if (!user) {
          throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
        }
        if (await bcrypt.compare(password, user.password)) {
          return this.sanitizeUser(user)
        } else {
          throw new HttpException('Invalid credentials. Try again', HttpStatus.BAD_REQUEST);
        }
    }
      
    async findById(id: string) {
        const userID = { _id: new ObjectId(id) };
        return await this.userModel.findById(userID);
    }

    async findByPayload(payload: Payload) {
        const { email } = payload;
        return await this.userModel.findOne({ email });
    }

    sanitizeUser(user: User) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
    }
}