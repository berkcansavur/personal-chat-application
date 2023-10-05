import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { FriendAlreadyAddedException } from '../../../users/exceptions';

@Injectable()
export class IsAllowedToAddFriend implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { usersService } = this;
    const request = context.switchToHttp().getRequest();
    const { friendId } = request.params;
    const { userId } = request.user;

    const friendsIds = await usersService.getFriendIdsOfUser({ userId });

    const isFriend = friendsIds.includes(friendId);

    if (isFriend) {
      throw new FriendAlreadyAddedException(friendId);
    }

    return true;
  }
}
