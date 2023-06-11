import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { IConfig } from '../../config/configuration.js';
import {
  UserSession,
  UserSessionStore,
  VerificationResults,
  VerificationResultsStore,
} from './datastore.interface.js';

export class DatastoreService {
  private userSessionStore: UserSessionStore;

  private verificationResultsStore: VerificationResultsStore;

  constructor(private configService: ConfigService<IConfig, true>) {
    this.userSessionStore = {};
    this.verificationResultsStore = {};
  }

  getUserSession(id: string): UserSession | null {
    if (!this.userSessionStore[id]) return null;
    return structuredClone(this.userSessionStore[id].data);
  }

  getVerificationResults(id: string): VerificationResults | null {
    if (!this.verificationResultsStore[id]) return null;
    return structuredClone(this.verificationResultsStore[id].data);
  }

  createUserSession(id: string, userSession: UserSession): void {
    this.userSessionStore[id] = {
      data: userSession,
      created: Date.now(),
    };
  }

  createVerificationResults(
    id: string,
    verificationResults: boolean,
    error?: string
  ): void {
    this.verificationResultsStore[id] = {
      data: {
        verified: verificationResults,
        error,
      },
      created: Date.now(),
    };
  }

  deleteUserSession(id: string): void {
    delete this.userSessionStore[id];
  }

  deleteVerificationResults(id: string): void {
    delete this.verificationResultsStore[id];
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

  @Cron(CronExpression.EVERY_HOUR)
  cleanUpVerificationResults(): void {
    const now = Date.now();
    const maxAge = 1000 * 60 * 60; // 1 hour
    Object.keys(this.verificationResultsStore).forEach((id) => {
      if (now - this.verificationResultsStore[id].created > maxAge) {
        delete this.verificationResultsStore[id];
        console.log(`Deleted verification results ${id}`);
      }
    });
  }
}

export default DatastoreService;
