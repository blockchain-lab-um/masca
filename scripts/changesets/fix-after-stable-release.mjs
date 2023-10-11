import fs from 'node:fs';

// Read files inside the `.changeset` directory
const files = fs.readdirSync('.changeset');

// Filter out files that don't end with `.md` extension
const changesets = files.filter(
  (file) => file.endsWith('.md') && file !== 'README.md'
);

// Read the contents of pre.json in the `.changeset` directory
const preJson = fs.readFileSync('.changeset/pre.json', 'utf-8');

// Parse the contents of pre.json into a JavaScript object
const pre = JSON.parse(preJson);

// Write changeset file names (without file extension) to the `changesets` key
pre.changesets = changesets.map((changeset) => changeset.replace('.md', ''));

// Write the updated pre.json back to the `.changeset` directory
fs.writeFileSync('.changeset/pre.json', JSON.stringify(pre, null, 2));
