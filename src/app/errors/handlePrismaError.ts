import { Prisma } from "../../../generated/prisma/client.js";
import { TGenericErrorResponse } from "./error.types";

const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
  let statusCode = 500;
  let message = "Database Error";

  let errorDetails = [
    {
      path: "",
      message: error.message,
    },
  ];

  switch (error.code) {
    case "P2002":
      statusCode = 409;
      message = "Duplicate Entry";

      errorDetails = [
        {
          path: Array.isArray(error.meta?.target)
            ? error.meta.target.join(", ")
            : String(error.meta?.target ?? ""),
          message: "Value already exists",
        },
      ];
      break;

    case "P2003":
      statusCode = 400;
      message = "Foreign Key Constraint Failed";

      errorDetails = [
        {
          path: Array.isArray(error.meta?.field_name)
            ? error.meta.field_name.join(", ")
            : String(error.meta?.field_name ?? ""),
          message: "Related record does not exist",
        },
      ];
      break;

    case "P2025":
      statusCode = 404;
      message = "Record Not Found";

      errorDetails = [
        {
          path: "",
          message: "The requested record does not exist",
        },
      ];
      break;
  }

  return {
    statusCode,
    message,
    errorDetails,
  };
};

export default handlePrismaError;