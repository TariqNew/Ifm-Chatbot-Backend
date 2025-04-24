import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Chat } from 'src/modules/chats/entities/chat.entity';
import { Message, SenderType } from 'src/modules/messages/entities/message.entity';

@Injectable()
export class SeederService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed() {
    await this.createUsers();
    await this.createChatsAndMessages();
  }

  private async createUsers() {
    const users = [
      {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        phoneNumber: '+1234567890',
      },
      {
        fullName: 'Regular User',
        email: 'user@example.com',
        password: 'user123',
        phoneNumber: '+0987654321',
      },
    ]; 

    for (const userData of users) {
      const existingUser = await this.entityManager.findOneBy(User, {
        email: userData.email,
      });

      if (!existingUser) {
        const user = this.entityManager.create(User, userData);
        await this.entityManager.save(user);
      }
    }
  }

  private async createChatsAndMessages() {
    const adminUser = await this.entityManager.findOneBy(User, { email: 'admin@example.com' });
    const regularUser = await this.entityManager.findOneBy(User, { email: 'user@example.com' });

    if (!adminUser || !regularUser) {
      throw new Error('Users not found. Please seed users first.');
    }

    const chat = this.entityManager.create(Chat, {
      name: 'Chat between Admin and Regular User',
      isPrivate: true,
      user: adminUser,
    });

    await this.entityManager.save(chat);

    const messages = [
      {
        content: 'Hello! How can I assist you today?',
        senderType: SenderType.AI,
        chat,
      },
      {
        content: 'I need help with my account.',
        senderType: SenderType.USER,
        sender: regularUser,
        chat,
      },
    ];

    for (const messageData of messages) {
      const message = this.entityManager.create(Message, messageData);
      await this.entityManager.save(message);
    }
  }
}
