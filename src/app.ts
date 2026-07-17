import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotEnv from "./app/config/dotEnv";
import routers from "./app/routes";
import globalErrorHandler from "./app/errors/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

app.use(
	cors({
		origin: dotEnv.frontend_url,
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.get("/", (req: Request, res: Response) => {
	res.send("hello world!");
}); // server test routes
app.use("/api", routers); // all routes
app.use(notFound); // 404 handle
app.use(globalErrorHandler); // global error handler

export default app;
