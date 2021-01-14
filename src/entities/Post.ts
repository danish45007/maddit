import {
  Entity as ToEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
  AfterLoad,
} from "typeorm";
import { makeId, slugify } from "../util/helpers";

import Entity from "./Entity";
import User from "./User";
import Sub from "./Subs";
import Comment from "./Comment";
import Vote from "./Vote";
import { Exclude, Expose } from "class-transformer";
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

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: [];

  protected url = "string";
  @AfterLoad()
  createFields() {
    this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  // to know if user vote the post
  protected userVote: number;
  setUserVote(user: User) {
    const index: number = this.votes?.findIndex(
      (v: any) => v.username === user.username
    );
    let res: number = index > -1 ? this.votes[index]["value"] : 0;
    this.userVote = res;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }
  @Expose() get voteCount(): number {
    return this.votes?.reduce((prev, curr: any) => prev + (curr.value || 0), 0);
  }
  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
