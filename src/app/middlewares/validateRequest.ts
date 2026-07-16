import { RequestHandler } from "express";

type ZodSchema = {
	parseAsync: (data: unknown) => Promise<unknown>;
};

const validateRequest = (schema: ZodSchema): RequestHandler => {
	return async (req, res, next) => {
		try {
			await schema.parseAsync({
				body: req.body,
				params: req.params,
				query: req.query,
				cookies: req.cookies,
			});

			next();
		} catch (error) {
			next(error);
		}
	};
};

export default validateRequest;
