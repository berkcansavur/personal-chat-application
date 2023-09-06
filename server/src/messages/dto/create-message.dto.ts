import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  chatGroupID: string;

  @IsNotEmpty()
  @IsString()
  senderUser: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  text: string;
}