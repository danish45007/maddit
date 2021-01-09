import { Column, Entity as ToEntity, JoinColumn, ManyToOne } from "typeorm";
import Comment from "./Comment";

import Entity from "./Entity";
import Post from "./Post";
import User from "./User";

@ToEntity("votes")
export default class Vote extends Entity {
  // votes
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  username: string;

  //   post relation
  @ManyToOne(() => Post)
  post: Post;

  //   comment relation
  @ManyToOne(() => Comment)
  comment: Comment;
}
