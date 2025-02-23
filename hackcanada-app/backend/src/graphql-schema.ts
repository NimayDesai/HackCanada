import "reflect-metadata";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  name?: string;
}

@ObjectType()
export class Recipe {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => [String])
  ingredients: string[];

  @Field(() => [String])
  keywords: string[];

  @Field(() => String)
  instructions: string;

  @Field(() => String, { nullable: true })
  image_uri: string | null;

  @Field(() => Int)
  user_id: number;

  @Field(() => User)
  user: User;
}
