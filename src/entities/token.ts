import jwt from "jsonwebtoken";

export type Payload = {
  id: string;
  role: string;
} & jwt.JwtPayload;
