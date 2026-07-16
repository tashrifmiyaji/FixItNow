import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IJwtPayload } from "../interfaces/jwt.interface";

const createToken = (
  payload: Pick<IJwtPayload, "userId" | "role">,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

const verifyToken = (
  token: string,
  secret: Secret
): IJwtPayload => {
  return jwt.verify(token, secret) as IJwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
