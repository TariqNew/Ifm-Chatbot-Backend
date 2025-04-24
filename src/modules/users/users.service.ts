import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
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
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log(`Creating user: ${JSON.stringify(createUserDto)}`);

      // Check if the user already exists
      const existingUser = await this.entityManager.findOneBy(User, {
        email: Equal(createUserDto.email),
      });

      if (existingUser) {
        this.logger.warn(`User already exists: ${createUserDto.email}`);
        throw new UnauthorizedException('User already exists');
      }

      // Create and save the new user
      const user = this.entityManager.create(User, createUserDto);
      const savedUser = await this.entityManager.save(user);

      this.logger.log(`User created successfully: ${savedUser.email}`);
      return savedUser;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Finds all users
  async findAll() {
    return await this.entityManager.find(User);
  }

  // Finds a user by email
  async findByEmail(email: string) {
    const user = await this.entityManager.findOneBy(User, { email: Equal(email) });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // Finds a user by ID
  async findById(id: number) {
    const user = await this.entityManager.findOneBy(User, { id: Equal(id) });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Updates a user
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      this.logger.log(`Updating user with ID: ${id}`);

      const user = await this.findById(id);
      Object.assign(user, updateUserDto);

      const updatedUser = await this.entityManager.save(user);
      this.logger.log(`User updated successfully: ${updatedUser.email}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user with ID: ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  // Removes a user
  async remove(id: number) {
    try {
      this.logger.log(`Removing user with ID: ${id}`);

      const user = await this.findById(id);
      await this.entityManager.remove(user);

      this.logger.log(`User removed successfully: ${id}`);
      return { message: `User with ID ${id} removed successfully` };
    } catch (error) {
      this.logger.error(`Error removing user with ID: ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to remove user');
    }
  }
}
