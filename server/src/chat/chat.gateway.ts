import { 
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
  MessageBody } from '@nestjs/websockets';

@WebSocketGateway(1734, {cors: '*:*'})
export class ChatGateway {
  @WebSocketServer()
  server: { emit: (arg0: string, arg1: string) => void; };

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log(message);
    this.server.emit('message', message);
  }
}
