import { SupportedCredential } from '@blockchain-lab-um/oidc-types';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { supported_credentials } from '../../supported_credentials.json';

export interface IConfig {
  INFURA_PROJECT_ID: string;
  ISSUER_PRIVATE_KEY: string;
  SUPPORTED_SCHEMA_URL: string;
  SUPPORTED_DID_METHODS: string[]; // e.g. ['ethr', 'key']
  SUPPORTED_CURVES: string[]; // e.g. secp256k1, ed25519, etc
  SUPPORTED_DIGITAL_SIGNATURES: string[]; // jwt, json_ld
  ISSUER_DB_SECRET: string;
  ISSUER_URL: string;
}

const config = (): IConfig => ({
  ISSUER_DB_SECRET: process.env.ISSUER_DB_SECRET || '',
  INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID || '',
  ISSUER_PRIVATE_KEY: process.env.ISSUER_PRIVATE_KEY || '',
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
  ISSUER_URL: process.env.ISSUER_URL || '',
});

export default ConfigModule.forRoot({
  envFilePath: ['.env'],
  load: [config],
  validationSchema: Joi.object({
    ISSUER_DB_SECRET: Joi.string().required(),
    INFURA_PROJECT_ID: Joi.string().required(),
    ISSUER_PRIVATE_KEY: Joi.string().required(),
    SUPPORTED_SCHEMA_URL: Joi.string().required(),
    SUPPORTED_DID_METHODS: Joi.string().required(),
    SUPPORTED_CURVES: Joi.string().required(),
    SUPPORTED_DIGITAL_SIGNATURES: Joi.string().required(), // TODO: Better check for this
  }),
});

export const loadSupportedCredentials = (): SupportedCredential[] =>
  supported_credentials as SupportedCredential[];
