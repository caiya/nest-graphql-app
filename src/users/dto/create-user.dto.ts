import { Min, Max, Length, IsDate } from 'class-validator';
import { UserInput } from '../../graphql';

export class CreateUserDto implements UserInput {
    @Min(1, { message: '长度最小为1'})
    @Max(120)
    age: number;

    @Length(3, 20)
    username: string;

    @Length(3, 20)
    password: string;

    @Length(10, 10, {message: '必须是10位长度，eg: 1998-09-18'})
    birth: string;

    permis: string;
}