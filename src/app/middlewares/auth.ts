import { RequestHandler } from "express";
import httpStatus from "http-status";

import prisma from "../lib/prisma";
import AppError from "../errors/AppError";
import { jwtHelpers } from "../utils/jwt";
import dotEnv from "../config/dotEnv";
import { UserStatus } from "../../../generated/prisma/enums";

const auth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const accessToken = token.split(" ")[1];

    if (!accessToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid authorization token!");
    }

    const decoded = jwtHelpers.verifyToken(
      accessToken,
      dotEnv.jwt_access_secret
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    if (user.status === UserStatus.BANNED) {
      throw new AppError(httpStatus.FORBIDDEN, "User is banned!");
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;