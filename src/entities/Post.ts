import {
  Entity as ToEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { makeId, slugify } from "../util/helpers";

import Entity from "./Entity";
import User from "./User";
import Sub from "./Subs";
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

  @Index()
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

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
