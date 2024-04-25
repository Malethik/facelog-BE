import { Router as createRouter } from "express";
import { FileController } from "../controller/file.controller.js";
import { FileInterceptor } from "../middleware/files.interceptor.js";

export class FileRouter {
  router = createRouter();

  constructor(
    readonly controller: FileController,
    readonly fileInterceptor: FileInterceptor
  ) {
    this.router.post(
      "/upload",
      fileInterceptor.singleFile("avatar").bind(fileInterceptor),
      controller.fileHandler.bind(controller)
    );
  }
}
