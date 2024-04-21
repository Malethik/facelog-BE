import createDebug from "debug";
import { NextFunction, Request, Response } from "express";

import { BaseController } from "./base.controller.js";

import { User, UserCreateDto } from "../entities/user.js";
import { HttpError } from "../middleware/http.error.js";
import { Auth } from "../service/auth.service.js";
import { WithLoginRepo } from "../entities/type.repo.js";
import { createSchema, updateSchema } from "../entities/schema.js";

const debug = createDebug("W7E:users:controller");

export class UserController extends BaseController<User, UserCreateDto> {
  constructor(protected readonly repo: WithLoginRepo<User, UserCreateDto>) {
    super(repo, createSchema, updateSchema);
    debug("Instantiated user controller");
  }

  async logIn(req: Request, res: Response, next: NextFunction) {
    const { email, name, password } = req.body as UserCreateDto;
    if ((!email && !password) || !password) {
      next(new HttpError(400, "Bad Request", "Email or Password are required"));
      return;
    }

    try {
      const error = new HttpError(
        401,
        "Unauthorized",
        "Email or password invalid"
      );

      const user = await this.repo.searchForLogin(
        email ? "email" : "name",
        email || name
      );
      if (!user) {
        next(error);
        return;
      }

      if (!(await Auth.compare(password, user.password!))) {
        next(error);
        return;
      }

      const token = Auth.signJwt({
        id: user.id!,
        role: user.role!,
      });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    if (!req.body.password || typeof req.body.password !== "string") {
      next(new HttpError(400, "Bad Request", "password required or invalid"));
      return;
    }

    req.body.password = await Auth.hash(req.body.password as string);
    await super.create(req, res, next);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    if (req.body.password && typeof req.body.password === "string") {
      req.body.password = await Auth.hash(req.body.password as string);
    }

    await super.update(req, res, next);
  }
}
