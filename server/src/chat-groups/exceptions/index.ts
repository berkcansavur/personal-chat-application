import { HttpStatus } from "@nestjs/common";
import { ChatAppException } from "src/core/exceptions/chatapp.exception";

export class ChatGroupNotFoundException extends ChatAppException {
    constructor( data?: string | object ){
        super(
            'Chat group not found',
            2010,
            HttpStatus.NOT_FOUND,
            JSON.stringify(data),
            'ChatGroupNotFoundException'
        );
        
        this.name ='ChatGroupNotFoundException'
        Object.setPrototypeOf(this, ChatGroupNotFoundException.prototype);

    }
}
export class ChatGroupsNotFoundException extends ChatAppException {
    constructor( data?: string | object ){
        super(
            'Chat groups not found',
            2011,
            HttpStatus.NOT_FOUND,
            JSON.stringify(data),
            'ChatGroupsNotFoundException'
        );
        
        this.name ='ChatGroupsNotFoundException'
        Object.setPrototypeOf(this, ChatGroupsNotFoundException.prototype);

    }
}
export class ChatGroupsUsersNotFoundException extends ChatAppException {
    constructor( data?: string | object ){
        super(
            'Chat groups users not found',
            2020,
            HttpStatus.NOT_FOUND,
            JSON.stringify(data),
            'ChatGroupsUsersNotFoundException'
        );
        
        this.name ='ChatGroupsUsersNotFoundException'
        Object.setPrototypeOf(this, ChatGroupsUsersNotFoundException.prototype);

    }
}
export class CouldNotAddedUserToChatGroupException extends ChatAppException {
    constructor( data?: string | object ){
        super(
            'Could not added user to chat group exception',
            2030,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'CouldNotAddedUserToChatGroupException'
        );
        
        this.name ='CouldNotAddedToChatGroupUserException'
        Object.setPrototypeOf(this, CouldNotAddedUserToChatGroupException.prototype);

    }
}
export class CouldNotRemovedUserFromChatGroupException extends ChatAppException {
    constructor( data?: string | object ){
        super(
            'Could not removed user from chat group exception',
            2031,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'CouldNotRemovedUserFromChatGroupException'
        );
        
        this.name ='CouldNotRemovedUserFromChatGroupException'
        Object.setPrototypeOf(this, CouldNotRemovedUserFromChatGroupException.prototype);

    }
}
export class CouldNotUpdatedChatGroupNameException extends ChatAppException {
    constructor( data?: string | object ){
        super(
            'Could not updated chat group name exception',
            2040,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'CouldNotUpdatedChatGroupNameException'
        );
        
        this.name ='CouldNotUpdatedChatGroupNameException'
        Object.setPrototypeOf(this, CouldNotUpdatedChatGroupNameException.prototype);

    }
}
export class ChatGroupNotCreatedException extends ChatAppException {
    constructor( data?: string | object ){
        super(
            'Could not created chat group',
            2041,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'ChatGroupNotCreatedException'
        );
        
        this.name ='ChatGroupNotCreatedException'
        Object.setPrototypeOf(this, ChatGroupNotCreatedException.prototype);

    }
}
export class ChatGroupNotRemovedException extends ChatAppException {
    constructor( data?: string | object ){
        super(
            'Could not removed chat group',
            2042,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'ChatGroupNotRemovedException'
        );
        
        this.name ='ChatGroupNotRemovedException'
        Object.setPrototypeOf(this, ChatGroupNotRemovedException.prototype);

    }
}