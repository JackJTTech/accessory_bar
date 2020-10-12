import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { AccessorySet } from "./AccessorySet";

@Entity()
export class Merchant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  shopName: string;

  @OneToMany("AccessorySet", "merchant", { eager: true })
  accessorySets?: AccessorySet[];
}
