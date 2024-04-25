import { Auth } from "../service/auth.service";
import { AuthInterceptor } from "./auth.interceptor";
import { Request, Response } from "express";

describe("Given a instance of the class TestController", () => {
  const interceptor = new AuthInterceptor();
  Auth.verifyJwT = jest.fn().mockReturnValue({ id: "1" });

  test("given an instance of the class authInterceptor", () => {
    expect(interceptor).toBeInstanceOf(AuthInterceptor);
  });

  describe("When we use the method authentication and the token is valid", () => {
    const req = {
      body: {},
      get: jest.fn().mockReturnValue("Bearer token"),
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn();
    test("", () => {
      interceptor.authentication(req, res, next);
      expect(Auth.verifyJwT).toHaveBeenCalled();
      expect(req.body.payload).toEqual({ id: "1" });
      expect(next).toHaveBeenCalled();
    });
    test("Then it should call next", () => {
      interceptor.authentication(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
