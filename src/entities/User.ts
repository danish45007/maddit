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
import Vote from "./Vote";
@ToEntity("users")
export default class User extends Entity {
  // user
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail(undefined, { message: "Must be a valid email address" })
  @Length(1, 255, { message: "Email is empty" })
  @Column({
    unique: true,
  })
  email: string;

  @Index()
  @Length(3, 255, { message: "Must be at least 3 characters long" })
  @Column({
    unique: true,
  })
  username: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: "Must be at least 6 characters long" })
  password: string;

  // relation user to post
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  // relation user to vote
  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
