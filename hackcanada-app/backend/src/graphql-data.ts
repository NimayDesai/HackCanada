import "reflect-metadata";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  Int,
} from "type-graphql";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "./graphql-schema";

@InputType()
class GeminiOptions {
  @Field(() => Int)
  budget: number;
}

@Resolver(() => User)
export class UserResolver {
  // A simple query returning a greeting.
  @Query(() => String)
  hello(): string {
    return "Hello, world!";
  }
}
