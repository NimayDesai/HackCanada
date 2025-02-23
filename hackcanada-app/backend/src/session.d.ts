import { User } from "prisma/generated";

declare module "express-session" {
  export interface SessionData {
    user: User;
    userId: number;
    currentChallenge: string;
  }
}
