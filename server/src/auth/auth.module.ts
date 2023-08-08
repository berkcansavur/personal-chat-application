import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { UtilsModule } from '../utils/utils.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/utils.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UtilsModule,UsersModule, PassportModule.register({session:true}),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '3600s'}
    })],
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer],
  exports:[ AuthService ]
})
export class AuthModule {}
