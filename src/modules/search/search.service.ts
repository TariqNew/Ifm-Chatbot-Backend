import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { Search } from './entities/search.entity';
import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SearchService {
  constructor(private readonly entityManager: EntityManager){}
  create(createSearchDto: CreateSearchDto) {
    return 'This action adds a new search';
  }
  async  userSearch(q:string):Promise<User[]>{
    const users = await this.entityManager.createQueryBuilder(User,'u').where('u.fullName LIKE :name',{
      name:`%${q}%`,
    }).getMany();
    return users;
  }
  findAll() {
    return `This action returns all search`;
  }

  findOne(id: number) {
    return `This action returns a #${id} search`;
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`;
  }

  remove(id: number) {
    return `This action removes a #${id} search`;
  }
}
