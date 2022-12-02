import { ConfigService } from '@nestjs/config';
import cloneDeep from 'lodash.clonedeep';
import { IConfig } from 'src/config/configuration';
import { UserSession, UserSessionStore } from './datastore.interface';

export class DatastoreService {
  private userSessionStore: UserSessionStore;

  constructor(private configService: ConfigService<IConfig, true>) {
    this.userSessionStore = {};
  }

  getUserSession(id: string): UserSession | null {
    if (!this.userSessionStore[id]) return null;
    return cloneDeep(this.userSessionStore[id].data);
  }

  createUserSession(id: string, userSession: UserSession): void {
    this.userSessionStore[id] = {
      data: userSession,
      created: Date.now(),
    };
  }

  deleteUserSession(id: string): void {
    delete this.userSessionStore[id];
  }

  // TODO: Implement cleanup CronJob
  cleanUpUserSessions(): void {}
}

export default DatastoreService;
