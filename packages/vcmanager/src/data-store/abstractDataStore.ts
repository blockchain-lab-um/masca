/**
 * An abstract class for the {@link VCManager} VC store
 * @public
 */

export interface SaveArgs {
  data: any;
  options?: any;
}

export interface DeleteArgs {
  id: string;
}

export interface QueryArgs {
  filter?: {
    type: string;
    filter: unknown;
  };
}

export interface QueryRes {
  data: any;
  id: string;
}

export abstract class AbstractDataStore {
  abstract save(args: SaveArgs): Promise<string>;
  abstract delete(args: DeleteArgs): Promise<boolean>;
  abstract query(args: QueryArgs): Promise<Array<QueryRes>>;
  abstract clear(args: QueryArgs): Promise<boolean>;
}
