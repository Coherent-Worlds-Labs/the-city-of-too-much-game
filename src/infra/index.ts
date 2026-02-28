export interface RuntimeConfig {
  nodeEnv: string;
  appPort: number;
}

export const readRuntimeConfig = (): RuntimeConfig => ({
  nodeEnv: process.env.NODE_ENV ?? "development",
  appPort: Number.parseInt(process.env.APP_PORT ?? "3000", 10)
});
