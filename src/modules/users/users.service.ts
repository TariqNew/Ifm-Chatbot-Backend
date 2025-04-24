import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { EntityManager, Equal } from 'typeorm';
import { LoggerService } from 'src/lib/logger/logger.service';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly logger: LoggerService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log('Creating user' + createUserDto);
      const existingUser = await this.entityManager.findOneBy(User, {
        email: Equal(createUserDto.email),
      });
      if (existingUser) {
        this.logger.warn('User already exists' + createUserDto.email);
        throw new Error('User already exists');
      }
      this.logger.log('Creating new user' + createUserDto);
      const user = this.entityManager.create(User, createUserDto);
      return await this.entityManager.save(user);
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    return await this.entityManager.find(User);
  }

  async findByEmail(email: string) {
    return await this.entityManager.findOneBy(User, { email: Equal(email) });
  }

  async findById(id: number) {
    return await this.entityManager.findOneBy(User, { id: Equal(id) });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
