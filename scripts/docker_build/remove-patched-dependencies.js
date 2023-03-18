const fs = require('fs');

fs.readFile('./package.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  let packageJson = JSON.parse(data);
  delete packageJson.pnpm.patchedDependencies;

  fs.writeFile(
    'package.json',
    JSON.stringify(packageJson, null, 2),
    'utf8',
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
});
