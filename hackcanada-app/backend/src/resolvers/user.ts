import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { v4 } from "uuid";
import { User } from "../../prisma/generated";
import {
  COOKIE_NAME,
  FORGET_PASSWORD_PREFIX,
  VERIFY_PREFIX,
} from "../constants";
import { MyContext } from "../types";
import { isAuth } from "../utils/isAuth";
import { sendEmail } from "../utils/sendEmail";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
    userId: number;
  }
}

@InputType()
class UsernamePasswordEmailInput {
  @Field(() => String)
  username: string;
  @Field(() => String)
  password: string;
  @Field(() => String)
  email: string;
  @Field()
  name: string;
}


@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}
@ObjectType()
class FieldError {
  @Field(() => String)
  field: string;
  @Field(() => String)
  message: string;
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => Boolean)
  async sendVerifyEmail(
    @Arg("email") email: string,
    @Ctx() { prisma, redis }: MyContext
  ) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return true;
    }

    const token = v4();
    redis.set(VERIFY_PREFIX + token, user.id, "EX", 1000 * 60 * 60 * 24 * 3);
    const HTML = `
    <div>
      <h1>Please Verify your Account</h1>
      <h2>NutriMind will never ask you to verify your account over the phone or via SMS, only via email</h2>
      <a href="https://hbcodelink.tech/verify/${token}">Verify Account</a>
    </div>
    `;
    await sendEmail(email, HTML, "Verify your CodeLink account");

    return true;
  }

  @Mutation(() => UserResponse)
  async vefifyUser(
    @Arg("token") token: string,
    @Ctx() { prisma, redis }: MyContext
  ): Promise<UserResponse> {
    const key = VERIFY_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Invalid Token",
          },
        ],
      };
    }
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        verified: true,
      },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    await redis.del(key);
    return { user };
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { prisma, req, redis }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Length must be at least 2 characters",
          },
        ],
      };
    }
    const key = FORGET_PASSWORD_PREFIX + token;

    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token expired",
          },
        ],
      };
    }

    const user = await prisma.user.update({
      data: {
        password: await argon2.hash(newPassword),
      },
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await redis.del(key);

    req.session.userId = user.id;

    return { user };
  }
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { prisma, redis }: MyContext
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return true;
    }

    const token = v4();
    redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3
    );
    const HTML = `<a href="https://hbcodelink.tech/change-password/${token}">reset password</a>`;
    await sendEmail(email, HTML, "CodeLink Reset Password");

    return true;
  }
  @UseMiddleware(isAuth)
  @Mutation(() => UserResponse)
  async changeInfo(
    @Arg("input") input: UsernamePasswordEmailOptInput,
    @Arg("password") password: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<UserResponse> {
    if (input.email && !input.email.includes("@")) {
      return {
        errors: [
          {
            field: "email",
            message: "Email Must Include at sign",
          },
        ],
      };
    }
    if (input.email && input.email.length <= 2) {
      return {
        errors: [
          {
            field: "email",
            message: "Length must be greater than 2",
          },
        ],
      };
    }
    if (input.username && input.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Length must be at least 2",
          },
        ],
      };
    }
    if (input.password && input.password.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Length must be at least 2",
          },
        ],
      };
    }

    if (password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "Length must be at least 2",
          },
        ],
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
    });
    const valid = await argon2.verify(user!.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid Password",
          },
        ],
      };
    }

    let user2: User | undefined;
    try {
      user2 = await prisma.user.update({
        data: {
          password: input.password
            ? await argon2.hash(input.password)
            : undefined,
          username: input.username ? input.username : undefined,
          email: input.email ? input.email : undefined,
          name: input.name ? input.name : undefined,
        },
        where: {
          id: req.session.userId,
        },
      });
    } catch (err) {
      if (err.code === "P2002") {
        return {
          errors: [
            {
              field: "username",
              message: "User already exists",
            },
          ],
        };
      }
    }

    return { user: user2 };
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async uploadImg(
    @Ctx() { req, prisma }: MyContext,
    @Arg("imageUri", () => String) imageUri: string
  ): Promise<UserResponse> {
    const userId = req.session.userId;
    const user = await prisma.user.update({
      data: { imageUri },
      where: { id: userId },
    });
    return { user };
  }
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext): string {
    if (req.session.userId === user.id) {
      return user.email;
    } else {
      return "";
    }
  }
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, prisma }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
    });
    return user;
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordEmailInput)
    options: UsernamePasswordEmailInput,
    @Ctx() { req, prisma }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Length must be greater than 2 characters",
          },
        ],
      };
    }
    if (options.email.length <= 2) {
      return {
        errors: [
          {
            field: "email",
            message: "Length must be greater than 2 characters",
          },
        ],
      };
    }
    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "Length must be greater than 2 characters",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      user = await prisma.user.create({
        data: {
          username: options.username,
          email: options.email,
          password: hashedPassword,
          name: options.name,
        },
      });
    } catch (err) {
      if (err.code === "P2002") {
        return {
          errors: [
            {
              field: "username",
              message: "user already exists",
            },
          ],
        };
      }
    }

    req.session.userId = user?.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async registerAdmin(
    @Arg("options", () => UsernamePasswordEmailInput)
    options: UsernamePasswordEmailInput,
    @Arg("adminPass") adminPass: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Length must be greater than 2 characters",
          },
        ],
      };
    }
    if (options.email.length <= 2) {
      return {
        errors: [
          {
            field: "email",
            message: "Length must be greater than 2 characters",
          },
        ],
      };
    }
    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "Length must be greater than 2 characters",
          },
        ],
      };
    }

    if (adminPass !== process.env.ADMIN_PASSWORD) {
      return {
        errors: [
          {
            field: "adminPass",
            message: "Invalid ADMIN PASSWORD",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      user = await prisma.user.create({
        data: {
          username: options.username,
          email: options.email,
          password: hashedPassword,
          name: options.name,
          isAdmin: true,
          verified: true,
        },
      });
    } catch (err) {
      if (err.code === "P2002") {
        return {
          errors: [
            {
              field: "username",
              message: "user already exists",
            },
          ],
        };
      }
    }

    req.session.userId = user?.id;

    return { user };
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail", () => String) usernameOrEmail: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "There is no user with that username or email",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid Password",
          },
        ],
      };
    }
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);

        if (err) {
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteUser(@Ctx() { req, res, prisma }: MyContext): Promise<boolean> {
    await prisma.user.delete({ where: { id: req.session.userId } });
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);

        if (err) {
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }
}