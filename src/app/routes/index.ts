import { Router } from "express";

import authRoutes from "../modules/Auth/auth.route";
import userRoutes from "../modules/User/user.route";
import categoryRoutes from "../modules/Category/category.route";
import serviceRoutes from "../modules/Service/service.route";
import technicianRoutes from "../modules/Technician/technician.route";
import bookingRoutes from "../modules/Booking/booking.route";
import adminRoutes from "../modules/Admin/admin.route";
import reviewRoutes from "../modules/Review/review.route";
import paymentRoutes from "../modules/Payment/payment.route";

const routers = Router();

routers.use("/auth", authRoutes);
routers.use("/users", userRoutes);
routers.use("/category", categoryRoutes);
routers.use("/service", serviceRoutes);
routers.use("/technician", technicianRoutes);
routers.use("/booking", bookingRoutes);
routers.use("/admin", adminRoutes);
routers.use("/review", reviewRoutes);
routers.use("/payment", paymentRoutes);

export default routers;
