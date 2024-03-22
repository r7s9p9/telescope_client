import z from "zod";

const envVars = z.object({
    VITE_USERNAME_LENGTH_MIN: z.string().min(1).transform((val) => Number(val)),
    VITE_USERNAME_LENGTH_MAX: z.string().min(1).transform((val) => Number(val)),
    VITE_PASSWORD_LENGTH_MIN: z.string().min(1).transform((val) => Number(val)),
    VITE_PASSWORD_LENGTH_MAX: z.string().min(1).transform((val) => Number(val))
  });

const verifiedEnv = envVars.parse(import.meta.env);

export const env = {
    isProd: import.meta.env.PROD,
    usernameRange: { min: verifiedEnv.VITE_USERNAME_LENGTH_MIN, max: verifiedEnv.VITE_USERNAME_LENGTH_MAX },
    passwordRange: { min: verifiedEnv.VITE_PASSWORD_LENGTH_MIN, max: verifiedEnv.VITE_PASSWORD_LENGTH_MAX }
};