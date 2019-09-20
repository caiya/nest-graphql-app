import { BaseRepository } from "typeorm-transactional-cls-hooked";
import { User } from "../entity/users.entity";
import { EntityRepository } from "typeorm";

@EntityRepository(User)
export class UserRespository extends BaseRepository<User> {

}