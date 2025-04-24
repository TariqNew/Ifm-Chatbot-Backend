import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { chatId, senderId, ...messageData } = createMessageDto;

    const message = this.entityManager.create(Message, {
      ...messageData,
      chat: { id: chatId },
      sender: senderId ? { id: senderId } : null,
    });

    return this.entityManager.save(message);
  }

  async findAll(): Promise<Message[]> {
    return this.entityManager.find(Message, { relations: ['chat', 'sender'] });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.entityManager.findOne(Message, {
      where: { id },
      relations: ['chat', 'sender'],
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.findOne(id);
    Object.assign(message, updateMessageDto);
    return this.entityManager.save(message);
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.entityManager.remove(message);
  }
}