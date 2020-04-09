import { PublicEntity } from "./PublicEntity";
import { Entity, Column } from "typeorm";
import { Currency } from "./Currency";

@Entity()
export class Account extends PublicEntity {
    @Column({default: ''})
    name: string;

    @Column({default: ''})
    slug: string;

    @Column({default: false})
    online: boolean;

    @Column({
        type: 'enum',
        enum: Currency,
        default: Currency.USD,
    })
    currency: string;

    @Column()
    tax: number;
}