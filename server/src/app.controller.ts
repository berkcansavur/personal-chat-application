import { Controller, Get, Post, UseGuards, Request, Body, Param, Query, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { UsersService } from './users/users.service';
import { ChatGroupsService } from './chat-groups/chat-groups.service';
import { CreateChatGroupDTO, ChatGroupInfoDTO } from './chat-groups/dtos/chat-group-dtos';
import { MessagesService } from './messages/messages.service';
import { ReturnUserProfile } from './users/users.model';
import { FriendInfoDTO } from './users/dtos/user-dtos';
import { NotificationsService } from './notifications/notifications.service';
import { ParseObjectIdPipe } from './core/pipe/object-id.pipe';

@Controller('app')
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private chatGroupService: ChatGroupsService,
    private messagesService : MessagesService,
    private notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Request() req ) {
    const userToBeauthenticate =  await this.authService.loginWithCredentials( req.user );
    const authenticatedUser = await this.userService.setUsersAccessToken({authenticatedUserDto: userToBeauthenticate})
    return authenticatedUser;
  }

  @UseGuards( JwtAuthGuard )
  @Get('/logout')
  async logout(@Request() req ) {
    return await this.userService.removeUsersAccessToken({userId: req.user.userId});
  }

  @UseGuards( JwtAuthGuard )
  @Get('/getAuthenticatedUser')
  async getAuthenticatedUser(@Request() req ) {
    return await this.userService.getAccessToken({userId: req.user.userId});
  }
  
  @UseGuards( JwtAuthGuard )
  @Get('/me')
  async getUserProfile(@Request() req ) : Promise<ReturnUserProfile>{
    try {
      const user = await this.userService.findUser( {userId:req.user.userId.toString()} );
      const { UserId, UserName, UserEmail, ChatGroups,Friends } = user;
      const [ChatGroupDetails, FriendsData] = await Promise.all([
        await this.chatGroupService.getChatGroupDetails({chatGroups:ChatGroups}),
        await this.userService.getUsersFriendsInfo({userIds:Friends}),
      ]);
      const userProfileInfo = await this.userService.mapUserProfileInfo({mapUserInfoDTO:{UserId, UserName, UserEmail, ChatGroupDetails, FriendsData}});
      return userProfileInfo;
    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards( JwtAuthGuard )
  @Post('/add-friends-to-chat-group/:chatGroupId/:friendId')
  async addFriendsToChatGroup(
    @Param('chatGroupId', ParseObjectIdPipe ) chatGroupId: string,
    @Param('friendId', ParseObjectIdPipe ) friendId: string 
    ): Promise<ChatGroupInfoDTO>{
    try {
      const updatedChatGroup = await this.chatGroupService.addUserToChatGroup( {chatGroupId: chatGroupId,userId: friendId} );
      await this.userService.addChatGroupToUser( {userId:friendId, chatGroupId:updatedChatGroup._id.toString()} );
      return updatedChatGroup ;
    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards( JwtAuthGuard )
  @Post('/remove-friends-from-chat-group/:chatGroupId/:friendId')
  async removeFriendsFromChatGroup(
    @Param('chatGroupId', ParseObjectIdPipe ) chatGroupId: string, 
    @Param('friendId', ParseObjectIdPipe ) friendId: string ): Promise<ChatGroupInfoDTO>{
    try {
      const updatedChatGroup = await this.chatGroupService.removeUserFromChatGroup( {chatGroupId:chatGroupId, userId: friendId} );
      await this.userService.removeChatGroupFromUser({userId: friendId ,chatGroupId: updatedChatGroup._id.toString()});
      return updatedChatGroup;
    } catch (error) {
      throw new Error(error);
    }
  } 
  @UseGuards( JwtAuthGuard )
  @Post('/add-friend/:friendId')
  async addFriend( 
    @Param('friendId', ParseObjectIdPipe ) friendId: string, 
    @Request() req ) : Promise<FriendInfoDTO> {
      const updatedUser = await this.userService.addFriend( {userId: req.user.userId, friendId: friendId} );

      return updatedUser;
  }
  @UseGuards( JwtAuthGuard )
  @Post('/remove-friend/:friendId')
  async removeFriend( 
    @Param('friendId', ParseObjectIdPipe ) friendId: string, 
    @Request() req ): Promise<FriendInfoDTO> {
      const updatedUser = await this.userService.removeFriend( {userId: req.user.userId.toString(),friendId: friendId });

      return updatedUser;
  }
  @UseGuards( JwtAuthGuard )
  @Get('/get-friends')
  async getFriends(@Request() req ) : Promise<FriendInfoDTO[]> {
    const friendIds = await this.userService.getFriendIdsOfUser({userId:req.user.userId});
    const friendsData = await this.userService.getUsersFriendsInfo({userIds:friendIds})
    return friendsData;
  }
  @UseGuards( JwtAuthGuard )
  @Get('/get-chatgroups-friends-data/:chatGroupId')
  async getChatGroupsUsersInfo(@Param('chatGroupId', ParseObjectIdPipe ) chatGroupId: string):Promise<FriendInfoDTO[]> {
    const friendIds = await this.chatGroupService.getChatGroupsUsers({chatGroupId: chatGroupId});
    const friendsData = await this.userService.getUsersFriendsInfo({userIds:friendIds})
    return friendsData;
  }
  @UseGuards( JwtAuthGuard )
  @Post('/create-chat-group')
  async createChatGroup( @Body() body:CreateChatGroupDTO, @Request() req ): Promise<ChatGroupInfoDTO> {
      const newChatGroup = await this.chatGroupService.createChatGroup({ createChatGroupDTO: body });
      const createdChatGroup = await this.chatGroupService.getChatGroupByStringId({ chatGroupId: newChatGroup._id});
      const updatedChatGroup = await this.chatGroupService.addUserToChatGroup({ chatGroupId: createdChatGroup._id.toString(), userId: req.user.userId });
      await this.userService.addChatGroupToUser({ userId: req.user.userId, chatGroupId: updatedChatGroup._id.toString() });
      return createdChatGroup;
  }
  @UseGuards( JwtAuthGuard )
  @Delete('/delete-chat-group/:chatGroupId')
  async deleteChatGroup( @Param('chatGroupId', ParseObjectIdPipe ) chatGroupId: string ) {
    try {
      const chatGroupToBeDelete = await this.chatGroupService.getChatGroup( {chatGroupId:chatGroupId} );
      const usersOfChatGroup = await this.chatGroupService.getChatGroupsUsers({chatGroupId: chatGroupId});
      const deleteChatGroupFromUsers = usersOfChatGroup.map(async (user) => {
        await this.userService.removeChatGroupFromUser({userId:user.toString(),chatGroupId: chatGroupToBeDelete._id.toString()});
      });
      await Promise.all(deleteChatGroupFromUsers);
      await this.chatGroupService.deleteChatGroup({chatGroupId:chatGroupId});
    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards( JwtAuthGuard )
  @Get('/get-chat-group/:chatGroupId')
  async getChatGroup( @Param('chatGroupId', ParseObjectIdPipe ) chatGroupId: string ): Promise<ChatGroupInfoDTO> {
    const chatGroup = await this.chatGroupService.getChatGroup( {chatGroupId:chatGroupId} );
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
  async getLast20Messages(@Param('chatGroupId', ParseObjectIdPipe ) chatGroupId: string, @Request() req){
    const last20Messages = await this.messagesService.getLast20Messages({chatGroupID:chatGroupId});
    return last20Messages.reverse();
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get-last-10-notifications/:userId')
  async getLast10NotificationsOfCurrentUser(@Param('userId') userId:string ){
    const last10Notifications = await this.notificationsService.getLast10NotificationsOfUser({userId:userId});
    return last10Notifications.reverse();
  }
}