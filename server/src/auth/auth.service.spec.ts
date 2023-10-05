import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UtilsModule } from '../utils/utils.module';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../utils/utils.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthProfile } from '../mapper/auth-mapper';
import { AppModule } from '../app.module';
import { AuthenticatedUserDTO, LoginUserDTO } from 'src/users/dtos/user-dtos';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UtilsModule,
        UsersModule, 
        PassportModule.register({session:true}),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: {expiresIn: '3600s'}
        })],
      providers: [
        AuthService, 
        LocalStrategy, 
        JwtStrategy, 
        SessionSerializer,
        AuthProfile],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('validateUser', () => {
    it('should be validate user', async() => {
      const testLoginUserDTO: LoginUserDTO = {
        email:'testuser@test.com',
        password:'8karakter'
      };
      const validatedUser = await service.validateUser(testLoginUserDTO);
      expect(validatedUser).toBeDefined();
      expect(validatedUser.userEmail).toBe('testuser@test.com');
      expect(validatedUser.userName).toBe('testuser');
    });
  });

  describe('loginWithCredentials', () => {
    it('should be login with credentials', async() => {
      const testAuthenticatedUserDTO: AuthenticatedUserDTO = {
        userEmail:'testuser@test.com',
        userName: 'testuser',
        userId:'651dea3074c5da5ab3983cbc',
        access_token:''
      };
      const authenticatedUser = await service.loginWithCredentials(testAuthenticatedUserDTO);
      expect(authenticatedUser).toBeDefined();
      expect(authenticatedUser.userEmail).toBe('testuser@test.com');
      expect(authenticatedUser.userName).toBe('testuser');
      expect(authenticatedUser.access_token).not.toBeNull();
    });
  });
});
