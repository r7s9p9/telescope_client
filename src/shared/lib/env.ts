import z from "zod";

const envVars = z.object({
    VITE_EMAIL_LENGTH_MAX: z.string().min(1).transform((val) => Number(val)),
    VITE_USERNAME_LENGTH_MIN: z.string().min(1).transform((val) => Number(val)),
    VITE_USERNAME_LENGTH_MAX: z.string().min(1).transform((val) => Number(val)),
    VITE_PASSWORD_LENGTH_MIN: z.string().min(1).transform((val) => Number(val)),
    VITE_PASSWORD_LENGTH_MAX: z.string().min(1).transform((val) => Number(val)),
    VITE_CODE_LENGTH: z.string().min(1).transform((val) => Number(val)),

    VITE_NAME_LENGTH_MAX: z.string().min(1).transform((val) => Number(val)),
    VITE_BIO_LENGTH_MAX: z.string().min(1).transform((val) => Number(val)),
  });

const verifiedEnv = envVars.parse(import.meta.env);

export const env = {
    isProd: import.meta.env.PROD,
    emailLengthMax: verifiedEnv.VITE_EMAIL_LENGTH_MAX,
    usernameRange: { min: verifiedEnv.VITE_USERNAME_LENGTH_MIN, max: verifiedEnv.VITE_USERNAME_LENGTH_MAX },
    passwordRange: { min: verifiedEnv.VITE_PASSWORD_LENGTH_MIN, max: verifiedEnv.VITE_PASSWORD_LENGTH_MAX },
    codeLength: verifiedEnv.VITE_CODE_LENGTH,

    nameLengthMax: verifiedEnv.VITE_NAME_LENGTH_MAX,
    bioLengthMax: verifiedEnv.VITE_BIO_LENGTH_MAX,
};