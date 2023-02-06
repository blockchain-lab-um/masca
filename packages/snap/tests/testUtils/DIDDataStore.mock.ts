/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class DIDDataStore {
  private state: any = {};

  constructor(args: any) {
    this.state = {};
  }

  public get(name: string): any {
    return this.state;
  }

  public merge(name: string, data: unknown): any {
    this.state = data;
  }
}
