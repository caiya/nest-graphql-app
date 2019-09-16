import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Token } from '../graphql';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) { }

  create(user: CreateUserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
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
