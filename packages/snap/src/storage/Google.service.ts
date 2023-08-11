import {
  CURRENT_STATE_VERSION,
  MULTIPART_BOUNDARY,
} from '@blockchain-lab-um/masca-types';

import StorageService from './Storage.service';

/**
 * Class that handles the google drive api.
 *
 * The functions are made to manipulate files in the google drive appDataFolder.
 *
 * This folder is only accessible by the app that created it.
 */
class GoogleService {
  /**
   * Function that returns the google access token
   * @returns string
   * @throws Error - If token is not found
   */
  static getGoogleSession(): string {
    const state = StorageService.get();
    const session =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.googleSession;
    if (!session) throw new Error('Google session not found');
    return session;
  }

  /**
   * Function that validates the Google access token stored in the state
   * @returns boolean - If token is valid or not
   */
  static async validateStoredGoogleSession(): Promise<boolean> {
    console.log('validate here 1');
    const token = this.getGoogleSession();
    console.log('validate here 2', token);
    try {
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
        {
          method: 'GET',
        }
      );
      const data = await res.json();
      console.log('res validate', data);
      if (data.error_description) throw new Error(data.error_description);

      return true;
    } catch (error) {
      throw new Error(`Failed validating token: ${(error as Error).message}`);
    }
  }

  /**
   * Function that creates a multipart request body
   *
   * @param fileName - name of the file to create
   * @param content - content of the file to create
   * @returns string - multipart request body
   */
  static getMultiPartRequestBody(args: {
    fileName: string;
    content: string;
  }): string {
    const { fileName, content } = args;
    return `--${MULTIPART_BOUNDARY as string}
Content-Type: application/json; charset=UTF-8

{
  "name": "${fileName}",
  "parents": ["appDataFolder"]
}

--${MULTIPART_BOUNDARY as string}
Content-Type: text/plain

${content}

--${MULTIPART_BOUNDARY as string}--`;
  }

  // "--bWFzY2E=
  // Content-Type: application/json; charset=UTF-8

  // {
  //   "name": "masca_backup.txt",
  //   "parents": ["appDataFolder"]
  // }

  // --bWFzY2E=
  // Content-Type: text/plain

  // 1ed68e4669b4fe41e6e151b9d1a952297f446768c5ca765c4cb40d6994dea398945f0ca9604abd2a283055e93d8c81449edb9a9374b8da9db08f781f0cd6d2937283f5682995f89174f6be26d4d23d7d1baaa9d1d3555f4523472313f737ada8ca92e3fb01c4efc8b96ee27edd4fed3712b8536206ca751380fac27a569a4d4907d04f48f5ccb7cf7f2e2c3940236fede1835a2d77664e32f37ab24f49d4f0f2c5c89c48d12048ea505dffbe55e50e8d861aafb79293aec51e4ee4c1a4e08a23ad621c6744b5ed63c2e0639b31a60ec21e32e0b590cbbb70f7355800b81720e4553f9992a3384a94df19a37adadf3792c080c90f37072cac6db71a0b932e21c38061732434a3f99f6f5d51c49c2bd3563e521ee3e359e1c04518dfdfe0c0670d2e77ea4efc782c74ea08d3585b069e65a73c0713cf910a670b979170ced1fc6cebab83ad207bbea4a5c0ab7b8cd6d111467119e830fb1cf8a66a4637aba62c44ee2c19b83ce806a9bad3e286e2420fac425dbd3a88e5a7dec70ea9adaecfe8c312ff2292d9c8d5cf3fa2d00e8a65f1534570625ebdb5adaba5465536e91b21556025d58449735afc1e01b118cfe317fe79e874493209f0967a6d52414aa9c81c893e2a90d840b1dba2ff562fa2d3a311f4b3319cca8bf8bdc9b3471227f1e70b5c171e19768f5884c8cfd6c797d22ed8e3b3d09a90a2ef1fce9617769835d5a17eb40b0c0fa77d562987632fab94df814267162ce0d2eac3f3de071350b9f4bb17db6b13d3bb9bfef54618b89b35f32a97cde058c41f49c7d04eb9379e683a80f1f289e8c60884c847df0fb6d29618efe865348f9d09d39f7f1522ac256bf442797be64032ff7f681ff3a11d7bc00f5fc113b53d993703dc44746ba5ab4fb158ccd4cfb7cebf5103b9e8f7e1b723e7976184930bbc94e4984da9939aed1d7cc237cfa0f2d3bf55140c7aebda19a06dd1e96019610c786ac771d068273a3541a01b87aebc2d893d34d36a9ab7b3f0dbbac0656b492a1fe67dc8fe71520556bab129f259b08a64813a68f4669b71941402ef94c465a94a70e0e85b25f545c6bf9ffd796ba79f6b1b461a4c609edac03e723532d0b6a303158b9f61f3c78ff3cf0d4411eba47bab48b1cff151310a4885e9aafe93e7f667a816ef50c169660aaef2880ed1081d9db77e378c73637cb9373d301657acab43aa76a145c6f8a0ea37cc21de99c12496a0805954ba3aa101f0b63b2cda63e3db2b802a91867043115c16892d67fcc512d18762314df011026d9ff1022b82b73a7f4d8a915826f968785607794e0b0b62ccdbb9b9c76b2ea50d8c59f08b3db198b0abeb04e2665ff49a8b575f02ef77fb4ee9a3389222431e1ade5bdb3ca46510df9cd72502795ed0c8f1cef5acf3105d0959eeffe8e3e94ec765f37b4084fbd380182a9e491272a3bba319433b8a9701cdb19d5cc58db9b6d96ff47e85cbf947099fbb71221e4bc2a17e437ee8ea5bb549fd0689012eefb70cf144c056127321ac477b5faa4cc4c1146bd15f77c5a9187f26895b8dbb045e26cd5f64fcf499a91811714a2db4a907da2553d29c3091c58844d11dfc8e24ece518d67395efc1c812d5c3310e27cf6d50366f53483bcb5e91294a936d6bbc2f310ecae2ffb0e7bdddd1ce0a32184f6e32d88eb239ea6da2cb8c786ae64f61fac10a1126a6de66dd48ac1cb095e1958c72e85b90f7f264d830d1d28029707bb8d56315b55fa7b208bdcf4710a8cd91ee5a1c08aebf67287a9ed5c774cf94610e1aa32bc9fcdf788c6aebe3151fec53af93343f42a4c3a1cab0165791fa2ccf66bad3d9022ad5da429a4840390ecdad0f89d7a3f0aaa8839fa925153a123d4922564d235165d680e171b7578a6decea120863e1919843bbbb0b5cf2ca637b88055311a8c7d273c39312ee8d06bce1a3b1babc09e5e9b4663c67e550bf94bb6019129429904c65c279ca87fa3911da33fd60f04020a8c066a5f31e5e4441e408d8dee690f55eb5cce090eaf4cbf9d2cc6c2879f187560ef2910567a99e2a6a2910382f2a51595c3dce4c1c4d939468aa29323ced5e8530dd35af49070a24ba05cf69a3e66e89f76f65b05350972803003069964b884b374db4c3228ce4d62a7a1d56857ab6a977f991a8ea00ea92b149fda9ee10bb263c6b226d563caa69b6d5247a8736697671104f0d935acdb7c5bbe58ba4746b8834d935d2552a05e892fd093f28c85b80c990ab26f5993523850d6a655e558728a8fca9c0db68c1e6aa9eaa3cfe6bc198cdc51d97aed39b39b85d2d6b131161f0cbb74f0b350b03c634735bf3b02b58f6a30b002dd6d45a7f715f6a021843d2bcd7598fd3d0bf22ca3a2f17a3cded5b89196db94f2e1a6a9e7c57e54161c164e3fd3e116600c951ea50963ebe88b11d282753c149919e3b7c1e56b45b0cbc6017b00a2ecc2789b6e3491d957acc501d1c02a74d60701303a97327c6f77f9569694de10771fba40d6acd5c0d28fa44c0832cecda961711427b426c40ce0e2723f0cae0d30e015c14ab601307ba1203a2a9b94abcbb8a470328bf4e748d2801b4af5c661dc2defe0083d0af170d892decb93f686d4eb373b3a5ecbf976166a9eaa226d86ec0f534d7beab17f22bc0c8fc38ec64b04a709f48c6e80ce4821628aba276fce295dcbc8f77ce8e67c86a6690ecd1d3f8550b1dbdc86e36fad51e8b31e6d2d4c293406a601cca3cb9730847d65d11829bc715fefb48fe0ccb0956c68fade30ad796ac939a23623fef8e4d4259310390ccb54614e9bc488af291abeb7c13ab2d60442dc50cf6a58871f441d2cf1c3ef9865664c78caa05d150ddc8f504b8422d5144a73439148f5f43c91cbe9e8fee15214421de7d636107e9f3ab7e808a5c98b692280866abbf9417cb45d9338446aedaea5f0104d44237d6295d5d998ef0080bb5da09132780cb92d627c905a37a4cf8fb8490022a45214eaf20e8139e8b337b39e0e1cb9a49961a3f65bb41a4925ba046554a5c859d63e0cb8485974544b8d0bb814d1ddc43da9ef1cdb323adb5bbcc295ba77ae28a6b78b620932dcadbe335af343e841a9ea167dc6fe735014f0df5209f08a5f90777961f83a5ac3bc2c6e7fe17b57d796c37b141c8770b51d0e14e91bea73be1197cab8da5bc213f5ea66c82005ca5f3a3d825cfd1157c978f18caa6497cf5f812ae7730d504419732e59eae78dc34d862159c5ecc94b0169162a3b8040cda9e3aeb56d3006a7bd5422bb33b0ab6dd61e9ddf873c0572234f18f8f156b1fdb20434f9a12d2dfba37077c234fa8d3c1fb5d60fcc09dfed3e012549828f70579fe4aea73fc1cdb8ce499eab3ef09a6bb7b717b84cc83b55eecc3810dfc3441598dda5735cb655713f8308e64e2400605fcb83d6e1a4997e2dd93576ad6f5c0ed53c12dc62b1423effbb3eb62cf57b2132f04eefbca98e67e8542510683489b4eb531bce8a8f5a30b87a9cade5517a120d9863ba88d8d428c2cbf2218e7cbb03ab98db32c71b6005a6033883923df45524778f6bde5f7a5215a1695f39fe4f5ac15aec7067126c89e6d8598a4caec9fdcbcbe8d3a6f7dee986548a75d7ba962d145eb92f0d8b610bc3446b831f2a06f121f7d7c93c3f45af254ec00baaa54c2b7e8f9fdd52018a425e1e9a2a2754e40d98c55994763a2826346fe3341280264c60baa442b1e61173fe5ecd2b96c2cf116d2b18593c0b71233bb9af25fb62222acc9afa3e2f6cf7aa621918f86461a11cd51d823a2e928702729b1794e82820552c0de295ac6cc57ae6fe6492196afade8ed040b72377fc33109affb95eaf967c0bf01062a5308c1e463ff49704a1abb791ccae7c491447c9808d98afb2d12b654a1dd6fb5cfe65b41245dedae5e105012dac750e9a5758fdc15c042d9b051578bb7eb9cc2b998784706bb7334e1259c6663e6a5d46c85b3a0a9a0fdef8731d31b71d84fcaeb5076229c2d6a34fe955df4414b6634ef1f74e88926bbf2e4004332ac5a1ab731a1c5da7da1ce6eb75570573a79f22fe4ec146f9f6338dd4a80852e656f848a6cea183288d4cd07d5674de02252d049990bab9d392d794739bc8a2b5d3c908cb0072eff90ca114720b57f8a63f4fdc96faea10e76faeb0b4dba98baefa451fce74572c49a4b06b93a9369aac9af54fd3c9a48d0af46fc2d8c368afe5b1030e0f4d06e1426ab247182b3fa8adc5136f6d64256d844713a4b28ccd9802b80c976eff6515f5c481246859ae15d01114fd0c69d84117061c106f111efa56b71b69ff8026489b7586553c4443350405f403d9cbd5fd143affc8a52ad6be02f9ab8214a6264b3287b2b0702f8b4ed89607325d2653604a9ae465a055f125503a5ad404a5799f7ddd648a76e6b1726f1514b9e7adec5bc017b5d50b89dca87fb1f6f2512ab5b77d9427e3df885e6b88f42f5f5f252c52c0f139c205fc696500afbb2656b87eb1005799215d16667b3a8c00b3fadbc02e0260cb7290fa2babbc4c4dd45df414d9924a21031ee1cca91bfe6c70ae13ffd82168783064f4bc9c4f74216112005b0d2cae7b64f062fb01e206be108e41299239873a488af2fcf6614fd75876df4ad15541f12ecd2dba1e1c456ce6bb14cf0cd369c7678501773d2ff4bfc8b0b3803e44b92df656cfb270c24ba13db2fcf93b4c4f1dcc03d48699eec1f0d90f316773658e006aea5d62bc9f7a9c3541711dc77d77ff67fc9cbe572777bab20fb4d0c3fdfc40cf0367f752d440013265617020fcbf404b6104ac6beb2ecda7bba2cbc5ce9acfa432dc1bbff0b60abda9b5084f737465943b0b1ac71d5bd8efe1599473536cba9d975ddee7ea6b7e3d46d30ad7fbae269c8630842ca10b3682bdb9823eceb77512c3afd81282bdc75d8ef35ef50a4b9486378921ec8ebe79ca64722706b29368c33f52739945c09513fad70c87e37eab756cf74c9d764245565d84c5edb9f79e131f89006afdcf58e8e2e7e35b7e7cc4797f98f847b6f99d1b94287bdf3f584854d791b87a91e2120ea8e3e21b62604fe81a992eb5c65f0730e2b67bd89fa9e9df0f3a2eccbb17a5d8d2c40556d2170e644dbb790df3a304d9c07d226cc4738f79d44275702dc8205ac50a7764ea202f330b646286d01915b567371cf591a9a2021ead36734d7c45df516ba6d25bc9f748ef6286dc65a90368149ff3cdc88a52ff2f9fe1800bff48969b24184f2dd67eb0d013c5f00a371ec79bae375dae21243f70d6280bd04d03df0bad50e2e39fa02ef1f0f40e0853c407348960e4011fadc65de14ee4528ee09f40c0ba31721d07a59f79e75041f9e8f1f3063cee3d15c167dd6a1ba4016f22c89e8ceeee8c5e2d47bdeba353c1698f4692d1aea4206de6e27f8b450ebe5649ba955991841c5bce325be839fad60b5cb90bf0a2ce95c824190aa079f121cd3dee25527d13f6afa4b607d3246ccb41e90a9ce63c4a7da465b81afeb4baf2ade49de26a24d637ac1d77c03a68cef6dfc31d90dcebba9d0ec5f6fc6811fd567a269c3628b0c726356ff62dd80d6092a7d556dd11a043632d1f4d3aec4653ccedef0b54b437f1738958776f00e79e269ab28bfa1f8d287e60e1e30db75d99dbb0f8b52c67ac943d1fe39edf35cadd332012ccabf7fe14ca9503b0bd85d33799b3118d2889cd8fb1ef59c4c1fd90b38cbd84a6adfde5211fb716ccb48f0d64992a7108a7160526923e695c9eb31e2dbdf79ffcf3d9bccc11b4de824be7058666e866734b08f2e6fb7e77b97380d28c9a31ca5b2d6fa9a8bc580edccb752728a6586d11918bb0ae9c1335527d8317b6a39ba3d2230cd945e7cd80fa7f568f000ecf95a6aac1b8694047b9de4c78fe2053f74cf167ab4d6de4b5b12f89d7e99edb3d160fbd54063ac7c327e31e174a11a6aead82ca88c9dd88bee4ed6ba12870b6956f2fa704b57225df581aa44bd31e80733b35eac22127bab1497e0b7d15df5ed3a56a74d63558359ab662cad440b0d6bf5aead569f13143b595412bffbe106bcd9c3d717a21447b5cd22a34bee93d126411c1cd7d551d255b2dac2f0ba1c06a3b09a9bf548bd2cc0b7329bdc51544528ff420fdb0148750cdf4516d0632204fad54ffb60829a8825c22b775cb0eb7994a0a6f0ea0e0a2ec15b683867f7da938743190ef4d6aff909945577b857398b0fcbb7e2097cf4c33fbe8a0dba245d61889a0cd0f6fe5daa5423e3afdf750f625494b547337418c47adde43e725660941cb0bb2ddddaa83d3b3e9e7cbf9fbe1e16099f6c10be:7e3832452df0b28eba887583

  // --bWFzY2E=--"

  /**
   * Function that creates a file in the google drive
   *
   * *__Note:__ This function is used to create a file in the google drive appDataFolder*
   * @param fileName - name of the file to create
   * @param content - content of the file to create
   * @returns string - id of the created file
   */
  static async createFile(args: {
    fileName: string;
    content: string;
  }): Promise<string> {
    const { fileName, content } = args;
    if (!fileName) throw new Error('Missing fileName parameter');
    if (!content) throw new Error('Missing content parameter');
    if (await this.findFile({ fileName })) throw new Error('Duplicate file.');
    const requestBody = this.getMultiPartRequestBody(args);
    const requestParams = {
      method: 'POST',
      mode: 'no-cors' as RequestMode,
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
        'Content-Type': 'multipart/related; boundary=mascabound',
        'Content-Length': `${requestBody.length}`,
      }),
      body: requestBody,
    };
    try {
      console.log('Req params create', requestParams);
      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        requestParams
      ).then((response) => response.json());
      console.log('Res', res);
      if (res.id) return res.id as string;
      throw new Error(res.error.message);
    } catch (error) {
      throw new Error(`Failed creating a file: ${(error as Error).message}`);
    }
  }

  /**
   * Function that searches for a file in the google drive
   *
   * *__Note:__ id param takes precedence over fileName if both are present*
   * @param args.id - id of the file to search
   * @param args.fileName - name of the file to search
   * @returns string - id of the found file
   */
  static async findFile(args: {
    id?: string;
    fileName?: string;
  }): Promise<string> {
    const { id, fileName } = args;
    if (!id && !fileName) throw new Error('Missing id or fileName parameter');
    const requestParams = {
      method: 'GET',
      mode: 'no-cors' as RequestMode,
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
      }),
    };
    try {
      if (id) {
        console.log('find id, params', requestParams);
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}`,
          requestParams
        );
        const data = await res.json();
        if (data.error) return '';
        return data.id as string;
      }
      if (fileName) {
        console.log('find name, params', requestParams);
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name = '${fileName}' and trashed = false and mimeType = 'text/plain'`,
          requestParams
        );
        const data = await res.json();
        if (data.files.length === 0) return '';
        return data.files[0].id as string;
      }
      return '';
    } catch (e) {
      // throw new Error(`Failed searching for file: ${(e as Error).message}`);
      return '';
    }
  }

  /**
   * Function that updates a file content in the google drive
   *
   * *__Note:__ id param takes precedence over fileName if both are present*
   * @param args.id - id of the file to update
   * @param args.fileName - name of the file to update
   * @param args.content - content of the file to update
   * @returns void
   */
  static async updateFile(args: {
    id?: string;
    fileName?: string;
    content: string;
  }): Promise<any> {
    try {
      const { id, fileName, content } = args;
      if (!id && !fileName)
        throw new Error('Missing id or fileName parameter.');
      const file = await this.findFile({
        id,
        fileName,
      });
      const res = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${file}?uploadType=media&fields=id`,
        {
          method: 'PATCH',
          mode: 'no-cors' as RequestMode,
          headers: new Headers({
            Authorization: `Bearer ${this.getGoogleSession()}`,
            'Content-Type': 'text/plain',
            'Content-Length': `${content.length}`,
          }),
          body: content,
        }
      ).then((response) => response.json());
      if (res.error) throw new Error(res.error.message);
    } catch (error) {
      throw new Error(`Failed updating a file: ${(error as Error).message}`);
    }
  }

  /**
   * Function that returns the content of a file in the google drive
   *
   * *__Note:__ id param takes precedence if both are present*
   * @param args.id - id of the file to search
   * @param args.fileName - name of the file to search
   * @returns string - content of the found file
   */
  static async getFileContent(args: {
    id?: string;
    fileName?: string;
  }): Promise<string> {
    const { id, fileName } = args;
    const requestParams = {
      method: 'GET',
      mode: 'no-cors' as RequestMode,
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
      }),
    };
    try {
      if (id) {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
          requestParams
        );
        const data = await res.text();
        return '';
      }
      if (fileName) {
        const file = await this.findFile({ fileName });
        return await this.getFileContent({ id: file });
      }
      throw new Error('Missing id or fileName parameter.');
    } catch (e) {
      throw new Error(`Failed getting file content: ${(e as Error).message}`);
    }
  }

  /**
   * Function that deletes a file in the google drive
   * @param args.id - id of the file to delete
   * @returns boolean - true if the file was deleted
   */
  static async deleteFile(args: { id: string }): Promise<boolean> {
    try {
      const { id } = args;
      if (!id) throw new Error('Missing id parameter.');
      const requestParams = {
        method: 'DELETE',
        mode: 'no-cors' as RequestMode,
        headers: new Headers({
          Authorization: `Bearer ${this.getGoogleSession()}`,
        }),
      };
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${id}`,
        requestParams
      );
      if (!res.body) return true;
      const data = await res.json();
      throw new Error(data.error.message);
    } catch (error) {
      throw new Error(`Failed deleting file: ${(error as Error).message}`);
    }
  }
}

export default GoogleService;
