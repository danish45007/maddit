import {
  Entity as ToEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import Entity from "./Entity";
import User from "./User";
import Post from "./Post";
import { makeId } from "../util/helpers";
@ToEntity("comments")
export default class Comment extends Entity {
  // post
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string; // 7 char id

  @Index()
  @Column()
  body: string; // body of comment

  @Column()
  username: string; // username of commnet -creator

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}
