import { Test, TestingModule } from '@nestjs/testing';
import { ChatGroupsService } from './chat-groups.service';
import { AppModule } from '../app.module';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGroupsProfile } from '../mapper/chat-groups-mapper';
import { ChatGroupsRepository } from './chat-groups.repository';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { ChatGroupsSchema } from './chat-groups.model';
import { CreateChatGroupDTO, UpdateChatGroupsNameDTO } from './dtos/chat-group-dtos';

describe('ChatGroupsService', () => {
  let service: ChatGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        AppModule,
        UsersModule,
        MongooseModule.forFeature([{name:'ChatGroups', schema:ChatGroupsSchema}]),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
        ChatGroupsService,
        ChatGroupsRepository,
        ChatGroupsProfile
      ],
    }).compile();

    service = module.get<ChatGroupsService>(ChatGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createChatGroup', () => {
    it('should creates Chat Group as expected structure', async () => {
      const testCreateChatGroupDto: CreateChatGroupDTO = {
        chatGroupName:'Unit Test Created Chat Group',
        users:[]
      }
      const newChatGroup = await service.createChatGroup({createChatGroupDTO:testCreateChatGroupDto});
      expect(newChatGroup).toBeDefined();
      expect(newChatGroup.users.length).toBe(0);
      expect(newChatGroup.chatGroupName).toBe('Unit Test Created Chat Group');
      expect(newChatGroup.users).toBeDefined();
      expect(newChatGroup.users.length).toBe(0);
      
    });
  });
  describe('deleteChatGroup', () => {
    it('should removes Chat Group as expected structure', async () => {
      const testChatGroupId = '651e140b5c8f60cc2b6ad747'
      const deletedChatGroup = await service.deleteChatGroup({chatGroupId:testChatGroupId});
      expect(deletedChatGroup).toBeDefined();
      expect(deletedChatGroup.chatGroupName).toBe('Unit Test Created Chat Group');
      expect(deletedChatGroup.users).toBeDefined();
      expect(deletedChatGroup.users.length).toBe(0);
      
    });
  });
  describe('getChatGroup', () => {
    it('should gets Chat Group as expected structure', async () => {
      const testChatGroupId = '651a267e6a7119289b459043'
      const chatGroup = await service.getChatGroup({chatGroupId:testChatGroupId});
      expect(chatGroup).toBeDefined();
      expect(chatGroup.chatGroupName).toBe('Berkcanın Grubu');
      expect(chatGroup.users).toBeDefined();
      expect(chatGroup.users.length).toBe(3);
      expect(chatGroup._id).toBe('651a267e6a7119289b459043');
      
    });
  });
  describe('getChatGroup', () => {
    it('should gets Chat Group as expected structure', async () => {
      const testChatGroupId1 = '651a267e6a7119289b459043';
      const testChatGroupId2 = '651a2f5f90cc7f81f3d2f377';
      const testChatGroupIds = [testChatGroupId1,testChatGroupId2];
      const chatGroups = await service.getChatGroupDetails({chatGroups:testChatGroupIds});
      expect(chatGroups).toBeDefined();
      chatGroups.map(async (chatGroup) => {
        expect(chatGroup._id).toBeDefined();
        expect(chatGroup.chatGroupName).toBeDefined();
        expect(chatGroup.users).toBeDefined();
        if(chatGroup._id === testChatGroupId1) {
          expect(chatGroup._id).toBe('651a267e6a7119289b459043');
          expect(chatGroup.chatGroupName).toBe('Berkcanın Grubu');
          expect(chatGroup.users.length).toBe(3);
        }
        if(chatGroup._id === testChatGroupId2) {
          expect(chatGroup._id).toBe('651a2f5f90cc7f81f3d2f377');
          expect(chatGroup.chatGroupName).toBe('Berkcanın 2. grubu');
          expect(chatGroup.users.length).toBe(2);
        }
      })
    });
  });

  describe('getChatGroupsUsers', () => {
    it('should gets Chat Group Users as expected structure', async () => {
      const testChatGroupId = '651a267e6a7119289b459043';
      const chatGroupsUsers = await service.getChatGroupsUsers({chatGroupId: testChatGroupId});
      expect(chatGroupsUsers).toBeDefined();
      expect(chatGroupsUsers.length).toBe(3);
      
    });
  });
  
  describe('addUserToChatGroup', () => {
    it('should add user to chat group', async () => {
      const testChatGroupId = '651dec1e3401959dfa153aca';
      const testUserId = '651df1d73218d56788bf1452'
      const updatedChatGroup = await service.addUserToChatGroup({chatGroupId: testChatGroupId,userId: testUserId});
      expect(updatedChatGroup).toBeDefined();
      expect(updatedChatGroup._id).toBe('651dec1e3401959dfa153aca');
      expect(updatedChatGroup.chatGroupName).toBe('Test Chat Group');
      updatedChatGroup.users.toString().includes(testUserId) ? 
      updatedChatGroup.users.map((user) => {
        expect(user).toBeDefined();
        if(user.toString()===testUserId){
          expect(user).toBeDefined();
          expect(user.toString()).toBe('651df1d73218d56788bf1452');
        }
        expect(user.toString()).not.toEqual('651df1d73218d56788bf1452');
      }):
      new Error('User Not added to the chat group') ;
      
    });
  });

  describe('removeUserFromChatGroup', () => {
    it('should gets Chat Group Users as expected structure', async () => {
      const testChatGroupId = '651dec1e3401959dfa153aca';
      const testUserId = '651df1d73218d56788bf1452';
      const updatedChatGroup = await service.removeUserFromChatGroup({chatGroupId: testChatGroupId,userId: testUserId});
      expect(updatedChatGroup).toBeDefined();
      expect(updatedChatGroup._id).toBe('651dec1e3401959dfa153aca');
      expect(updatedChatGroup.chatGroupName).toBe('Test Chat Group')
      expect(updatedChatGroup.users).not.toEqual([testUserId]);
      
    });
  });

  describe('updateChatGroupName', () => {
    it('should gets Chat Group Users as expected structure', async () => {
      const testUpdateChatGroupsNameDto: UpdateChatGroupsNameDTO = {
        chatGroupId:'651e144e1bb8f77af2e24e34',
        chatGroupName:'Test Updated Chat Group Name',
        
      }
      const updatedChatGroup = await service.updateChatGroupName({updateChatGroupsNameDto: testUpdateChatGroupsNameDto});
      expect(updatedChatGroup).toBeDefined();
      expect(updatedChatGroup._id).toBe('651e144e1bb8f77af2e24e34');
      expect(updatedChatGroup.chatGroupName).toBeDefined();
      expect(updatedChatGroup.chatGroupName).toBe('Test Updated Chat Group Name');

      
      
    });
  });
});
