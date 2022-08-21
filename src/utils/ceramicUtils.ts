import { CeramicClient } from '@ceramicnetwork/http-client';
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { DIDSession } from '@glazed/did-session';
import { getCurrentAccount } from './snapUtils';
//import { ModelManager } from '@glazed/devtools';

//import { Definition } from '@glazed/did-datastore-model';

const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');

export const aliases = {
  definitions: {
    StoredCredentials:
      'kjzl6cwe1jw148ulgnabbg1vfx1slceuknt57y3gevnf35wgf4e6b15ypqj9ozv',
  },
  schemas: {
    StoredCredentials:
      'ceramic://k3y52l7qbv1frxk5wjk8vyexuuev6og9eb7bgrh5xtlepuumjtz7fjf1kuzgmpx4w',
  },
  tiles: {},
};

export async function authenticateWithEthereum() {
  const account = await getCurrentAccount();
  const authProvider = new EthereumAuthProvider(wallet, account);

  const session = new DIDSession({ authProvider });
  console.log('Session2:', session);
  typeof window;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  window.location = {} as any;
  window.location.hostname = 'ssi-snap';
  console.log('window: ', window);
  window.location.hostname = 'ssi-snap';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const did = await session.authorize({ domain: 'ssi-snap' });
  console.log('DID:', did);
  await ceramic.setDID(did);

  return ceramic;
}

export async function bootstrap() {
  try {
    await authenticateWithEthereum();

    // const manager = new ModelManager({ ceramic });

    // const sh = await manager.createSchema(
    //   "StoredCredentials",
    //   storedCredential
    // );

    // const schemaUrl = manager.getSchemaURL(sh);

    // const def = {
    //   name: "storedCredential",
    //   description: "storedCredential",
    //   schema: schemaUrl,
    // } as Definition;

    // await manager.createDefinition("StoredCredentials", def);

    // const modelAliases = await manager.deploy();
    // console.log(modelAliases);

    console.log('authenticated');
  } catch (error) {
    console.error(error);
  }
}
