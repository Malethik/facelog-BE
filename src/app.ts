import createDebug from "debug";
import { Express } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { UserRouter } from "./router/user.router.js";
import { UserController } from "./controller/user.controller.js";
import { UserRepo } from "./repo/user.sql.repo.js";
import { AuthInterceptor } from "./middleware/auth.interceptor.js";
import { ErrorsMidleware } from "./middleware/error.middleware.js";
import { FileController } from "./controller/file.controller.js";
import { FileRouter } from "./router/file.router.js";
import { FileInterceptor } from "./middleware/files.interceptor.js";

const debug = createDebug("W7E:app:social");

export const createApp = () => {
  debug("Creating app");
  const app = express();

  return app;
};

export const startApp = (app: Express, prisma: PrismaClient) => {
  debug("Starting app");
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.static("./public"));

  const authInterceptor = new AuthInterceptor(); // Metterlo nel router
  const fileInterceptor = new FileInterceptor();

  const userRepo = new UserRepo(prisma);
  const userController = new UserController(userRepo);
  const userRouter = new UserRouter(
    userController,
    authInterceptor,
    fileInterceptor
  );
  app.use("/user", userRouter.router);

  const filesController = new FileController();
  const fileRouter = new FileRouter(filesController, fileInterceptor);
  app.use("/files", fileRouter.router);

  const errormiddleware = new ErrorsMidleware();
  app.use(errormiddleware.handle.bind(errormiddleware));
};
