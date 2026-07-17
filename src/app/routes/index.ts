import { Router } from "express";

import authRoutes from "../modules/Auth/auth.route";
import userRoutes from "../modules/User/user.route";

const routers = Router();

routers.use("/auth", authRoutes);
routers.use("/users", userRoutes);

export default routers;
