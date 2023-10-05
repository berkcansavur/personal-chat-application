import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AppModule } from '../app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnUserProfile, UserSchema } from './users.model';
import { PassportModule } from '@nestjs/passport';
import { UtilsModule } from '../utils/utils.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersRepository } from './users.repository';
import { UserProfile } from '../mapper/user-mapper';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CreateUserDTO, MapUserInfoDTO } from './dtos/user-dtos';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        AppModule,
        PassportModule,
        UtilsModule,
        NotificationsModule,
        MongooseModule.forFeature([{ name:'Users',schema: UserSchema}]),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
        UsersService,
        UsersRepository,
        UserProfile
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createUser', () => {
    it('should creates User with correct structure', async () => {

      const testCreateUserDto : CreateUserDTO = {
        name:'Test User Name',
        email: 'testuser@example.com',
        password: 'test-password',
        ChatGroups:[],
        Friends:[],
      }

      const testUser = await service.createUser({createUserDTO:testCreateUserDto});
      expect(testUser).toBeDefined();
      expect(testUser.name).toBe('Test User Name');
      expect(testUser.email).toBe('testuser@example.com');
      expect(testUser.Friends.length).toBe(0);
      expect(testUser.ChatGroups.length).toBe(0);

    });
  });
  describe('findUser', () => {
    it('should find User and return correct structure', async () => {

      const testUserId ='651df1f3b08ecc894f8d2c22'

      const testUser = await service.findUser({userId:testUserId});
      expect(testUser).toBeDefined();
      expect(testUser.UserId).toBe('651df1f3b08ecc894f8d2c22');
      expect(testUser.UserName).toBe('Test User Name');
      expect(testUser.UserEmail).toBe('testuser@example.com');
      expect(testUser.Friends.length).toBeDefined();
      expect(testUser.ChatGroups.length).toBeDefined();

    });
});
describe('getUserToBeValidate', () => {
  it('should find User and return correct structure by credentials', async () => {

    const testUserId ='651df1f3b08ecc894f8d2c22'

    const testUser = await service.getUserToBeValidate({userId:testUserId});
    expect(testUser).toBeDefined();
    expect(testUser._id).toEqual('651df1f3b08ecc894f8d2c22');
    expect(testUser.email).toBe('testuser@example.com');
    expect(testUser.password).toBe('testpassword');


  });
});
describe('findUserByEmail', () => {
  it('should find User and return correct structure by email', async () => {

    const testUserEmail = 'berkcansavur@gmail.com'

    const testUser = await service.findUserByEmail({email:testUserEmail});
    expect(testUser).toBeDefined();
    expect(testUser.UserId).toBe('6519fe2013b8c9f269d615c4');
    expect(testUser.UserEmail).toBe('berkcansavur@gmail.com');
    expect(testUser.UserName).toBe('berkcansavur');
    expect(testUser.ChatGroups.length).toBeGreaterThan(0);
    expect(testUser.ChatGroups.length).toBeGreaterThan(0);


  });
});

describe('addChatGroupToUser', () => {
  it('should add chat group to the user correctly', async () => {

    const testUserId = '651df1f3b08ecc894f8d2c22';
    const testChatGroupId = '651dec1e3401959dfa153aca';

    const testUser = await service.addChatGroupToUser({userId: testUserId, chatGroupId:testChatGroupId});
    expect(testUser).toBeDefined();
    expect(testUser.UserId).toBe('651df1f3b08ecc894f8d2c22');
    expect(testUser.UserEmail).toBe('testuser@example.com');
    expect(testUser.UserName).toBe('Test User Name');
    expect(testUser.ChatGroups.length).toBeGreaterThanOrEqual(1);
    const chatGroupId = testUser.ChatGroups.map((chatGroup)=>{
      if(chatGroup === '651df1f3b08ecc894f8d2c22'){
        expect(chatGroup).toBe('651df1f3b08ecc894f8d2c22');
      }
    });
    if(!chatGroupId){
      throw new Error('Chat Group id is not equal');
    }
  });
});

