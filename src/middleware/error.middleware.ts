import debug from "debug";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "./http.error.js";

export class ErrorsMidleware {
  constructor() {
    debug("Starting error midleware");
  }

  handle(error: Error, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof HttpError) {
      debug(error.message);
      res.status(error.status);
      res.json({
        status: `${error.status} ${error.statusMessage}`,
        message: error.message,
      });
      return;
    }

    debug("Request recived");
    res.status(500);
    res.json({
      status: "500 Internal Server Error",
      message: error.message,
    });
  }
}
