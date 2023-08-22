---
sidebar_position: 4
---

# DataManager (Veramo)

### Introduction

Veramo does not provide similar support for managing VCs as it does for DIDs and KeyPairs. **Veramo Data Manager** is a custom plugin for managing arbitrary data with the Veramo client. It works very similarly to [ `DIDManager` ](https://github.com/uport-project/veramo/tree/next/packages/did-manager) and other Manager plugins built for Veramo. The data stored using this plugin is managed by sub-plugins.

![VCManager design](https://user-images.githubusercontent.com/69682837/201887288-e666d565-fc2c-4160-ac85-a98e790eeced.png)

Learn more about [DataManager](https://github.com/uport-project/veramo/issues/1058).

DataManager has an `AbstractDataStore` , a template for plugins that manage the data! Below is the code of ` AbstractDataStore` .

```typescript
export interface ISaveArgs {
  data: unknown;
  options?: unknown;
}

export interface IDeleteArgs {
  id: string;
}

export interface IFilterArgs {
  filter?: {
    type: string;
    filter: unknown;
  };
}

export interface IQueryResult {
  data: unknown;
  metadata: {
    id: string;
  };
}

export abstract class AbstractDataStore {
  abstract save(args: ISaveArgs): Promise<string>;
  abstract delete(args: IDeleteArgs): Promise<boolean>;
  abstract query(args: IFilterArgs): Promise<Array<IQueryResult>>;
  abstract clear(args: IFilterArgs): Promise<boolean>;
}
```

This abstract class enables the [ `SnapCredentialStore` ](../masca/architecture.md) plugin, which stores the array of VCs in MetaMask State, and `CeramicCredentialStore` , which stores VCs on Ceramic Network.

### How to use

#### Veramo Agent Setup

Add the plugin to the Veramo agent setup.

```typescript
  const vcStorePlugins: Record<string, AbstractCredentialStore> = {};
  vcStorePlugins['snap'] = new SnapCredentialStore();
  vcStorePlugins['ceramic'] = new CeramicCredentialStore();
  vcStorePlugins['memory'] = new MemoryDataStore();
  export const agent = createAgent<
      ...
      IDataManager &
      ...
  >({
    plugins: [
      ...
      new DataManager({ store: vcStorePlugins }),
      ...
    ],
  });
```

Use the plugin

```typescript
await agent.save({ data: vc, options: { store: 'ceramic' } });

const res = await agent.query({});

const delRes = await agent.delete({
  id: '123',
  options: { store: ['ceramic', 'snap'] },
});
```

#### DataManager Types

```typescript
export interface IDataManager extends IPluginMethodMap {
  query(args: IDataManagerQueryArgs): Promise<Array<IDataManagerQueryResult>>;

  save(args: IDataManagerSaveArgs): Promise<Array<IDataManagerSaveResult>>;

  delete(args: IDataManagerDeleteArgs): Promise<Array<boolean>>;

  clear(args: IDataManagerClearArgs): Promise<Array<boolean>>;
}

/**
 *  Types
 */
export type Filter = {
  type: string;
  filter: unknown;
};

type QueryOptions = {
  store?: string | string[];
  returnStore?: boolean;
};

type DeleteOptions = {
  store: string | string[];
};

type SaveOptions = {
  store: string | string[];
};

type ClearOptions = {
  store: string | string[];
};

type QueryMetadata = {
  id: string;
  store?: string;
};

/**
 *  Interfaces for DataManager method arguments
 */
export interface IDataManagerQueryArgs {
  filter?: Filter;
  options?: QueryOptions;
}

export interface IDataManagerDeleteArgs {
  id: string;
  options?: DeleteOptions;
}

export interface IDataManagerSaveArgs {
  data: unknown;
  options: SaveOptions;
}

export interface IDataManagerClearArgs {
  filter?: Filter;
  options?: ClearOptions;
}

/**
 * Interfaces for DataManager method return values
 */
export interface IDataManagerQueryResult {
  data: unknown;
  metadata: QueryMetadata;
}

export interface IDataManagerSaveResult {
  id: string;
  store: string;
}
```

**[GitHub](https://github.com/blockchain-lab-um/masca/tree/master/packages/datamanager) |
[npm](https://www.npmjs.com/package/@blockchain-lab-um/veramo-datamanager)**
