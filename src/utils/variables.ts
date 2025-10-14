const { env } = process as { env: { [key: string]: string } };

export const MONGO_URI = env.MONGO_URI;
export const MAILTRAP_USER = env.MAILTRAP_USER;
export const MAILTRAP_PASS = env.MAILTRAP_PASS;
export const VERIFICATION_EMAIL = env.VERIFICATION_EMAIL;
export const PASSWORD_RESET_LINK = env.PASSWORD_RESET_LINK;
export const SIGN_IN_URL = env.SIGN_IN_URL;
export const JWT_SECRET = env.JWT_SECRET;
export const CLOUD_NAME = env.CLOUD_NAME;
export const CLOUD_KEY = env.CLOUD_KEY;
export const CLOUD_SECRET = env.CLOUD_SECRET;
export const MAILTRAP_TOKEN = env.MAILTRAP_TOKEN;
export const AUTH_EMAIL = env.AUTH_EMAIL;
