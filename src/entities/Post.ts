import {
  Entity as ToEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
@ToEntity("posts")
export default class Post extends Entity {
  // post
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string; // 7 char id

  @Index()
  @Column()
  title: string; // title of post

  @Column({ nullable: true, type: "text" })
  body: string; // message body

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;
}
