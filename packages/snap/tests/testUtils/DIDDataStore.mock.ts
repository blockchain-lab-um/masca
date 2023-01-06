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
