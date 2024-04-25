import createDebug from "debug";
import { NextFunction, Request, Response } from "express";
import multer from "multer";

const debug = createDebug("W7E:file:interceptor");

export class FileInterceptor {
  constructor() {
    debug("instancied file interceptor");
  }

  singleFile(fieldName: string = "avatar") {
    const storage = multer.diskStorage({
      destination: "uploads/",
      filename(_req, file, callback) {
        callback(null, Date.now() + "_" + file.originalname);
      },
    });
    const upload = multer({ storage });
    const middleware = upload.single(fieldName);

    return middleware;

    /*  Return (req: Request, res: Response, next: NextFunction) => {
      const previusBoy = req.body as Record<string, unknown>;
      middleware(req, res, next);
      req.body = { previusBoy, ...req.body } as unknown;
    }; */
  }
}
