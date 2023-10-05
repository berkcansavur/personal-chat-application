import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ChatGroupsService } from "src/chat-groups/chat-groups.service";
import { UserAlreadyExistsInChatGroupException } from "src/chat-groups/exceptions";

@Injectable()
export class IsUserAllowedToAddingChatGroup implements CanActivate {
    constructor(
        private readonly chatGroupService: ChatGroupsService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { chatGroupService } = this;
        const request = context.switchToHttp().getRequest();
        const { chatGroupId, friendId } = request.params;

        const chatGroupUsers = await chatGroupService.getChatGroupsUsers({chatGroupId});
        const isUserAlreadyExistsInChatGroup = chatGroupUsers.includes(friendId);

        if(isUserAlreadyExistsInChatGroup) {
            throw new UserAlreadyExistsInChatGroupException(friendId);
        }
        return true;
    }
}