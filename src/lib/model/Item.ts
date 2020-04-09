import { Entity, Column, Index } from "typeorm";
import { PublicEntity } from "./PublicEntity";

@Entity()
export class Item extends PublicEntity {
    @Column({default: ''})
    imageUrl: string;

    @Column({default: ''})
    name: string;

    @Column({default: 0})
    price: number;

    @Column({type: 'text'})
    desc: string;

    @Column({default: true})
    hidden: boolean;

    @Column({nullable: false})
    @Index()
    accountId: number;
}