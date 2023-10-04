// JwtStrategy for handling Passport JWT

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../utils/utils.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret
    });
  }

  async validate(payload: any) {
    // validating payload here
    const userId = payload.sub
    const username = payload.email 
    return {userId, username}
  }
}
