import { UserRole } from "../../../../generated/prisma/enums.js";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface ILoginUser {
  email: string;
  password: string;
}