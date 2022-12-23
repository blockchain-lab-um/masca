import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

export interface IConfig {
  INFURA_PROJECT_ID: string;
  VERIFIER_URL: string;
  VERIFIER_PRIVATE_KEY: string;
  VERIFIER_DB_SECRET: string;
  SUPPORTED_SCHEMA_URL: string;
  SUPPORTED_DID_METHODS: string[]; // e.g. ['ethr', 'key']
  SUPPORTED_CURVES: string[]; // e.g. secp256k1, ed25519, etc
  SUPPORTED_DIGITAL_SIGNATURES: string[]; // jwt, json_ld
}

const config = (): IConfig => ({
  INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID || '',
  VERIFIER_URL: process.env.VERIFIER_URL || '',
  VERIFIER_PRIVATE_KEY: process.env.VERIFIER_PRIVATE_KEY || '',
  VERIFIER_DB_SECRET: process.env.VERIFIER_DB_SECRET || '',
  SUPPORTED_SCHEMA_URL: process.env.SUPPORTED_SCHEMA_URL || '',
  SUPPORTED_DID_METHODS: process.env.SUPPORTED_DID_METHODS
    ? process.env.SUPPORTED_DID_METHODS.split(',')
    : [],
  SUPPORTED_CURVES: process.env.SUPPORTED_CURVES
    ? process.env.SUPPORTED_CURVES.split(',')
    : [],
  SUPPORTED_DIGITAL_SIGNATURES: process.env.SUPPORTED_DIGITAL_SIGNATURES
    ? process.env.SUPPORTED_DIGITAL_SIGNATURES.split(',')
    : [],
});

export default ConfigModule.forRoot({
  envFilePath: ['.env'],
  load: [config],
  validationSchema: Joi.object({
    INFURA_PROJECT_ID: Joi.string().required(),
    VERIFIER_URL: Joi.string().required(),
    VERIFIER_PRIVATE_KEY: Joi.string().required(),
    VERIFIER_DB_SECRET: Joi.string().required(),
    SUPPORTED_SCHEMA_URL: Joi.string().required(),
    SUPPORTED_DID_METHODS: Joi.string().required(),
    SUPPORTED_CURVES: Joi.string().required(),
    SUPPORTED_DIGITAL_SIGNATURES: Joi.string().required(), // TODO: Better check for this
  }),
});
