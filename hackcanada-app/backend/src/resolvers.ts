import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "./context";
import { Recipe, User } from "./graphql-schema";
import { validatePassword } from "./utils/validatePassword";
import { generate } from "./rag";
import { GraphQLJSONObject } from "graphql-scalars";

@InputType()
class RegisterInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  confirmPassword: string;
  @Field(() => String)
  password: string;
}

@InputType()
class UpdateSettingsInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  currentPassword?: string;

  @Field(() => String, { nullable: true })
  newPassword?: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class FieldError {
  @Field(() => String)
  field: string;
  @Field(() => String)
  message: string;
}

@InputType()
class RecipeInput {
  @Field(() => String)
  cuisine: string;

  @Field(() => Int, { nullable: true })
  protein?: number;

  @Field(() => String, { nullable: true })
  restrictions?: string;
}

@ObjectType()
class RecipeResponse {
  @Field(() => String, { nullable: true })
  recipe?: string;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  metadata?: Record<string, any>;
}

@InputType()
class SaveRecipeInput {
  @Field(() => String)
  name: string;

  @Field(() => [String])
  ingredients: string[];

  @Field(() => [String])
  keywords: string[];

  @Field(() => String)
  instructions: string;

  @Field(() => String, { nullable: true })
  image_uri?: string;

  @Field(() => String)
  description: string;
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => UserResponse)
  async updateSettings(
    @Ctx() { req, prisma }: Context,
    @Arg("input") input: UpdateSettingsInput
  ): Promise<UserResponse> {
    let user = await prisma.user.findUniqueOrThrow({
      where: { id: req.session.userId },
    });

    if (input.currentPassword && input.newPassword) {
      const valid = await argon2.verify(user.password, input.currentPassword);
      if (!valid) {
        return {
          errors: [
            {
              field: "currentPassword",
              message: "Invalid Password",
            },
          ],
        };
      }
      const error = validatePassword(input.newPassword);
      if (error) {
        return {
          errors: [error],
        };
      }
      user.password = await argon2.hash(input.newPassword);
    }

    if (input.email) {
      user.email = input.email;
    }

    user = await prisma.user.update({
      where: { id: req.session.userId },
      data: user,
    });

    return { user };
  }

  @Mutation(() => UserResponse)
  async updatePassword(
    @Ctx() { req, prisma }: Context,
    @Arg("currentPassword") currentPassword: string,
    @Arg("newPassword") newPassword: string
  ): Promise<UserResponse> {
    let user = await prisma.user.findUniqueOrThrow({
      where: { id: req.session.userId },
    });

    if (!user.password) {
      throw new Error("NO PASSWORD.");
    }
    const valid = await argon2.verify(user!.password, currentPassword);
    if (!valid) {
      return {
        errors: [
          {
            field: "currentPassword",
            message: "Invalid Password",
          },
        ],
      };
    }
    const error = validatePassword(newPassword);
    if (error) {
      return {
        errors: [error],
      };
    }

    const hashedNewPassword = await argon2.hash(newPassword);

    user = await prisma.user.update({
      where: { id: req.session.userId },
      data: { password: hashedNewPassword },
    });

    return { user };
  }

  @Mutation(() => UserResponse)
  async updateEmail(
    @Ctx() { req, prisma }: Context,
    @Arg("currentPassword") currentPassword: string,
    @Arg("email") email: string
  ): Promise<UserResponse> {
    let user = await prisma.user.findUniqueOrThrow({
      where: { id: req.session.userId },
    });

    if (!user.password) {
      throw new Error("NO PASSWORD.");
    }
    const valid = await argon2.verify(user!.password, currentPassword);
    if (!valid) {
      return {
        errors: [
          {
            field: "currentPassword",
            message: "Invalid Password",
          },
        ],
      };
    }
    user = await prisma.user.update({
      where: { id: req.session.userId },
      data: { email },
    });

    return { user };
  }

  @Mutation(() => UserResponse)
  async updateName(
    @Ctx() { req, prisma }: Context,
    @Arg("currentPassword") currentPassword: string,
    @Arg("name") name: string
  ): Promise<UserResponse> {
    let user = await prisma.user.findUniqueOrThrow({
      where: { id: req.session.userId },
    });

    if (!user.password) {
      throw new Error("NO PASSWORD.");
    }
    const valid = await argon2.verify(user!.password, currentPassword);
    if (!valid) {
      return {
        errors: [
          {
            field: "currentPassword",
            message: "Invalid Password",
          },
        ],
      };
    }
    user = await prisma.user.update({
      where: { id: req.session.userId },
      data: { name },
    });

    return { user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { prisma, req }: Context): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    return prisma.user.findUnique({ where: { id: req.session.userId } });
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { prisma }: Context
  ): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "There is no user with that email",
          },
        ],
      };
    }
    if (!user.password) {
      throw new Error("NO PASSWORD.");
    }

    if (!(await argon2.verify(user.password, password))) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid Password",
          },
        ],
      };
    }

    return { user };
  }
  @Mutation(() => UserResponse)
  async register(
    @Ctx() { req, prisma }: Context,
    @Arg("input") input: RegisterInput
  ): Promise<UserResponse> {
    if (input.password.length <= 6) {
      return {
        errors: [
          {
            field: "password",
            message: "Password length must be greater than 6 ",
          },
        ],
      };
    }

    if (input.password !== input.confirmPassword) {
      return {
        errors: [
          {
            field: "confirmPassword",
            message: "Passwords do not match",
          },
        ],
      };
    }

    const hashedPass = await argon2.hash(input.password);

    let user;
    try {
      user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPass,
        },
      });
      console.log("User ", user);
    } catch (err) {
      console.log(err);
      if (err.code === "P2002") {
        return {
          errors: [
            {
              field: "email",
              message: "Email already exists",
            },
          ],
        };
      }
    }
    req.session.userId = user?.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        res.clearCookie("qid");
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}

@Resolver(Recipe)
export class RecipeResolver {
  @Mutation(() => RecipeResponse)
  async getRecipe(
    @Arg("input") input: RecipeInput,
    @Ctx() { req }: Context
  ): Promise<RecipeResponse> {
    console.log(req.session.userId);
    try {
      // Check if user is authenticated
      if (!req.session.userId) {
        return {
          error: "`Not auth`enticated",
        };
      }

      const result = await generate(
        input.cuisine,
        input.protein || 0,
        input.restrictions || ""
      );

      if (!result) {
        return {
          error: "No recipe found",
        };
      }

      return {
        recipe: result.recipe,
        metadata: result.metadata,
      };
    } catch (error) {
      console.error("Error generating recipe:", error);
      return {
        error: "Failed to generate recipe",
      };
    }
  }

  @Query(() => [Recipe])
  async getUserRecipes(@Ctx() { req, prisma }: Context) {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        user_id: req.session.userId,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        user: true,
      },
    });

    return recipes;
  }

  @Mutation(() => Boolean)
  async saveRecipe(
    @Arg("input") input: SaveRecipeInput,
    @Ctx() { req, prisma }: Context
  ): Promise<boolean> {
    try {
      // Check if user is authenticated
      if (!req.session.userId) {
        throw new Error("Not authenticated");
      }

      await prisma.recipe.create({
        data: {
          name: input.name,
          ingredients: input.ingredients,
          keywords: input.keywords,
          instructions: input.instructions,
          image_uri: input.image_uri,
          user_id: req.session.userId,
        },
      });

      return true;
    } catch (error) {
      console.error("Error saving recipe:", error);
      return false;
    }
  }
}
