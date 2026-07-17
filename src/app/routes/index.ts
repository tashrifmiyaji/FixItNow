import { Router } from "express";

import authRoutes from "../modules/Auth/auth.route";
import userRoutes from "../modules/User/user.route";
import categoryRoutes from "../modules/Category/category.route";
import serviceRoutes from "../modules/Service/service.route";
import technicianRoutes from "../modules/Technician/technician.route";
import bookingRoutes from "../modules/Booking/booking.route";

const routers = Router();

routers.use("/auth", authRoutes);
routers.use("/users", userRoutes);
routers.use("/category", categoryRoutes);
routers.use("/service", serviceRoutes);
routers.use("/technician", technicianRoutes);
routers.use("/booking", bookingRoutes);

export default routers;
