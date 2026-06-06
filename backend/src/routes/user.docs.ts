import type {
  ZodOpenApiPathsObject,
  ZodOpenApiResponseObject,
} from "zod-openapi";
import { errorResponseSchema } from "../types/common.schema.js";
import {
  getUserParamsSchema,
  inviteUserSchema,
  updateUserSchema,
  userDtoSchema,
} from "../types/user.schema.js";

const errorResponse = (description: string): ZodOpenApiResponseObject => ({
  description,
  content: { "application/json": { schema: errorResponseSchema } },
});

const jsonResponse = (
  description: string,
  schema: typeof userDtoSchema | ReturnType<typeof userDtoSchema.array>,
): ZodOpenApiResponseObject => ({
  description,
  content: { "application/json": { schema } },
});

export const userPaths: ZodOpenApiPathsObject = {
  "/users/me": {
    get: {
      operationId: "getCurrentUser",
      tags: ["Users"],
      summary: "Get the authenticated user",
      responses: {
        "200": jsonResponse("The authenticated user.", userDtoSchema),
        "401": errorResponse("Missing or invalid token."),
        "404": errorResponse("User profile not found."),
      },
    },
  },
  "/users": {
    get: {
      operationId: "listUsers",
      tags: ["Users"],
      summary: "List all users",
      description: "Requires the `administrator` role.",
      responses: {
        "200": jsonResponse("All active users.", userDtoSchema.array()),
        "401": errorResponse("Missing or invalid token."),
        "403": errorResponse("Caller is not an administrator."),
      },
    },
    post: {
      operationId: "inviteUser",
      tags: ["Users"],
      summary: "Invite a new user",
      description:
        "Sends a Supabase email invite and assigns the given role. Requires the `administrator` role.",
      requestBody: {
        required: true,
        content: { "application/json": { schema: inviteUserSchema } },
      },
      responses: {
        "201": jsonResponse("The invited user.", userDtoSchema),
        "400": errorResponse("Validation failed."),
        "401": errorResponse("Missing or invalid token."),
        "403": errorResponse("Caller is not an administrator."),
      },
    },
  },
  "/users/{id}": {
    get: {
      operationId: "getUserById",
      tags: ["Users"],
      summary: "Get a user by id",
      requestParams: { path: getUserParamsSchema },
      responses: {
        "200": jsonResponse("The requested user.", userDtoSchema),
        "400": errorResponse("Invalid id."),
        "401": errorResponse("Missing or invalid token."),
        "404": errorResponse("User not found."),
      },
    },
    patch: {
      operationId: "updateUser",
      tags: ["Users"],
      summary: "Update a user's name and/or roles",
      description: "Requires the `administrator` role.",
      requestParams: { path: getUserParamsSchema },
      requestBody: {
        required: true,
        content: { "application/json": { schema: updateUserSchema } },
      },
      responses: {
        "200": jsonResponse("The updated user.", userDtoSchema),
        "400": errorResponse("Validation failed."),
        "401": errorResponse("Missing or invalid token."),
        "403": errorResponse("Caller is not an administrator."),
        "404": errorResponse("User not found."),
      },
    },
    delete: {
      operationId: "deleteUser",
      tags: ["Users"],
      summary: "Soft-delete a user",
      description:
        "Bans the user in Supabase auth and stamps `deletedAt`. Requires the `administrator` role. Cannot delete your own account or the last administrator.",
      requestParams: { path: getUserParamsSchema },
      responses: {
        "200": jsonResponse("The deleted user.", userDtoSchema),
        "401": errorResponse("Missing or invalid token."),
        "403": errorResponse(
          "Caller is not an administrator, or is deleting their own account.",
        ),
        "404": errorResponse("User not found."),
        "409": errorResponse("Cannot delete the last administrator."),
      },
    },
  },
};
