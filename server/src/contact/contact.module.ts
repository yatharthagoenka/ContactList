import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { ContactSchema } from './schemas/contact.schema';
import { ContactService } from './contact.service';
import { AuthService } from 'src/authentication/auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }]),
      UserModule
  ],
  providers: [ContactService],
  controllers: [ContactController]
})
export class ContactModule {}
