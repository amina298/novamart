import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "JWT_SECRET",
  "FRONTEND_URLS",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is not defined.`);
  }
}

export const env = {
  DB_NAME: process.env.DB_NAME as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: Number(process.env.DB_PORT),
  JWT_SECRET: process.env.JWT_SECRET as string,
  PORT: Number(process.env.PORT) || 5000,

  FRONTEND_URLS: (process.env.FRONTEND_URLS as string)
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
};