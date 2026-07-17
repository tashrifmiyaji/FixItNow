import dotenv from "dotenv";
import path from "path";
import { SignOptions } from "jsonwebtoken";

dotenv.config({
	path: path.join(process.cwd(), ".env"),
});

export default {
	port: process.env.PORT,
	database_url: process.env.DATABASE_URL,

	frontend_url: process.env.FRONTEND_URL,
	backend_url: process.env.BACKEND_URL,

	bcrypt_salt_round: Number(process.env.BCRYPT_SALT_ROUNDS),

	jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,

	jwt_access_expires_in: process.env
		.JWT_ACCESS_EXPIRES_IN! as SignOptions["expiresIn"],

	jwt_refresh_expires_in: process.env
		.JWT_REFRESH_EXPIRES_IN! as SignOptions["expiresIn"],

	stripe_secret_key: process.env.STRIPE_SECRET_KEY,
	stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
};
