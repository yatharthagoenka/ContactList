import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
      ) {}

    @Post('register')
    async register(@Body() registerDTO: RegisterDTO) {
        const user = await this.authService.create(registerDTO);
        const payload = {
            email: user.email,
        };
    
        const token = await this.authService.signPayload(payload);
        return { user, token };
    }
    
    @Post('login')
    async login(@Body() loginDTO: LoginDTO) {
      const user = await this.authService.findByLogin(loginDTO);
      const payload = {
        email: user.email,
      };
      const token = await this.authService.signPayload(payload);
      return { user, token};
    }

}