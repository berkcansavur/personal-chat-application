import { MiddlewareConsumer, Module , ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import {  ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ChatGateway } from './chat/chat.gateway';
import { ChatGroupsModule } from './chat-groups/chat-groups.module';
import { AuthModule } from './auth/auth.module';
const cookieSession = require('cookie-session');
import { SessionModule } from 'nestjs-session';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }),
    SessionModule.forRoot({
      session: {
        secret: 'keyboard',
        resave: false,
        saveUninitialized: false
      },
    }),
    MongooseModule.forRoot('mongodb+srv://berkcansavur:8karakter@cluster0.duok4hv.mongodb.net/?retryWrites=true&w=majority'),
    UsersModule,
    ChatGroupsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_PIPE,
    useValue:new ValidationPipe({
      whitelist:true
    })
  }, ChatGateway],
})
export class AppModule {
  
  configure( consumer: MiddlewareConsumer){
    consumer
      .apply(cookieSession({
        keys:['DOMinicALTAN']
      }))
      .forRoutes('*');
      
    consumer.apply((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    })
    .forRoutes('*');
  }
}
