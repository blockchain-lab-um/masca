import { VerifiableCredential } from '@veramo/core';
import typia from 'typia';
// Import a type and generate a type check function
export const checkVCType = (input: any): input is VerifiableCredential => {
    const $join = (typia.createIs as any).join;
    const $io0 = (input: any): boolean => null !== input.issuer && undefined !== input.issuer && ("string" === typeof input.issuer || "object" === typeof input.issuer && null !== input.issuer && $io1(input.issuer)) && ("object" === typeof input.credentialSubject && null !== input.credentialSubject && false === Array.isArray(input.credentialSubject) && $io2(input.credentialSubject)) && (null !== input.type && (undefined === input.type || "string" === typeof input.type || Array.isArray(input.type) && input.type.every((elem: any) => "string" === typeof elem))) && (null !== input["@context"] && undefined !== input["@context"] && ("string" === typeof input["@context"] || (Array.isArray(input["@context"]) && input["@context"].every((elem: any) => null !== elem && undefined !== elem && ("string" === typeof elem || "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io3(elem))) || "object" === typeof input["@context"] && null !== input["@context"] && false === Array.isArray(input["@context"]) && $io3(input["@context"])))) && "string" === typeof input.issuanceDate && (undefined === input.expirationDate || "string" === typeof input.expirationDate) && (undefined === input.credentialStatus || "object" === typeof input.credentialStatus && null !== input.credentialStatus && $io4(input.credentialStatus)) && (undefined === input.id || "string" === typeof input.id) && ("object" === typeof input.proof && null !== input.proof && false === Array.isArray(input.proof) && $io5(input.proof)) && Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (RegExp(/(.*)/).test(key))
            return true;
        return true;
    });
    const $io1 = (input: any): boolean => "string" === typeof input.id && Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (RegExp(/(.*)/).test(key))
            return true;
        return true;
    });
    const $io2 = (input: any): boolean => (undefined === input.id || "string" === typeof input.id) && Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (RegExp(/(.*)/).test(key))
            return true;
        return true;
    });
    const $io3 = (input: any): boolean => Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (RegExp(/(.*)/).test(key))
            return true;
        return true;
    });
    const $io4 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.type && Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (RegExp(/(.*)/).test(key))
            return true;
        return true;
    });
    const $io5 = (input: any): boolean => (undefined === input.type || "string" === typeof input.type) && Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (RegExp(/(.*)/).test(key))
            return true;
        return true;
    });
    return "object" === typeof input && null !== input && $io0(input);
};
