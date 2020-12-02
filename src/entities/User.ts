import { IsEmail, Length, Min } from "class-validator";
import bcrypt from "bcrypt";
import { classToPlain, Exclude } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  BeforeInsert,
} from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  // user
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Length(3, 255, { message: "Username must be atleast 3 characters long" })
  @Column({
    unique: true,
  })
  username: string;

  @Index()
  @IsEmail()
  @Column({
    unique: true,
  })
  email: string;
  @Exclude()
  @Column()
  @Length(5, 255)
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }

  toJSON() {
    return classToPlain(this);
  }
}
