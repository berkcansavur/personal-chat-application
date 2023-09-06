import { Controller, Get, Post, UseGuards, Request, Body, UnauthorizedException, Param, Query, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { UsersService } from './users/users.service';
import { ChatGroupsService } from './chat-groups/chat-groups.service';
import mongoose from 'mongoose';
import { CreateChatGroupDTO } from './chat-groups/dtos/create-chat-group.dto';
import { MessagesService } from './messages/messages.service';
import { UserProfileInfoDTO } from './users/dtos/user-profile-info.dto';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
    private chatGroupService: ChatGroupsService,
    private messagesService : MessagesService ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req ) {
    return this.authService.loginWithCredentials( req.user );
  }
  @UseGuards( JwtAuthGuard )
  @Get('/me')
  async getUserProfile(@Request() req ){
    try {
      const user = await this.userService.findUser( req.user.userId );
      const friends = await this.userService.getFriendsOfUser(req.user.userId);
      const { _id, name, email, ChatGroups } = user;
      const chatGroupDetails = await Promise.all(ChatGroups.map(async (chatGroupId) => {
        const chatGroup = await this.chatGroupService.getChatGroup(chatGroupId);
        return {
          _id: chatGroup._id,
          chatGroupName: chatGroup.chatGroupName,
        };
      }));
      const friendsData = await Promise.all(friends.map(async (friend) => {
        const friendData = await this.userService.getUserData(friend);
        return friendData;
      }));
      const userProfileInfo = new UserProfileInfoDTO();
      userProfileInfo.UserId = _id;
      userProfileInfo.UserName = name;
      userProfileInfo.UserEmail = email;
      userProfileInfo.ChatGroups = chatGroupDetails;
      userProfileInfo.Friends = friendsData;
      
      return userProfileInfo;

    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards( JwtAuthGuard )
  @Post('/add-friends-to-chat-group/:chatGroupId/:friendId')
  async addFriendsToChatGroup(@Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId ,@Param('friendId') friendId: mongoose.Types.ObjectId ){
    try {
      const friendToAdd = await this.userService.findUser( friendId );
      const updatedChatGroup = await this.chatGroupService.addUserToChatGroup( chatGroupId, friendToAdd );
      await this.userService.addChatGroupToUser( friendId, updatedChatGroup );
      return updatedChatGroup ;
    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards( JwtAuthGuard )
  @Post('/remove-friends-from-chat-group/:chatGroupId/:friendId')
  async removeFriendsFromChatGroup(@Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId, @Param('friendId') friendId: mongoose.Types.ObjectId ){
    try {
      const friendToRemove = await this.userService.findUser( friendId );
      const updatedChatGroup = await this.chatGroupService.removeUserFromChatGroup( chatGroupId, friendId );
      await this.userService.removeChatGroupFromUser(friendToRemove,updatedChatGroup);
      return updatedChatGroup;
    } catch (error) {
      throw new Error(error);
    }
  } 
  @UseGuards( JwtAuthGuard )
  @Post('/add-friend/:friendId')
  async addFriend( @Param('friendId') friendId: mongoose.Types.ObjectId, @Request() req ) {
      if( !req.user ) {
        throw new UnauthorizedException('You must be logged in for adding friend');
      }
      const friend = await this.userService.findUser( friendId );
      const updatedUser = await this.userService.addFriend( req.user.userId, friend );
      return updatedUser;
  }
  @UseGuards( JwtAuthGuard )
  @Post('/remove-friend/:friendId')
  async removeFriend( @Param('friendId') friendId: mongoose.Types.ObjectId, @Request() req ) {
      if( !req.user ) {
        throw new UnauthorizedException('You must be logged in for removing friend');
      }
      const friend = await this.userService.findUser( friendId );
      const updatedUser = await this.userService.removeFriend( req.user.userId, friend._id );
      return updatedUser;
  }
  @UseGuards( JwtAuthGuard )
  @Get('/get-friends')
  async getFriends(@Request() req) {
    if (!req.user) {
      throw new UnauthorizedException('You must be logged in to view friends');
    }
    const friends = await this.userService.getFriendsOfUser(req.user.userId);

    const friendsData = await Promise.all(friends.map(async (friend) => {
      const friendData = await this.userService.getUserData(friend);
      return friendData;
    }));

    return friendsData;
  }
  @UseGuards( JwtAuthGuard )
  @Get('/get-chatgroups-friends-data/:chatGroupId')
  async getChatGroupsUsersInfo(@Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId) {
    if (!chatGroupId) {
      throw new UnauthorizedException('You must provide an existing chatgroup!');
    }
    const friends = await this.chatGroupService.getChatGroupsUsers(chatGroupId);

    const friendsData = await Promise.all(friends.map(async (friend) => {
      const friendData = await this.userService.getUserData(friend);
      return friendData;
    }));
    return friendsData;
  }
  @UseGuards( JwtAuthGuard )
  @Post('/create-chat-group')
  async createChatGroup( @Body() body:CreateChatGroupDTO, @Request() req ) {
      if (!req.user) {
        throw new UnauthorizedException('You need to login to create a chat group');
      }
      const user = await this.userService.findUser( req.user.userId );
      const newChatGroup = await this.chatGroupService.createChatGroup( body, user );
      await this.userService.addChatGroupToUser( req.user.userId, newChatGroup );
      return newChatGroup;
  }
  @UseGuards( JwtAuthGuard )
  @Delete('/delete-chat-group/:chatGroupId')
  async deleteChatGroup( @Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId ) {
    try {
      const chatGroupToBeDelete = await this.chatGroupService.getChatGroup( chatGroupId );
      const usersOfChatGroup = await this.chatGroupService.getChatGroupsUsers(chatGroupId);
      const deleteChatGroupFromUsers = usersOfChatGroup.map(async (user) => {
        await this.userService.removeChatGroupFromUser(user, chatGroupToBeDelete);
      });
      await Promise.all(deleteChatGroupFromUsers);
      await this.chatGroupService.deleteChatGroup(chatGroupId);
    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards( JwtAuthGuard )
  @Get('/get-chat-group/:chatGroupId')
  async getChatGroup( @Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId, @Request() req ) {
    if (!req.user) {
      throw new UnauthorizedException('You need to login to create a chat group');
    }
    const chatGroup = await this.chatGroupService.getChatGroup( chatGroupId );
    return chatGroup; 
  }
  @UseGuards( JwtAuthGuard )
  @Get('/search-user')
  async searchUser( @Query("searchText") searchText: string ) {
    const users = await this.userService.searchUser( searchText );
    return users;
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get-last-20-messages/:chatGroupId')
  async getLast20Messages(@Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId, @Request() req){
    if (!req.user) {
      throw new UnauthorizedException('You need to login to create a chat group');
    }
    const last20Messages = await this.messagesService.getLast20Message(chatGroupId);
    return last20Messages.reverse();
  }
}