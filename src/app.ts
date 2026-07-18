import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotEnv from "./app/config/dotEnv";

import routers from "./app/routes";
import paymentWebhookRoute from "./app/routes/payment.webhook.route";

import globalErrorHandler from "./app/errors/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

app.use(
	cors({
		origin: dotEnv.frontend_url,
		credentials: true,
	}),
);

app.use("/api/payments/webhook", paymentWebhookRoute);

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(cookieParser());

// Server test route
app.get("/", (req: Request, res: Response) => {
	res.send("hello world!");
});

// Application routes
app.use("/api", routers);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
