import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "./context";
import { User } from "./graphql-schema";
import { validatePassword } from "./utils/validatePassword";

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

@Resolver(User)
export class UserResolver {
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
