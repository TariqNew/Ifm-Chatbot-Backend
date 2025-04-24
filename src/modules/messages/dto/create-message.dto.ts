import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SenderType } from '../entities/message.entity';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(SenderType)
  senderType: SenderType;

  @IsOptional()
  senderId?: number;

  @IsNotEmpty()
  chatId: number;
}