declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    MONGO_URI: string;
    GEMINI_API_KEY: string;
    GOOGLE_CLIENT_ID: string;
  }
}
