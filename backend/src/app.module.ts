import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    AuthModule,
    ContactModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/contactList')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
