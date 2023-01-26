import { relative } from 'path';

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(' --file ')}`;

export default {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
  '*.{md,json,yml,yaml}': ['prettier --write'],
  '*.{ts,tsx}': () => 'tsc -p tsconfig.json --noEmit --incremental false',
  '*.{css,scss}': ['stylelint --fix'],
};
