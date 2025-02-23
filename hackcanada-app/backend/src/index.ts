import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { UserResolver } from "./resolvers";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import { RedisStore } from "connect-redis";
import Redis from "ioredis";
import { __prod__ } from "./constants";

const prisma = new PrismaClient({
  log: !__prod__ ? ["query", "error", "info", "warn"] : [],
});

const main = async () => {
  const app = express();
  const redis = new Redis();

  const redisStore = new RedisStore({
    client: redis,
    disableTouch: true,
  });

  app.set("trust proxy", 1);

  app.use(
    session({
      name: "qid",
      store: redisStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      credentials: true,
      origin: "http://localhost:3000",
    }),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({
        req,
        res,
        prisma,
        redis,
      }),
    }) as unknown as express.RequestHandler
  );

  app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000/graphql");
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
