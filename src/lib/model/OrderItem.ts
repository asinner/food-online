import { Entity, Column, Index } from "typeorm";
import { PublicEntity } from "./PublicEntity";

@Entity()
export class OrderItem extends PublicEntity {
    @Column({nullable: false})
    @Index()
    orderId: number;

    @Column({nullable: false})
    itemId: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    price: number;
}