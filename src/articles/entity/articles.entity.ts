import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";

@Entity()
export class Article {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    @ApiModelProperty({description: '标题'})
    title: string;

    @Column()
    @ApiModelProperty({description: '内容'})
    content: string;

    @Column() userId: number;
}