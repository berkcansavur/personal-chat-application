import { Injectable,NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { promisify } from "util";
import { scrypt as _scrypt} from "crypto";
import { LoginUserDTO } from 'src/users/dtos/login-user.dto';
const scrypt = promisify(_scrypt);
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUserDTO } from 'src/users/dtos/authenticated-user.dto';
import { CurrentUserDTO } from 'src/users/dtos/current-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtTokenService :JwtService
    ) {}
  
  async validateUser(body: LoginUserDTO): Promise<any> {
    const {email, password } = body;
    const user = await this.userService.findUserByEmail({email});
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
  async loginWithCredentials(user: CurrentUserDTO){
    const payload = {
      sub:user.userId,
      email:user.userEmail,
    }
    const access_token = this.jwtTokenService.sign(payload);
    const authenticatedUser = new AuthenticatedUserDTO();
    authenticatedUser.access_token = access_token;
    authenticatedUser.userId = user.userId;
    authenticatedUser.userEmail = user.userEmail;
    authenticatedUser.userName = user.userName;
    return authenticatedUser;
    
  }
}