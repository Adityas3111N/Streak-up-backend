import { z } from "zod";

const envSchema = z.object({

    //required variables
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    ACCESS_TOKEN_SECRET: z.string().min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters"),
    REFRESH_TOKEN_SECRET: z.string().min(32, "REFRESH_TOKEN_SECRET must be at least 32 characters"),
    GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),

    //optional variables with defaults
    PORT: z.string().optional().default("8000"),
    CORS_ORIGIN: z.string().optional(),
    ACCESS_TOKEN_EXPIRY: z.string().optional().default("15m"),
    REFRESH_TOKEN_EXPIRY: z.string().optional().default("15d"),

    //cloudinary (optional - used for file upload)
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_CLOUD_KEY: z.string().optional(),
    CLOUDINARY_CLOUD_SECRET: z.string().optional(),

    //google oauth - callback url for android
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CALLBACK_URL: z.string().optional(),

});

const parseEnv = () => {
    try {
        const env = envSchema.parse({
            MONGODB_URI: process.env.MONGODB_URI,
            ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
            REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            PORT: process.env.PORT,
            CORS_ORIGIN: process.env.CORS_ORIGIN,
            ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
            REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_CLOUD_KEY: process.env.CLOUDINARY_CLOUD_KEY,
            CLOUDINARY_CLOUD_SECRET: process.env.CLOUDINARY_CLOUD_SECRET,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        });

        return env;

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            const missingVars = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`)

            console.error("Environment validation failed");
            console.error(missingVars.join("\n"));
            process.exit(1);
        };

        throw error;
    }
}

//export validated environment variables
export const env = parseEnv()

//extract env variables from env returned by parseenv. and export the env variables which can be later imported anywhere from here.
export const { MONGODB_URI,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    GOOGLE_CLIENT_ID,
    PORT,
    CORS_ORIGIN,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_CLOUD_KEY,
    CLOUDINARY_CLOUD_SECRET,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL
} = env;
