import { NextFunction, Request, Response } from "express";
import { HttpError } from "../middleware/http.error.js";

export class FileController {
  fileHandler(req: Request, res: Response, next: NextFunction) {
    console.log("avatar", req.file);
    if (!req.file) {
      next(new HttpError(400, "Bad Request", "No file uploaded"));
      return;
    }

    res.json({
      message: `File uploaded successfully`,
      fieldname: req.file.fieldname,
      width: req.body.cloudinary.width,
      heigth: req.body.cloudinary.height,
      file: req.body.cloudinary.public_id,
    });
  }
}
