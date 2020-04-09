import * as nanoid from 'nanoid'
import { BeforeInsert, UpdateDateColumn, CreateDateColumn, Index, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export abstract class PublicEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    @Index({unique: true})
    pid: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generatePuid() {
        this.pid = nanoid.nanoid(7)
    }
}