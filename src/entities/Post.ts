import {
  Entity as ToEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { makeId, slugify } from "../util/helpers";

import Entity from "./Entity";
import User from "./User";
import Sub from "./Subs";
import Comment from "./Comment";
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

  @Column()
  title: string; // title of post

  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string; // message body

  @Column()
  subName: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
