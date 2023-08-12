export interface User {
    UserID:string; 
    name: string;
    email: string;
    password: string;
    Friends: object[];
    ChatGroups: object[];
    socketId: string;
  }
  
  export interface ChatGroup {
    chatGroupName: string;
    host: User;
    users: User[];
    createdDate: Date;
  }
  
  export interface Message {
    senderUser: User
    timeSent: string
    text: string
    chatGroup: string
  }
  
  export interface ServerToClientEvents {
    chat: (e: Message) => void
  }
  
  export interface ClientToServerEvents {
    chat: (e: Message) => void
    join_room: (e: { senderUser: User; chatGroup: string }) => void
  }