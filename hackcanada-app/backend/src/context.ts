import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { Redis } from "ioredis";
import session from "express-session";

export type Context = {
  req: Request & { session: session.Session & Partial<session.SessionData> };
  res: Response;
  prisma: PrismaClient;
  redis: Redis;
};
