import { PresentationDefinition } from '@blockchain-lab-um/oidc-types';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import {
  PRESENTATION_DEFINITIONS,
  SUPPORTED_CURVES,
  SUPPORTED_DID_METHODS,
  SUPPORTED_DIGITAL_SIGNATURES,
} from '../../config.js';

export interface IConfig {
  INFURA_PROJECT_ID: string;
  VERIFIER_URL: string;
  VERIFIER_PRIVATE_KEY: string;
  VERIFIER_DB_SECRET: string;
  SUPPORTED_DID_METHODS: string[]; // e.g. ['ethr', 'key']
  SUPPORTED_CURVES: string[]; // e.g. secp256k1, ed25519, etc
  SUPPORTED_DIGITAL_SIGNATURES: string[]; // jwt, json_ld
  PRESENTATION_DEFINITIONS: PresentationDefinition[];
}

const config = (): IConfig => ({
  INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID || '',
  VERIFIER_PRIVATE_KEY: process.env.VERIFIER_PRIVATE_KEY || '',
  VERIFIER_DB_SECRET: process.env.VERIFIER_DB_SECRET || '',
  VERIFIER_URL: process.env.VERIFIER_URL || '',

  SUPPORTED_DID_METHODS: SUPPORTED_DID_METHODS || [],
  SUPPORTED_CURVES: SUPPORTED_CURVES || [],
  SUPPORTED_DIGITAL_SIGNATURES: SUPPORTED_DIGITAL_SIGNATURES || [],
  PRESENTATION_DEFINITIONS: PRESENTATION_DEFINITIONS || [],
});

export default ConfigModule.forRoot({
  envFilePath: ['.env.test', '.env'],
  load: [config],
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    INFURA_PROJECT_ID: Joi.string().required(),
    VERIFIER_PRIVATE_KEY: Joi.string().required(),
    VERIFIER_DB_SECRET: Joi.string().required(),
    // TODO: Add custom validation for other variables ?
  }),
});
