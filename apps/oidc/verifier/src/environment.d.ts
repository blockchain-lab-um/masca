export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      INFURA_PROJECT_ID: string;
      VERIFIER_DID: string;
      VERIFIER_PRIV_KEY: string;
      VERIFIER_PUB_KEY: string;
      SUPPORTED_SCHEMA_URL: string;
      SUPPORTED_DID_METHODS: string;
      SUPPORTED_CURVES: string;
      SUPPORTED_DIGITAL_SIGNATURES: string;
      VERIFIER_DB_SECRET: string;
    }
  }
}
