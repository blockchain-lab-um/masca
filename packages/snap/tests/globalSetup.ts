import crypto from 'node:crypto';
import * as matchers from 'jest-extended';
import { beforeAll, expect } from 'vitest';

expect.extend(matchers);

beforeAll(() => {
  // @ts-ignore
  global.window = { crypto };
});
