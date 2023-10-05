import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FriendCouldNotRemovedException } from "src/users/exceptions";
import { UsersService } from "src/users/users.service";

@Injectable()
export class IsAllowedToRemoveFriend implements CanActivate {
    constructor(
        private readonly usersService: UsersService
        ){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const { usersService } = this;
        const request = context.switchToHttp().getRequest();
        const { friendId } = request.params;
        const { userId } = request.user;

        const friendIds = await usersService.getFriendIdsOfUser({userId});
        
        const isFriend = friendIds.includes(friendId);

        if(isFriend){
            return true;
        }
        throw new FriendCouldNotRemovedException(friendId);
    }
}