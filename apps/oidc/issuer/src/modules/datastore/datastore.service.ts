import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { IConfig } from '../../config/configuration.js';
import { UserSession, UserSessionStore } from './datastore.interface.js';

export class DatastoreService {
  private userSessionStore: UserSessionStore;

  constructor(private configService: ConfigService<IConfig, true>) {
    this.userSessionStore = {};
  }

  getUserSession(id: string): UserSession | null {
    if (!this.userSessionStore[id]) return null;
    return structuredClone(this.userSessionStore[id].data);
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

  @Cron(CronExpression.EVERY_HOUR)
  cleanUpUserSessions(): void {
    const now = Date.now();
    const maxAge = 1000 * 60 * 60; // 1 hour
    Object.keys(this.userSessionStore).forEach((id) => {
      if (now - this.userSessionStore[id].created > maxAge) {
        delete this.userSessionStore[id];
        console.log(`Deleted user session ${id}`);
      }
    });
  }
}

export default DatastoreService;
