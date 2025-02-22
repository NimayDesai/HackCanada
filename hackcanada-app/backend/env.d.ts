declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      GEMINI_API: string;
    }
  }
}

export {}
