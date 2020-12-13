import { IsEmail, Length } from "class-validator";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import {
  Entity as ToEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
} from "typeorm";

import Entity from "./Entity";
import Post from "./Post";
@ToEntity("users")
export default class User extends Entity {
  // user
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

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

  // relation user to post
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
