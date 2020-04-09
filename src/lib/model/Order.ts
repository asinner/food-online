import { Entity, Column, Index } from "typeorm";
import { PublicEntity } from "./PublicEntity";
import { Currency } from "./Currency";

@Entity()
export class Order extends PublicEntity {
    @Column({nullable: false})
    @Index()
    accountId: number;

    @Column({
        type: 'enum',
        enum: Currency,
        default: Currency.USD,
    })
    currency: string;

    @Column({nullable: false})
    tax: number;
}