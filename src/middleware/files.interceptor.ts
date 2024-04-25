/* eslint-disable camelcase */
import createDebug from "debug";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { HttpError } from "./http.error.js";

const debug = createDebug("W7E:file:interceptor");

export class FileInterceptor {
  constructor() {
    debug("instancied file interceptor");
  }

  singleFile(fieldName = "avatar") {
    const storage = multer.diskStorage({
      destination: "uploads/",
      filename(_req, file, callback) {
        callback(null, Date.now() + "_" + file.originalname);
      },
    });
    const upload = multer({ storage });
    const middleware = upload.single(fieldName);

    /*  Return middleware; */

    return (req: Request, res: Response, next: NextFunction) => {
      const previusBoy = req.body as Record<string, unknown>;
      middleware(req, res, next);
      req.body = { previusBoy, ...req.body } as unknown;
    };
  }

  async cloudinaryUpload(req: Request, res: Response, next: NextFunction) {
    const option = {
      folder: "social",
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };
    if (!req.file) {
      next(new HttpError(400, "Bad Request", "No file uploaded"));
      return;
    }

    const finalpath = req.file.destination + "/" + req.file.filename;
    try {
      const result = await cloudinary.uploader.upload(finalpath, option);
      console.log(result);
      next();
    } catch (error) {
      next(
        new HttpError(500, "Internal Server Error", (error as Error).message)
      );
    }
  }
}
