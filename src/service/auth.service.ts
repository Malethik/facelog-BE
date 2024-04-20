import "dotenv/config";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { Payload } from "../entities/token";

export class Auth {
  static secret = process.env.SECRET_TOKEN;

  static async hash(value: string) {
    return hash(value, 10);
  }

  static async compare(value: string, hash: string) {
    return compare(value, hash);
  }

  static signJwt(payload: Payload) {
    if (!Auth.secret) throw new Error("JWT secret not set");
    return jwt.sign(payload, Auth.secret);
  }

  static verifyJwT(token: string) {
    if (!Auth.secret) throw new Error("JWS secret not set");
    return jwt.verify(token, Auth.secret) as Payload;
  }
}
