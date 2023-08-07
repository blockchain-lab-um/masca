export interface ISaveArgs {
  data: unknown;
  options?: unknown;
}

export interface IDeleteArgs {
  id: string;
}

export interface IFilterArgs {
  filter?: {
    type: 'none' | 'id' | 'JSONPath';
    filter: string;
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
  abstract query(args: IFilterArgs): Promise<IQueryResult[]>;
  abstract clear(args: IFilterArgs): Promise<boolean>;
}
