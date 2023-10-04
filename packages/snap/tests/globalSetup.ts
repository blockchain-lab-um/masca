import crypto from 'node:crypto';
import * as matchers from 'jest-extended';
import { beforeAll, expect } from 'vitest';

expect.extend(matchers);

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.window = { crypto };
});
