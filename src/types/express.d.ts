import { IJwtPayload } from "../app/interfaces/jwt.interface";

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}

export {};