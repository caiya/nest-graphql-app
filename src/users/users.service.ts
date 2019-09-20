import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, Transaction, TransactionManager } from 'typeorm';
import { User } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { Article } from '../articles/entity/articles.entity';

import { Connection, EntityManager, getManager } from 'typeorm'
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) { }

  @Inject()
  private readonly connection: Connection;

  create(user: CreateUserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  @Transactional()
  async findAll(): Promise<User[]> {
    const articles = await this.articleRepository.find()
    console.log('articles: ', articles)
    const users = await this.userRepository.find()
    console.log('users1: ', users)

    await this.articleRepository.save({
      title: '测试',
      content: 'hahaha',
      userId: 1
    })

    // 这个插入会报错，触发事务回滚
    await this.userRepository.save( {
      username: 'caiya',
    })

    return users;
  }

  findOneById(uid: number): Promise<User> {
    return this.userRepository.findOne(uid);
  }

  findOneByName(name: string): Promise<User> {
    return this.userRepository.findOne({
      username: name,
    })
  }

  async updateOneById(uid: number, user: User): Promise<boolean> {
    user = Object.setPrototypeOf(user, {});
    let result: UpdateResult = await this.userRepository.update(uid, user);
    return result.generatedMaps.length > 0
    // const qb = this.userRepository.createQueryBuilder('user');
    // return qb.update(User).setParameters(user).where("user.id = :id", { id: uid }).execute();
  }

  async delOneById(uid: number): Promise<boolean> {
    let result: DeleteResult = await this.userRepository.delete(uid);
    return result.affected > 0
  }

  async signToken(payload: any): Promise<any> {
    return this.authService.login(payload)
  }

  async validateUserAndPass(username: string, password: string): Promise<any> {
    return this.authService.validateUser(username, password)
  }
}
