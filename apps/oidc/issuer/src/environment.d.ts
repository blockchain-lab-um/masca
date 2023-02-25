export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      INFURA_PROJECT_ID: string;
      ISSUER_PRIVATE_KEY: string;
      SUPPORTED_SCHEMA_URL: string;
      SUPPORTED_DID_METHODS: string;
      SUPPORTED_CURVES: string;
      SUPPORTED_DIGITAL_SIGNATURES: string;
      ISSUER_DB_SECRET: string;
      ISSUER_URL: string;
    }
  }
}
