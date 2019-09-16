import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    @ApiModelProperty({description: '姓名'})
    username: string;

    @Column({ length: 255 })
    @ApiModelProperty({description: '密码'})
    password: string;

    @Column()
    @ApiModelProperty({description: '年龄'})
    age: number;

    @Column()
    @ApiModelProperty({description: '出生日期'})
    birth: string;

    @Column()
    @ApiModelProperty({description: '用户权限标识字符串，eg：article:list,article:del,users:list'})
    permits: string
}