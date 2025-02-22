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

  // A mutation that echoes back the provided message.
  @Mutation(() => String)
  echo(@Arg("message") message: string): string {
    return message;
  }

  @Mutation(() => String)
  async queryGemini(@Arg("options") options: GeminiOptions) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Find a list of of " + prompt);
    return result;
  }
}
