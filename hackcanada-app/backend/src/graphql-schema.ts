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
