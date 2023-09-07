import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDTO {
  @IsNotEmpty()
  @IsString()
  chatGroupID: string;

  @IsNotEmpty()
  @IsString()
  senderUser: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}