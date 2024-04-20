import { PrismaClient } from "@prisma/client";
import createDebug from "debug";

const debug = createDebug("W7E:connecting...to database");

export const dbConnect = async () => {
  debug("...connecting...");
  const prisma = new PrismaClient();
  return prisma;
};
