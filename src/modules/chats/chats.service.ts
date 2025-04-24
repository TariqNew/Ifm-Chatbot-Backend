import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createChatDto: CreateChatDto, userId: number): Promise<Chat> {
    const chat = this.entityManager.create(Chat, {
      ...createChatDto,
      user: { id: userId },
    });
    return this.entityManager.save(chat);
  }

  async findAll(): Promise<Chat[]> {
    return this.entityManager.find(Chat, { relations: ['user', 'messages'] });
  }

  async findOne(id: number): Promise<Chat> {
    const chat = await this.entityManager.findOne(Chat, {
      where: { id },
      relations: ['user', 'messages'],
    });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async update(id: number, updateChatDto: UpdateChatDto): Promise<Chat> {
    const chat = await this.findOne(id);
    Object.assign(chat, updateChatDto);
    return this.entityManager.save(chat);
  }

  async remove(id: number): Promise<void> {
    const chat = await this.findOne(id);
    await this.entityManager.remove(chat);
  }
}
