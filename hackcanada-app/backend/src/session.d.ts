import { User } from "prisma/generated";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}
