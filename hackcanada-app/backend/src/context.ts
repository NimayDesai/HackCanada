import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { Redis } from "ioredis";

export type Context = {
  req: any;
  res: Response;
  prisma: PrismaClient;
  redis: Redis;
};
