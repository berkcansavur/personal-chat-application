import { Controller, Get, Post, UseGuards, Request, Body, UnauthorizedException, Param, Query, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { UsersService } from './users/users.service';
import { ChatGroupsService } from './chat-groups/chat-groups.service';
import mongoose from 'mongoose';
import { CreateChatGroupDTO } from './chat-groups/dtos/create-chat-group.dto';
import { MessagesService } from './messages/messages.service';
import { ReturnUserProfile } from './users/users.model';
import { ChatGroupInfoDTO } from './chat-groups/dtos/chat-group-info.dto';
import { FriendInfoDTO } from './users/dtos/user-dtos';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
    private chatGroupService: ChatGroupsService,
    private messagesService : MessagesService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Request() req ) {
    return this.authService.loginWithCredentials( req.user );
  }

  @UseGuards( JwtAuthGuard )
  @Get('/me')
  async getUserProfile(@Request() req ) : Promise<ReturnUserProfile>{
    try {
      const user = await this.userService.findUser( {userId:req.user.userId} );
      const { UserId, UserName, UserEmail, ChatGroups, Friends } = user;
      const [chatGroupDetails, friendsData] = await Promise.all([
        await this.chatGroupService.getChatGroupDetails({chatGroups:ChatGroups}),
        await this.userService.getUsersFriendsInfo({userIds:Friends}),
      ]);
      const userProfileInfo = await this.userService.mapUserProfileInfo({userId:UserId, name:UserName, email:UserEmail, chatGroupDetails:chatGroupDetails, friendsData:friendsData});
      return userProfileInfo;
    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards( JwtAuthGuard )
  @Post('/add-friends-to-chat-group/:chatGroupId/:friendId')
  async addFriendsToChatGroup(@Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId ,@Param('friendId') friendId: mongoose.Types.ObjectId ): Promise<ChatGroupInfoDTO>{
    try {
      const updatedChatGroup = await this.chatGroupService.addUserToChatGroup( {chatGroupId: chatGroupId,userId: friendId} );
      await this.userService.addChatGroupToUser( {userId:friendId, chatGroupId:updatedChatGroup._id} );
      return updatedChatGroup ;
    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards( JwtAuthGuard )
  @Post('/remove-friends-from-chat-group/:chatGroupId/:friendId')
  async removeFriendsFromChatGroup(@Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId, @Param('friendId') friendId: mongoose.Types.ObjectId ): Promise<ChatGroupInfoDTO>{
    try {
      const updatedChatGroup = await this.chatGroupService.removeUserFromChatGroup( {chatGroupId:chatGroupId, userId: friendId} );
      await this.userService.removeChatGroupFromUser({userId: friendId ,chatGroupId: updatedChatGroup._id});
      return updatedChatGroup;
    } catch (error) {
      throw new Error(error);
    }
  } 
  @UseGuards( JwtAuthGuard )
  @Post('/add-friend/:friendId')
  async addFriend( @Param('friendId') friendId: mongoose.Types.ObjectId, @Request() req ):Promise<FriendInfoDTO> {
      if( !req.user ) {
        throw new UnauthorizedException('You must be logged in for adding friend');
      }
      const updatedUser = await this.userService.addFriend( {userId: req.user.userId, friendId: friendId} );
      return updatedUser;
  }
  @UseGuards( JwtAuthGuard )
  @Post('/remove-friend/:friendId')
  async removeFriend( @Param('friendId') friendId: mongoose.Types.ObjectId, @Request() req ): Promise<FriendInfoDTO> {
      if( !req.user ) {
        throw new UnauthorizedException('You must be logged in for removing friend');
      }
      const updatedUser = await this.userService.removeFriend( {userId: req.user.userId,friendId: friendId });
      return updatedUser;
  }
  @UseGuards( JwtAuthGuard )
  @Get('/get-friends')
  async getFriends(@Request() req):Promise<FriendInfoDTO[]> {
    if (!req.user) {
      throw new UnauthorizedException('You must be logged in to view friends');
    }
    const friendIds = await this.userService.getFriendIdsOfUser({userId:req.user.userId});
    const friendsData = await this.userService.getUsersFriendsInfo({userIds:friendIds})
    return friendsData;
  }
  @UseGuards( JwtAuthGuard )
  @Get('/get-chatgroups-friends-data/:chatGroupId')
  async getChatGroupsUsersInfo(@Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId):Promise<FriendInfoDTO[]> {
    if (!chatGroupId) {
      throw new UnauthorizedException('You must provide an existing chatgroup!');
    }
    const friendIds = await this.chatGroupService.getChatGroupsUsers({chatGroupId: chatGroupId});
    const friendsData = await this.userService.getUsersFriendsInfo({userIds:friendIds})
    return friendsData;
  }
  @UseGuards( JwtAuthGuard )
  @Post('/create-chat-group')
  async createChatGroup( @Body() body:CreateChatGroupDTO, @Request() req ): Promise<ChatGroupInfoDTO> {
      if (!req.user) {
        throw new UnauthorizedException('You need to login to create a chat group');
      }
      const newChatGroup = await this.chatGroupService.createChatGroup({ createChatGroupDTO: body });
      const createdChatGroup = await this.chatGroupService.getChatGroupByStringId({ id: newChatGroup._id});
      const updatedChatGroup = await this.chatGroupService.addUserToChatGroup({ chatGroupId: createdChatGroup._id, userId: req.user.userId });
      await this.userService.addChatGroupToUser({ userId: req.user.userId, chatGroupId: updatedChatGroup._id });
      return createdChatGroup;
  }
  @UseGuards( JwtAuthGuard )
  @Delete('/delete-chat-group/:chatGroupId')
  async deleteChatGroup( @Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId ) {
    try {
      const chatGroupToBeDelete = await this.chatGroupService.getChatGroup( {id:chatGroupId} );
      const usersOfChatGroup = await this.chatGroupService.getChatGroupsUsers({chatGroupId: chatGroupId});
      const deleteChatGroupFromUsers = usersOfChatGroup.map(async (user) => {
        await this.userService.removeChatGroupFromUser({userId:user,chatGroupId: chatGroupToBeDelete._id});
      });
      await Promise.all(deleteChatGroupFromUsers);
      await this.chatGroupService.deleteChatGroup({chatGroupId:chatGroupId});
    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards( JwtAuthGuard )
  @Get('/get-chat-group/:chatGroupId')
  async getChatGroup( @Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId, @Request() req ): Promise<ChatGroupInfoDTO> {
    if (!req.user) {
      throw new UnauthorizedException('You need to login to create a chat group');
    }
    const chatGroup = await this.chatGroupService.getChatGroup( {id:chatGroupId} );
    return chatGroup; 
  }
  @UseGuards( JwtAuthGuard )
  @Get('/search-user')
  async searchUser( @Query("searchText") searchText: string ) {
    const users = await this.userService.searchUser( {searchText: searchText} );
    return users;
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get-last-20-messages/:chatGroupId')
  async getLast20Messages(@Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId, @Request() req){
    if (!req.user) {
      throw new UnauthorizedException('You need to login to create a chat group');
    }
    const last20Messages = await this.messagesService.getLast20Messages({chatGroupID:chatGroupId});
    return last20Messages.reverse();
  }
}