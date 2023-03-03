import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { ContactSchema } from './schemas/contact.schema';
import { ContactService } from './contact.service';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }]),
  ],
  providers: [ContactService],
  controllers: [ContactController]
})
export class ContactModule {}
