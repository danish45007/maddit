import {
  Entity as ToEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import Entity from "./Entity";
import User from "./User";
import Post from "./Post";
import { makeId } from "../util/helpers";
import Vote from "./Vote";
import { Exclude } from "class-transformer";
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

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: [];

  // to know if user vote the comment
  protected userVote: number;
  setUserVote(user: User) {
    const index: number = this.votes?.findIndex(
      (v: any) => v.username === user.username
    );
    let res: number = index > -1 ? this.votes[index]["value"] : 0;
    this.userVote = res;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}
