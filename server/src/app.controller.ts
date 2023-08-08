import { Controller, Get, Post, UseGuards, Request, Body, UnauthorizedException, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { UsersService } from './users/users.service';
import { ChatGroupsService } from './chat-groups/chat-groups.service';
import mongoose from 'mongoose';
import { CreateChatGroupDTO } from './chat-groups/dtos/create-chat-group.dto';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
    private chatGroupService: ChatGroupsService ) {}

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
      const { _id, name, email, ChatGroups } = user;
      const chatGroupDetails = [];
      const friends = await this.userService.getFriendsOfUser( req.user.userId );
      const friendsData = [];
      for( const friend of friends ) {
        const friendData = await this.userService.getUserData( friend );
        friendsData.push( friendData );
      }
      for( let chatGroupId of ChatGroups ){
        const chatGroup = await this.chatGroupService.getChatGroupByObjectId( chatGroupId );
        chatGroupDetails.push({
          _id: chatGroup._id,
          chatGroupName: chatGroup.chatGroupName,
        });
      }
      return {
        UserID: _id,
        UserName: name,
        UserEmail: email,
        ChatGroups: chatGroupDetails,
        Friends: friendsData
      }
      
  } catch (error) {
      throw new Error(error);
  }
  }
  
  @UseGuards( JwtAuthGuard )
  @Post('/add-friends-to-chat-group/:chatGroupId/:friendId')
  async addFriendsToChatGroup(@Param('chatGroupId') chatGroupId: string ,@Param('friendId') friendId: mongoose.Types.ObjectId ){
    try {
      const friendToAdd = await this.userService.findUser( friendId );
      const updatedChatGroup = await this.chatGroupService.addUserToChatGroup( chatGroupId, friendToAdd );
      return updatedChatGroup ;
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards( JwtAuthGuard )
  @Post('/remove-friends-to-chat-group/:chatGroupId/:friendId')
  async removeFriendsFromChatGroup(@Param('chatGroupId') chatGroupId: string, @Param('friendId') friendId: string ){
    try {
      const updatedChatGroup = await this.chatGroupService.removeUserFromChatGroup( chatGroupId, friendId );
      return updatedChatGroup ;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  @UseGuards( JwtAuthGuard )
  @Post('add-user')
    async addUserToChatGroup(@Body() body: { chatGroupId: object }, @Request() req ) {
        try {
          const id = req.user.userId;
          const stringifiedChatGroupId = body.chatGroupId.toString();
            if (!id) {
                throw new UnauthorizedException('You need to login to create a chat group');
            }
            const chatGroupToUpdate = await this.chatGroupService.getChatGroupById( stringifiedChatGroupId ); 
            const updatedUser = await this.userService.addChatGroupToUser( id, chatGroupToUpdate );
            const updatedChatGroup = await this.chatGroupService.addUserToChatGroup( stringifiedChatGroupId, updatedUser );
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
    async getFriends( @Request() req ) {
      if( !req.user ) {
        throw new UnauthorizedException('You must be logged in for view friends');
      }
      const friends = await this.userService.getFriendsOfUser( req.user.userId );
      const friendsData = [];
      for( const friend of friends ) {
        const friendData = await this.userService.getUserData( friend );
        friendsData.push( friendData );
      }
      return friendsData;
    }
    
    @UseGuards( JwtAuthGuard )
    @Get('/get-chatgroups-friends-data/:chatGroupId')
    async getChatGroupsUsersInfo( @Param('chatGroupId') chatGroupId:mongoose.Types.ObjectId ) {
      if( !chatGroupId ) {
        throw new UnauthorizedException('You must provide an existing chatgroup!');
      }
      const friends = await this.chatGroupService.getChatGroupsUsers(chatGroupId);
      const friendsData = [];
      for( const friend of friends ) {
        const friendData = await this.userService.getUserData( friend );
        friendsData.push( friendData );
      }
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
    @Get('/get-chat-group/:chatGroupId')
    async getChatGroup( @Param('chatGroupId') chatGroupId: mongoose.Types.ObjectId, @Request() req ) {
      if (!req.user) {
        throw new UnauthorizedException('You need to login to create a chat group');
      }
      const chatGroup = await this.chatGroupService.getChatGroupByObjectId( chatGroupId );
      return chatGroup; 
    }

    @UseGuards( JwtAuthGuard )
    @Get('/search-user')
    async searchUser( @Query("searchText") searchText: string ) {
      const users = await this.userService.searchUser( searchText );
      return users;
    }
}