import app from "./appMain";
import dotEnv from "./app/config/dotEnv";
import prisma from "./app/lib/prisma";

const port = dotEnv.port;

const main = async () => {
	try {
		await prisma.$connect();
		console.log("database connect successfully!");

		app.listen(port, () => {
			console.log(`server running on http://localhost:${port}`);
		});
	} catch (error) {
		console.error("Error starting server", error);
		await prisma.$disconnect();
		process.exit(1);
	}
};
main();
