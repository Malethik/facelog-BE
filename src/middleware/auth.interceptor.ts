import createDebug from "debug";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "./http.error.js";
import { Auth } from "../service/auth.service.js";
import { Payload } from "../entities/token.js";
import { Repo } from "../entities/type.repo.js";

const debug = createDebug("W7E:Auth:interceptor");

export class AuthInterceptor {
  constructor() {
    debug("Starting error midleware");
  }

  authentication(req: Request, res: Response, next: NextFunction) {
    const data = req.get("authorization");

    const error = new HttpError(498, "Token expired/invalid", "Token invalid");

    if (!data?.startsWith("Bearer")) {
      next(error);
      return;
    }

    const token = data?.slice(7);
    try {
      const payload = Auth.verifyJwT(token);

      req.body.payload = payload;
      next();
    } catch (err) {
      error.message = (err as Error).message;
      next(error);
    }
  }

  isAdmin(req: Request, res: Response, next: NextFunction) {
    const { payload } = req.body as { payload: Payload };
    const { role } = payload;
    if (role !== "ADMIN") {
      next(
        new HttpError(
          403,
          " Forbidden",
          "You are not allowed to acces this resource"
        )
      );
      return;
    }

    next();
  }

  authorization<T>(repo: Repo<T, any>, ownerKey?: keyof T) {
    return async (req: Request, res: Response, next: NextFunction) => {
      debug("Authorizing");

      const { payload, ...rest } = req.body as { payload: Payload };
      req.body = rest;

      const { role } = payload;
      if (role === "admin") {
        next();
        return;
      }

      try {
        const item = (await repo.readById(req.params.id)) as Awaited<T> & {
          id: string;
        };
        const ownerId = ownerKey
          ? (item[ownerKey] as { id: string }).id
          : item.id;
        if (payload.id !== ownerId) {
          next(
            new HttpError(
              403,
              "Forbidden",
              "You are not allowed to access this resource"
            )
          );
          return;
        }

        debug("Authorized", req.body);
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
