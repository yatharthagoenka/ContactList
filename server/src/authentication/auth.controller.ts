import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Role } from "./interface/interfaces";
import { Roles } from "./decorator";
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

    @Get('/protected')
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles(Role.ADMIN)
    async testRoute() {
        return {message: "Accessed by admin"};
    }

    @Post('register')
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles(Role.ADMIN)
    async register(@Body() registerDTO: RegisterDTO) {
        const user = await this.userService.create(registerDTO);
        const payload = {
            email: user.email,
        };
    
        const token = await this.authService.signPayload(payload);
        return { user, token };
    }
    
    @Post('login')
    async login(@Body() loginDTO: LoginDTO) {
      const user = await this.userService.findByLogin(loginDTO);
      const payload = {
        email: user.email,
      };
      const token = await this.authService.signPayload(payload);
      return { user, token};
    }

}