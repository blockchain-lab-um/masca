// import { StoredCredentials } from './../../../interfaces';
// import { v4 as uuidv4 } from 'uuid';
// import { VerifiableCredential } from '@veramo/core';
// import { aliases, getCeramic } from '../../../utils/ceramicUtils';
// import { DIDDataStore } from '@glazed/did-datastore';
// import { SnapProvider } from '@metamask/snap-types';
// import { AbstractVCStore } from '@blockchain-lab-um/veramo-vc-manager';
// export class CeramicVCStore extends AbstractVCStore {
//   wallet: SnapProvider;
//   constructor(walletParam: SnapProvider) {
//     super();
//     this.wallet = walletParam;
//   }

//   async get(args: { id: string }): Promise<VerifiableCredential | null> {
//     const ceramic = await getCeramic(this.wallet);
//     const datastore = new DIDDataStore({ ceramic, model: aliases });
//     const storedCredentials = (await datastore.get(
//       'StoredCredentials'
//     )) as StoredCredentials;
//     if (storedCredentials.storedCredentials) {
//       const verifiableCredential = storedCredentials.storedCredentials.find(
//         (vc) => vc.key === args.id
//       );
//       if (verifiableCredential)
//         return verifiableCredential as VerifiableCredential;
//     }
//     return null;
//   }

//   // eslint-disable-next-line @typescript-eslint/require-await
//   async delete(args: { id: string }): Promise<boolean> {
//     const ceramic = await getCeramic(this.wallet);
//     const datastore = new DIDDataStore({ ceramic, model: aliases });
//     const ceramicData = (await datastore.get(
//       'StoredCredentials'
//     )) as StoredCredentials;
//     if (ceramicData.storedCredentials) {
//       let found = false;
//       ceramicData.storedCredentials = ceramicData.storedCredentials.filter(
//         (vc) => {
//           if (vc.key !== args.id) return vc;
//           else found = true;
//         }
//       );
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       await datastore.merge('StoredCredentials', ceramicData);
//       return found;
//     }
//     return false;
//   }

//   async import(args: VerifiableCredential) {
//     const alias = uuidv4();
//     const vc = { ...args, key: alias };

//     const ceramic = await getCeramic(this.wallet);
//     const datastore = new DIDDataStore({ ceramic, model: aliases });
//     const storedCredentials = (await datastore.get(
//       'StoredCredentials'
//     )) as StoredCredentials;
//     if (storedCredentials && storedCredentials.storedCredentials) {
//       storedCredentials.storedCredentials.push(vc);
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       await datastore.merge('StoredCredentials', storedCredentials);
//     } else {
//       const storedCredentialsNew = { storedCredentials: [vc] };
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       await datastore.merge('StoredCredentials', storedCredentialsNew);
//     }

//     return true;
//   }

//   async list(): Promise<VerifiableCredential[]> {
//     const ceramic = await getCeramic(this.wallet);
//     const datastore = new DIDDataStore({ ceramic, model: aliases });
//     const storedCredentials = (await datastore.get(
//       'StoredCredentials'
//     )) as StoredCredentials;

//     if (storedCredentials && storedCredentials.storedCredentials)
//       return storedCredentials.storedCredentials as VerifiableCredential[];
//     return [];
//   }
// }

// export async function clear(wallet: SnapProvider): Promise<boolean> {
//   const ceramic = await getCeramic(wallet);
//   const datastore = new DIDDataStore({ ceramic, model: aliases });
//   const storedCredentialsNew = { storedCredentials: [] };
//   await datastore.merge('StoredCredentials', storedCredentialsNew);
//   return true;
// }
