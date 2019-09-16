import { UserLogin } from "../../graphql";
import { Length } from "class-validator";

export class UserLoginDto implements UserLogin {

    @Length(1, 20, {
        message: '用户名长度为1-20'
    })
    username: string;

    @Length(1, 20, {
        message: '密码长度为1-20'
    })
    password: string;
}