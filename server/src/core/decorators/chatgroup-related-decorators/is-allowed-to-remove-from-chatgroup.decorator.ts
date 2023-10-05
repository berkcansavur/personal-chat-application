import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ChatGroupsService } from "src/chat-groups/chat-groups.service";
import { UserAlreadyExistsInChatGroupException, UserNotExistsInChatGroupException } from "src/chat-groups/exceptions";

@Injectable()
export class IsUserAllowedToRemovingFromChatGroup implements CanActivate {
    constructor(
        private readonly chatGroupService: ChatGroupsService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { chatGroupService } = this;
        const request = context.switchToHttp().getRequest();
        const { chatGroupId, friendId } = request.params;

        const chatGroupUsers = await chatGroupService.getChatGroupsUsers({chatGroupId});
        const isUserNotExistsInChatGroup = chatGroupUsers.includes(friendId);

        if(isUserNotExistsInChatGroup) {
            return true;
        }
        throw new UserNotExistsInChatGroupException(friendId);
    }
}