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

export interface FilterArgs {
  filter?: {
    type: string;
    filter: unknown;
  };
}

export interface QueryRes {
  data: any;
  metadata: {
    id: string;
  };
}

export abstract class AbstractDataStore {
  abstract save(args: SaveArgs): Promise<string>;
  abstract delete(args: DeleteArgs): Promise<boolean>;
  abstract query(args: FilterArgs): Promise<Array<QueryRes>>;
  abstract clear(args: FilterArgs): Promise<boolean>;
}
