/* eslint-disable no-unused-vars */
import {
  NextFunction,
  Request,
  Response,
  Router as createRouter,
} from "express";
import createDebug from "debug";

import { UserController } from "../controller/user.controller.js";
import { AuthInterceptor } from "../middleware/auth.interceptor.js";

const debug = createDebug("W7E:router:film");

export class UserRouter {
  router = createRouter();
  constructor(
    private readonly controller: UserController,
    readonly authInterceptor: AuthInterceptor
  ) {
    debug("starting router");

    this.router.post("/registrer", controller.create.bind(controller));
    this.router.post("/login", controller.logIn.bind(controller));

    this.router.post(
      "/login",
      authInterceptor.authentication.bind(authInterceptor),
      this.userLoginOk.bind(this)
    );

    this.router.get("/", controller.getsAll.bind(controller));
    this.router.get("/:id", controller.getById.bind(controller));
    this.router.post("/", controller.create.bind(controller));
    this.router.patch("/:id", controller.update.bind(controller));
    this.router.delete("/:id", controller.delete.bind(controller));
  }

  userLoginOk(req: Request, res: Response, next: NextFunction) {
    res.json({
      message: "you are logged in",
      ...req.body.payload,
    });
  }
}
