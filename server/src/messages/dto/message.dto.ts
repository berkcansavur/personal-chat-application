import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class MessageDTO {
  @IsNotEmpty()
  @IsString()
  chatGroupID: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  senderUser: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}