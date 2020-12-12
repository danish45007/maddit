import { classToPlain, Exclude } from "class-transformer";
import { PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from "typeorm";

export default abstract class Entity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  toJSON() {
    return classToPlain(this);
  }
}
