import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { LoggerService } from 'src/lib/logger/logger.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly logger: LoggerService,
  ) {}

  async seed() {
    this.logger.log('Seeding database...');
    await this.createUsers();
  }

  private async createUsers() {
    const users = [
      {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
      },
      {
        fullName: 'Regular User',
        email: 'user@example.com',
        password: 'user123',
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
}
