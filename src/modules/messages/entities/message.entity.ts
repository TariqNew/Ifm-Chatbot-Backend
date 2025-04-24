import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Chat } from 'src/modules/chats/entities/chat.entity';
import { User } from 'src/modules/users/entities/user.entity';

export enum SenderType {
  USER = 'USER',
  AI = 'AI',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: SenderType })
  senderType: SenderType;

  @ManyToOne(() => User, (user) => user.messages, { nullable: true, onDelete: 'SET NULL' })
  sender: User | null; // Null if the sender is AI

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;

  @CreateDateColumn()
  createdAt: Date;
}