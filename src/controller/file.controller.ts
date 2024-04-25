import { NextFunction, Request, Response } from "express";
import { HttpError } from "../middleware/http.error.js";

export class FileController {
  fileHandler(req: Request, res: Response, next: NextFunction) {
    console.log("avatar", req.file);
    if (!req.file) {
      next(new HttpError(400, "Bad Request", "No file uploaded"));
      return;
    }

    return res.json({
      message: `File ${req.file.filename} uploaded successfully`,
      file: req.file.filename,
    });
  }
}
