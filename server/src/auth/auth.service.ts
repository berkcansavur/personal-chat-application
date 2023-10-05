import { Injectable,NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { promisify } from "util";
import { scrypt as _scrypt} from "crypto";
import { 
  LoginUserDTO,
  AuthenticatedUserDTO, 
  UserProfileInfoDTO,
  CurrentUserDTO} from '../users/dtos/user-dtos';
const scrypt = promisify(_scrypt);
import { JwtService } from '@nestjs/jwt';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
@Injectable()
export class AuthService {
  constructor(
    @InjectMapper() private readonly AuthMapper: Mapper,
    private readonly userService: UsersService,
    private jwtTokenService :JwtService
    ) {}
  
  async validateUser(
    body: LoginUserDTO
    ): Promise<CurrentUserDTO> {
      const { AuthMapper } = this;
      const {email, password } = body;
      const user = await this.userService.findUserByEmail({email});
      const { UserId } = user
      const userToBeValidated = await this.userService.getUserToBeValidate({userId:UserId})
      if(!user){
          throw new NotFoundException('User Not Found');
      }
      const [salt, storedHash] = userToBeValidated.password.split('.');
      
      const hashedPart = (await scrypt(password, salt, 32)) as Buffer;

      if(storedHash === hashedPart.toString('hex')){
        return AuthMapper.map<UserProfileInfoDTO,CurrentUserDTO>(user,UserProfileInfoDTO,CurrentUserDTO);
      }
      return null
  }
  async loginWithCredentials(user: AuthenticatedUserDTO): Promise<AuthenticatedUserDTO>{
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