import { SupportedCredential } from '@blockchain-lab-um/oidc-types';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import {
  ISSUER_URL,
  SUPPORTED_CREDENTIALS,
  SUPPORTED_CURVES,
  SUPPORTED_DID_METHODS,
  SUPPORTED_DIGITAL_SIGNATURES,
} from '../../config.js';

export interface IConfig {
  INFURA_PROJECT_ID: string;
  ISSUER_PRIVATE_KEY: string;
  SUPPORTED_DID_METHODS: string[]; // e.g. ['ethr', 'key']
  SUPPORTED_CURVES: string[]; // e.g. secp256k1, ed25519, etc
  SUPPORTED_DIGITAL_SIGNATURES: string[]; // jwt, json_ld
  ISSUER_DB_SECRET: string;
  ISSUER_URL: string;
}

const config = (): IConfig => ({
  // We are reading the important secrets from the .env file
  ISSUER_DB_SECRET: process.env.ISSUER_DB_SECRET || '',
  INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID || '',
  ISSUER_PRIVATE_KEY: process.env.ISSUER_PRIVATE_KEY || '',

  // We are reading the other configuration from the config.ts file
  SUPPORTED_DID_METHODS: SUPPORTED_DID_METHODS || [],
  SUPPORTED_CURVES: SUPPORTED_CURVES || [],
  SUPPORTED_DIGITAL_SIGNATURES: SUPPORTED_DIGITAL_SIGNATURES || [],
  ISSUER_URL: ISSUER_URL || '',
});

export default ConfigModule.forRoot({
  envFilePath: [`.env.${process.env.NODE_ENV}`],
  load: [config],
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    ISSUER_DB_SECRET: Joi.string().required(),
    INFURA_PROJECT_ID: Joi.string().required(),
    ISSUER_PRIVATE_KEY: Joi.string().required(),
  }),
  // TODO: Add custom validation for other variables ?
});

export const loadSupportedCredentials = (): SupportedCredential[] =>
  SUPPORTED_CREDENTIALS;
