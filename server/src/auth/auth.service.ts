import { Injectable,NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { promisify } from "util";
import { scrypt as _scrypt} from "crypto";
import { UserDTO } from 'src/users/dtos/user.dto';
const scrypt = promisify(_scrypt);
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtTokenService :JwtService
    ) {}
  
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if(!user){
        throw new NotFoundException('User Not Found');
    }
    const [salt, storedHash] = user.password.split('.');
    
    const hashedPart = (await scrypt(password, salt, 32)) as Buffer;

    if(storedHash === hashedPart.toString('hex')){
      const {_id,name,email} = user;
        return {
            userId:_id,
            userName:name,
            userEmail:email
        };
    }
    return null
  }
  async loginWithCredentials(user:UserDTO){
    const payload = {
      sub:user.userId,
      email:user.email,
    }
    const access_token = this.jwtTokenService.sign(payload);
    return {
      access_token: access_token,
      user:{
        userId:user.userId,
        userName:user.name,
        userEmail:user.email
      }
    }
  }
}