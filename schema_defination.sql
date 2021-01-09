CREATE TABLE "users"(
    "id" INTEGER NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE TABLE "posts"(
    "id" INTEGER NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "body" TEXT NULL,
    "subName" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "posts" ADD PRIMARY KEY("id");
ALTER TABLE
    "posts" ADD CONSTRAINT "posts_identifier_unique" UNIQUE("identifier");
CREATE INDEX "posts_slug_index" ON
    "posts"("slug");
CREATE TABLE "subs"(
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NULL,
    "imageUrn" VARCHAR(255) NULL,
    "bannerUrn" VARCHAR(255) NULL,
    "username" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "subs" ADD PRIMARY KEY("id");
ALTER TABLE
    "subs" ADD CONSTRAINT "subs_name_unique" UNIQUE("name");
CREATE TABLE "comments"(
    "id" INTEGER NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "body" VARCHAR(255) NOT NULL,
    "postId" VARCHAR(255) NOT NULL,
    "createdAt" VARCHAR(255) NOT NULL,
    "updatedAt" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "comments" ADD PRIMARY KEY("id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_identifier_unique" UNIQUE("identifier");
CREATE TABLE "votes"(
    "id" INTEGER NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "commentId" INTEGER NULL,
    "postId" INTEGER NULL
);
ALTER TABLE
    "votes" ADD PRIMARY KEY("id");
CREATE TABLE "migrations"(
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "timestamp" BIGINT NOT NULL
);
ALTER TABLE
    "migrations" ADD PRIMARY KEY("id");
ALTER TABLE
    "votes" ADD CONSTRAINT "votes_commentid_foreign" FOREIGN KEY("commentId") REFERENCES "comments"("id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_postid_foreign" FOREIGN KEY("postId") REFERENCES "posts"("id");
ALTER TABLE
    "votes" ADD CONSTRAINT "votes_postid_foreign" FOREIGN KEY("postId") REFERENCES "posts"("id");