import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../../generated/prisma/enums.js";

export interface IJwtPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}