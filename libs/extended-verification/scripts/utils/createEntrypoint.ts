import { writeFile } from 'fs/promises';

export const createEntrypoint = async (files: string[]) => {
  let entrypoint = `import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';\n
import { readJSON } from '../utils/readJSON';\n\n`;

  entrypoint = entrypoint.concat(
    files
      .map(
        (file) => `export const ${file.toUpperCase()} = readJSON(
  import.meta.url,
  '${file}.json'
) as ${
          file.includes('presentation')
            ? 'VerifiablePresentation'
            : 'VerifiableCredential'
        };`
      )
      .join('\n')
  );

  await writeFile('tests/data/index.ts', entrypoint);
};
