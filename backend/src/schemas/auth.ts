import { FromSchema } from "json-schema-to-ts";

export const registerSchema = {
    type: "object",
    required: ["username", "email", "password"],
    properties: {
        username: { type: "string", minLength: 3, maxLength: 32 },
        email: { type: "string", minLength: 3, maxLength: 255 },
        password: { type: "string", minLength: 8 }
    },
    additionalProperties: false
} as const;

export const loginSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: { type: "string", minLength: 3, maxLength: 255 },
        password: { type: "string", minLength: 1 }
    },
    additionalProperties: false
} as const;

export type Register = FromSchema<typeof registerSchema>;
export type Login = FromSchema<typeof loginSchema>;