describe('removeChatGroupFromUser', () => {
  it('should remove chat group from the user correctly', async () => {

    const testUserId = '651df1f3b08ecc894f8d2c22';
    const testChatGroupId = '651dec1e3401959dfa153aca';

    const testUser = await service.removeChatGroupFromUser({userId: testUserId, chatGroupId:testChatGroupId});
    expect(testUser).toBeDefined();
    expect(testUser.UserId).toBe('651df1f3b08ecc894f8d2c22');
    expect(testUser.UserEmail).toBe('testuser@example.com');
    expect(testUser.UserName).toBe('Test User Name');
    testUser.ChatGroups.map((chatGroup)=>{
      if(chatGroup === '651df1f3b08ecc894f8d2c22'){
        expect(chatGroup).toThrowError('chat group Id is containing');
      }
    });
  });
});
describe('addFriend', () => {
  it('should add friend to the user correctly', async () => {

    const testUserId = '651df1f3b08ecc894f8d2c22';
    const testFriendId = '6519fe2013b8c9f269d615c4';

    const testUser = await service.addFriend({userId: testUserId, friendId:testFriendId});
    expect(testUser).toBeDefined();
    expect(testUser._id).toBe('651df1f3b08ecc894f8d2c22');
    expect(testUser.email).toBe('testuser@example.com');
    expect(testUser.name).toBe('Test User Name');
  });
});
describe('removeFriend', () => {
  it('should add friend to the user correctly', async () => {

    const testUserId = '651df1f3b08ecc894f8d2c22';
    const testFriendId = '6519fe2013b8c9f269d615c4';

    const testUser = await service.removeFriend({userId: testUserId, friendId:testFriendId});
    expect(testUser).toBeDefined();
    expect(testUser._id).toBe('651df1f3b08ecc894f8d2c22');
    expect(testUser.email).toBe('testuser@example.com');
    expect(testUser.name).toBe('Test User Name');
  });
});
describe('getFriendIdsOfUser', () => {
  it('should return Friends array of user as string ids', async () => {

    const testUserId = '6519fe2013b8c9f269d615c4';

    const testUserIds = await service.getFriendIdsOfUser({userId: testUserId});
    expect(testUserIds).toBeDefined();
    const userIds = testUserIds.map((userId) =>{
      expect(userId).toBeDefined();
    })
    expect(userIds).toBeDefined();
    expect(userIds.length).toBeGreaterThanOrEqual(1);
  });
});
describe('getUsersFriendsInfo', () => {
  it('should return Friends Info of user as expected structure and number', async () => {

    const testUserIds = ['6519fe4413b8c9f269d615d2','651dea3074c5da5ab3983cbc'];

    const testUserFriendsInfo = await service.getUsersFriendsInfo({userIds:testUserIds});
    expect(testUserFriendsInfo).toBeDefined();
    const userProfileInfos = testUserFriendsInfo.map((user) =>{
      expect(user).toBeDefined();
      expect(user._id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.name).toBeDefined();
      
    })
    expect(userProfileInfos).toBeDefined();
    expect(userProfileInfos.length).toBe(2);
  });
});
describe('mapUserProfileInfo', () => {
  it('should map user profiles info in terms of expected structure', async () => {

    const testmapUserInfoDTO: MapUserInfoDTO = {
      UserId: '651dea3074c5da5ab3983cbc',
      UserEmail: 'testuser@test.com',
      UserName: 'testuser',
      FriendsData:[],
      ChatGroupDetails:[]
    }

    const testMappedUserProfileInfo = await service.mapUserProfileInfo({mapUserInfoDTO:testmapUserInfoDTO});
    expect(testMappedUserProfileInfo).toBeDefined();
    expect(testMappedUserProfileInfo.name).toBe('testuser');
    expect(testMappedUserProfileInfo.email).toBe('testuser@test.com');
    expect(testMappedUserProfileInfo).toBeInstanceOf(ReturnUserProfile);
  });
});
describe('removeUsersAccessToken', () => {
  it('should remove usersAccessToken', async () => {

    const testUserId = '651dea3074c5da5ab3983cbc';

    const testUser = await service.removeUsersAccessToken({userId:testUserId});
    expect(testUser).toBeDefined();
    expect(testUser.access_token).toBe(null);
  });
});
describe('searchUser', () => {
  it('should retrun users or null', async () => {

    const searchText1 = 'b';
    const searchText2 = 'berkcansavur';
    const searchText3 = '';
    const searchText4 = 'incorrectText';
    const searchArray = [searchText1, searchText2, searchText3, searchText4];
    searchArray.forEach(async (searchText)=>{
      const searchResult = await service.searchUser({searchText});
      if(searchText===searchText1){
        expect(searchResult).toBeDefined();
        expect(searchResult.length).toBeGreaterThan(0);
      }
      if(searchText === searchText2){
        expect(searchResult).toBeDefined();
        expect(searchResult.length).toBe(1);
        searchResult.map((result) => {
          expect(result).toBeDefined();
          expect(result.name).toBe('berkcansavur');
          expect(result.email).toBe('berkcansavur@gmail.com');
        })
      }
      if(searchText === searchText3){
        expect(searchResult).toBe(null);
      }
      if(searchText === searchText4){
        expect(searchResult).toBe(null);
      }

    })
    
  });
});
  
});
