import { AvailableVCStores } from '@blockchain-lab-um/masca-types';
import {
  SendOIDCAuthorizationResponseArgs,
  SignArgs,
} from '@blockchain-lab-um/oidc-client-plugin';
import { PresentationDefinition } from '@blockchain-lab-um/oidc-types';
import { isError } from '@blockchain-lab-um/utils';
import { UnsignedPresentation, W3CVerifiableCredential } from '@veramo/core';
import { decodeCredentialToObject } from '@veramo/utils';
import * as qs from 'qs';

import VeramoService from '../veramo/Veramo.service';

type HandleAuthorizationRequestParams = {
  authorizationRequestURI: string;
  did: string;
  customSign: (args: SignArgs) => Promise<string>;
  credentials?: W3CVerifiableCredential[];
};

type HandleAuthorizationRequestResult = {
  isUserInteractionRequired: boolean;
} & (
  | {
      isUserInteractionRequired: true;
      credentials: W3CVerifiableCredential[];
      presentationDefinition: PresentationDefinition;
    }
  | {
      isUserInteractionRequired: false;
      sendOIDCAuthorizationResponseArgs: SendOIDCAuthorizationResponseArgs;
    }
);

// TODO: In case of vp_token user needs to select credentials
export const handleAuthorizationRequest = async ({
  authorizationRequestURI,
  did,
  customSign,
  credentials,
}: HandleAuthorizationRequestParams): Promise<HandleAuthorizationRequestResult> => {
  const agent = VeramoService.getAgent();
  const authorizationRequestResult =
    await agent.parseOIDCAuthorizationRequestURI({
      authorizationRequestURI,
    });

  if (isError(authorizationRequestResult)) {
    throw new Error(authorizationRequestResult.error);
  }

  const authorizationRequest = authorizationRequestResult.data;
  const sendOIDCAuthorizationResponseArgs: SendOIDCAuthorizationResponseArgs =
    {};

  if (authorizationRequest.response_type.includes('vp_token')) {
    if (!authorizationRequest.presentation_definition) {
      throw new Error('presentation_definition is required');
    }

    // if(!credentials) {
    const store = ['snap'] as AvailableVCStores[];

    const queryResults = await VeramoService.queryCredentials({
      options: { store, returnStore: false },
    });

    const queriedCredentials: any = queryResults.map((result) => result.data);

    console.log('queriedCredentials');
    console.log(queriedCredentials);

    const selectCredentialsResult = await agent.selectCredentials({
      credentials: queriedCredentials,
    });

    console.log('selectCredentialsResult');
    console.log(selectCredentialsResult);

    if (isError(selectCredentialsResult)) {
      throw new Error(selectCredentialsResult.error);
    }

    //   return {
    //     isUserInteractionRequired: true,
    //     credentials: selectCredentialsResult.data,
    //     presentationDefinition: authorizationRequest.presentation_definition,
    //   }
    // }

    // const selectCredentialsResult = await agent.selectCredentials({
    //   credentials: credentials as any,
    // });

    // if (isError(selectCredentialsResult)) {
    //   throw new Error(selectCredentialsResult.error);
    // }

    const createPresentationSubmissionResult =
      await agent.createPresentationSubmission({
        credentials: selectCredentialsResult.data,
      });

    if (isError(createPresentationSubmissionResult)) {
      throw new Error(createPresentationSubmissionResult.error);
    }

    const presentationSubmission = createPresentationSubmissionResult.data;

    const decodedCredentials = selectCredentialsResult.data.map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (credential) => decodeCredentialToObject(credential).proof.jwt
    );

    const veramoPresentation = await agent.createVerifiablePresentation({
      presentation: {
        holder: did,
        verifiableCredential: decodedCredentials,
      },
      proofFormat: 'jwt',
    });

    const { '@context': context, holder, type } = veramoPresentation;

    const vp: UnsignedPresentation = {
      '@context': context,
      holder,
      type,
      verifiableCredential: decodedCredentials,
    };

    const createVpTokenResult = await agent.createVpToken({
      sign: customSign,
      vp,
    });

    if (isError(createVpTokenResult)) {
      throw new Error(createVpTokenResult.error);
    }

    const vpToken = createVpTokenResult.data;

    sendOIDCAuthorizationResponseArgs.presentationSubmission =
      presentationSubmission;
    sendOIDCAuthorizationResponseArgs.vpToken = vpToken;
  }

  if (authorizationRequest.response_type.includes('id_token')) {
    // Create id token
    const idTokenResult = await agent.createIdToken({
      sign: customSign,
    });

    if (isError(idTokenResult)) {
      throw new Error(idTokenResult.error);
    }

    const idToken = idTokenResult.data;

    sendOIDCAuthorizationResponseArgs.idToken = idToken;
  }

  return {
    isUserInteractionRequired: false,
    sendOIDCAuthorizationResponseArgs,
  };
};

type SendAuthorizationResponseParams = {
  sendOIDCAuthorizationResponseArgs: SendOIDCAuthorizationResponseArgs;
};

type SendAuthorizationResponseResult = {
  code: string;
  state: string;
};

export const sendAuthorizationResponse = async ({
  sendOIDCAuthorizationResponseArgs,
}: SendAuthorizationResponseParams): Promise<SendAuthorizationResponseResult> => {
  const agent = VeramoService.getAgent();

  // POST /auth-mock/direct_post
  const authorizationResponseResult = await agent.sendOIDCAuthorizationResponse(
    sendOIDCAuthorizationResponseArgs
  );

  if (isError(authorizationResponseResult)) {
    throw new Error(authorizationResponseResult.error);
  }

  const authorizationResponse = authorizationResponseResult.data;

  const authorizationResponseData: any = qs.parse(
    authorizationResponse.split('?')[1]
  );

  if (!authorizationResponseData.code) {
    throw new Error('Authorization code is required');
  }

  if (!authorizationResponseData.state) {
    throw new Error('State is required');
  }

  return {
    code: authorizationResponseData.code as string,
    state: authorizationResponseData.state as string,
  };
};
