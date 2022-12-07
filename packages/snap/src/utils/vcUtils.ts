// /* eslint-disable @typescript-eslint/restrict-template-expressions */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import {
//   W3CVerifiableCredential,
//   VerifiableCredential,
//   IssuerType,
// } from '@veramo/core';
// import {
//   ValidateNested,
//   IsString,
//   validateOrReject,
//   IsDefined,
//   IsNotEmpty,
//   IsNotEmptyObject,
//   validate,
//   ValidateIf,
// } from 'class-validator';
// import { ClassConstructor, plainToClass } from 'class-transformer';
// import { type } from 'os';

// export class Proof {
//   @IsString()
//   type?: string;

//   [x: string]: any;
// }

// export class CredentialStatus {
//   @IsDefined()
//   @IsNotEmpty()
//   @IsString()
//   id: string;

//   @IsNotEmpty()
//   @IsString()
//   type: string;
//   [x: string]: any;
// }

// export class CredentialSubject {
//   @IsString()
//   id?: string;
//   [x: string]: any;
// }

// export class Issuer {
//   @IsDefined()
//   @IsNotEmpty()
//   @IsString()
//   id: string;
//   [x: string]: any;
// }

// export class W3CVerifiableCredentialDTO implements VerifiableCredential {
//   @IsDefined()
//   @ValidateIf((o) => typeof o.issuer === 'string')
//   @ValidateNested()
//   issuer: Issuer | string;

//   @IsDefined()
//   @IsNotEmpty()
//   @ValidateNested()
//   credentialSubject: CredentialSubject;

//   @IsString({ each: true })
//   type?: string[] | string;

//   @IsDefined()
//   @IsNotEmpty()
//   @IsString({ each: true })
//   '@context': string[] | string;

//   @IsDefined()
//   @IsNotEmpty()
//   @IsString()
//   issuanceDate: string;

//   @IsString()
//   expirationDate?: string;

//   @ValidateNested()
//   credentialStatus?: CredentialStatus;

//   @IsString()
//   id?: string;

//   @IsDefined()
//   @IsNotEmpty()
//   @ValidateNested()
//   proof: Proof;

//   [x: string]: any;
// }

// export const validateVC = async <T extends ClassConstructor<any>>(
//   obj: any,
//   dto = W3CVerifiableCredentialDTO
// ) => {
//   // tranform the literal object to class object
//   const objInstance = plainToClass(dto, obj);
//   // validating and check the errors, throw the errors if exist
//   const errors = await validate(objInstance, { skipMissingProperties: true });
//   // errors is an array of validation errors
//   if (errors.length > 0) {
//     throw new TypeError(
//       `validation failed. The error fields : ${errors.map(
//         ({ property }) => property
//       )}`
//     );
//   }
//   return true;
// };
