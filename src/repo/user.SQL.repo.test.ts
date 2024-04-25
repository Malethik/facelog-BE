import { PrismaClient } from "@prisma/client";

import { UserRepo } from "./user.sql.repo";
import { HttpError } from "../middleware/http.error";

const mockPrisma = {
  user: {
    findMany: jest.fn().mockResolvedValue({}),
    findUnique: jest.fn().mockResolvedValue({ id: "1" }),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
} as unknown as PrismaClient;

describe("given a instanc of class SerieRepo", () => {
  const repo = new UserRepo(mockPrisma);
  test("The it should be instance of the class Serierepo", () => {
    expect(repo).toBeInstanceOf(UserRepo);
  });
  /* --------------------------------------------------------------- */
  describe("When we use the method readAll", () => {
    test("Then it should call the prisma method findMany()", async () => {
      const result = await repo.readAll();
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  test("Then it should call the method readById", async () => {
    const result = await repo.readById("1");
    expect(mockPrisma.user.findUnique).toHaveBeenCalled();
    expect(result).toEqual({ id: "1" });
  });

  test("Then it should call the method readById with wrong ID", async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    await expect(repo.readById("2")).rejects.toThrow(
      new HttpError(404, "Not Found", "Serie 2 not found!")
    );
  });

  describe("When we use the method create", () => {
    test("Then it should call the method create", async () => {
      (mockPrisma.user.create as jest.Mock).mockResolvedValue('[{"id":"1"}]');
      const result = await repo.create({
        email: "",
        name: "",
        password: "",
        avatar: "",
      });
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toEqual('[{"id":"1"}]');
    });
  });

  describe("When we use the method update", () => {
    test("Then it should call the method update", async () => {
      (mockPrisma.user.update as jest.Mock).mockResolvedValue('[{"id":"1"}]');
      const result = await repo.update("1", {});
      expect(result).toEqual('[{"id":"1"}]');
    });
  });
  describe("when we use the method to delete", () => {
    test("then it should call the method to delete", async () => {
      (mockPrisma.user.delete as jest.Mock).mockResolvedValue('[{"id":"1"}]');
      const result = await repo.delete("1");
      expect(result).toEqual('[{"id":"1"}]');
    });
  });
});
