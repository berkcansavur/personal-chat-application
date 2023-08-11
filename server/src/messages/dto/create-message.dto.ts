import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  chatGroup: string;

  @IsNotEmpty()
  @IsString()
  senderUser: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}