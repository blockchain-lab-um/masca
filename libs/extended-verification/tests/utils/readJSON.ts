import fs from 'node:fs';
import { join } from 'desm';

export const readJSON = (path: string, name: string): unknown =>
  JSON.parse(fs.readFileSync(join(path, name), 'utf-8'));
