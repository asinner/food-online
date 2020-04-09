import { Entity, Column, Index } from "typeorm";
import { PublicEntity } from "./PublicEntity";

@Entity()
export class User extends PublicEntity {
    @Column({unique: true, default: ''})
    email: string;

    @Column({default: ''})
    passwordHash: string;

    @Column({default: 0})
    @Index()
    accountId: number;
}