import { createDocument, type oas31 } from "zod-openapi";
import { userPaths } from "./routes/user.docs.js";
import { symptomPaths } from "./routes/symptoms.docs.js";

export const openApiDocument: oas31.OpenAPIObject = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Fragile-X Screening API",
    version: "1.0.0",
    description:
      "Backend API for the Fragile-X clinical screening application.",
  },
  servers: [{ url: "/", description: "Current host" }],
  tags: [
    { name: "Users", description: "User management and invitations." },
    { name: "Users", description: "User management and invitations." },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Supabase access token sent as `Authorization: Bearer <token>`.",
      },
    },
  },
  paths: {
    ...userPaths,
    ...symptomPaths,
  },
});
