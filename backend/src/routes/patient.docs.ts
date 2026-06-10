import type {
  ZodOpenApiPathsObject,
  ZodOpenApiResponseObject,
} from "zod-openapi";
import { errorResponseSchema } from "../types/common.schema.js";
import {
  createPatientSchema,
  getPatientParamsSchema,
  patientDtoSchema,
  updatePatientSchema,
} from "../types/patient.schema.js";

const errorResponse = (description: string): ZodOpenApiResponseObject => ({
  description,
  content: { "application/json": { schema: errorResponseSchema } },
});

const patientResponse = (description: string): ZodOpenApiResponseObject => ({
  description,
  content: { "application/json": { schema: patientDtoSchema } },
});

export const patientPaths: ZodOpenApiPathsObject = {
  "/patients": {
    get: {
      operationId: "listPatients",
      tags: ["Patients"],
      summary: "List patients",
      description:
        "Healthcare professionals see only patients they have evaluated. Administrators see all.",
      responses: {
        "200": {
          description: "List of patients.",
          content: { "application/json": { schema: patientDtoSchema.array() } },
        },
        "401": errorResponse("Missing or invalid token."),
      },
    },
    post: {
      operationId: "createPatient",
      tags: ["Patients"],
      summary: "Create a patient",
      description:
        "Pass `guardianId` to link an existing guardian, or a `guardian` object to create one inline. Providing both is an error.",
      requestBody: {
        required: true,
        content: { "application/json": { schema: createPatientSchema } },
      },
      responses: {
        "201": patientResponse("The created patient."),
        "400": errorResponse("Validation failed."),
        "401": errorResponse("Missing or invalid token."),
      },
    },
  },
  "/patients/{id}": {
    get: {
      operationId: "getPatientById",
      tags: ["Patients"],
      summary: "Get a patient by id",
      requestParams: { path: getPatientParamsSchema },
      responses: {
        "200": patientResponse("The requested patient."),
        "400": errorResponse("Invalid id."),
        "401": errorResponse("Missing or invalid token."),
        "404": errorResponse("Patient not found."),
      },
    },
    patch: {
      operationId: "updatePatient",
      tags: ["Patients"],
      summary: "Update a patient",
      description:
        "All fields are optional. Set `guardianId: null` to unlink the guardian.",
      requestParams: { path: getPatientParamsSchema },
      requestBody: {
        required: true,
        content: { "application/json": { schema: updatePatientSchema } },
      },
      responses: {
        "200": patientResponse("The updated patient."),
        "400": errorResponse("Validation failed."),
        "401": errorResponse("Missing or invalid token."),
        "404": errorResponse("Patient not found."),
      },
    },
    delete: {
      operationId: "deletePatient",
      tags: ["Patients"],
      summary: "Soft-delete a patient",
      requestParams: { path: getPatientParamsSchema },
      responses: {
        "200": patientResponse("The deleted patient."),
        "401": errorResponse("Missing or invalid token."),
        "404": errorResponse("Patient not found."),
      },
    },
  },
};
