import { RequestHandler } from "express";
import httpStatus from "http-status";

import AppError from "../errors/AppError";
import { UserRole } from "../../../generated/prisma/enums";

const authorize = (...roles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to access this resource!"
      );
    }

    next();
  };
};

export default authorize;