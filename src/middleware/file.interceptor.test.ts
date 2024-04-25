import { Auth } from "../service/auth.service";
import multer from "multer";
import { NextFunction, Request, Response } from "express";
import { FileInterceptor } from "./files.interceptor";
import { v2 } from "cloudinary";

jest.mock("multer");
const interceptor = new FileInterceptor();
Auth.verifyJwT = jest.fn().mockReturnValue({ id: "1" });
const req = {
  body: {},
  get: jest.fn().mockReturnValue("Bearer token"),
} as unknown as Request;
const res = {} as unknown as Response;
const next: NextFunction = jest.fn();

describe("Given a instance of the class TestController", () => {
  test("given an instance of the class fileInterceptor", () => {
    expect(interceptor).toBeInstanceOf(FileInterceptor);
  });
});
describe("When we use the method single file", () => {
  const mockMiddleWare = jest.fn();
  multer.diskStorage = jest
    .fn()
    .mockImplementation(({ fileName }) => fileName("", "", () => {}));
  (multer as unknown as jest.Mock).mockReturnValue(mockMiddleWare);

  test("Then it should call next", () => {
    /*  Const middleware = interceptor.singleFile()(req, res, next); */
  });
});
describe("When we use the method cloudinaryUpload", () => {
  v2.uploader = {
    upload: jest.fn().mockResolvedValue({}),
  } as unknown as typeof v2.uploader;

  test("Then it should call next", async () => {
    await interceptor.cloudinaryUpload(req, res, next);
    expect(v2.uploader.upload).toHaveBeenCalled();
  });
});
