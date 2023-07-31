import { execa } from 'execa';

const ALL_PACKAGES = {
  // Core
  '@blockchain-lab-um/masca-core': [
    '@blockchain-lab-um/masca-connector',
    '@blockchain-lab-um/masca',
    '@blockchain-lab-um/masca-types',
    '@blockchain-lab-um/veramo-datamanager',
  ],
  // OIDC
  '@blockchain-lab-um/oidc': [
    '@blockchain-lab-um/oidc-rp-plugin',
    '@blockchain-lab-um/oidc-client-plugin',
    '@blockchain-lab-um/oidc-types',
  ],
  // Other
  '@blockchain-lab-um/utils': ['@blockchain-lab-um/utils'],
  '@blockchain-lab-um/did-provider-key': [
    '@blockchain-lab-um/did-provider-key',
  ],
  '@blockchain-lab-um/did-provider-ebsi': [
    '@blockchain-lab-um/did-provider-ebsi',
  ],
};

const DEPENDENCIES = {
  // Core
  '@blockchain-lab-um/masca': [
    '@blockchain-lab-um/veramo-datamanager',
    '@blockchain-lab-um/did-provider-key',
    '@blockchain-lab-um/did-provider-ebsi',
    '@blockchain-lab-um/masca-types',
    '@blockchain-lab-um/oidc-client-plugin',
    '@blockchain-lab-um/oidc-types',
    '@blockchain-lab-um/utils',
  ],
  '@blockchain-lab-um/masca-types': ['@blockchain-lab-um/utils'],
  '@blockchain-lab-um/masca-connector': ['@blockchain-lab-um/masca-types'],
  '@blockchain-lab-um/veramo-datamanager': ['@blockchain-lab-um/masca-types'],
  // OIDC
  '@blockchain-lab-um/oidc-rp-plugin': ['@blockchain-lab-um/oidc-types'],
  '@blockchain-lab-um/oidc-client-plugin': ['@blockchain-lab-um/oidc-types'],
  // Other
  '@blockchain-lab-um/did-provider-key': [
    '@blockchain-lab-um/utils',
    '@blockchain-lab-um/masca-types',
  ],
  '@blockchain-lab-um/did-provider-ebsi': [],
};

// Function to find all dependencies of the selected package
function findAllDependencies(pkg, dependencies = new Set()) {
  if (!DEPENDENCIES[pkg]) {
    return dependencies;
  }

  DEPENDENCIES[pkg].forEach((dependency) => {
    dependencies.add(dependency);
    findAllDependencies(dependency, dependencies);
  });

  return dependencies;
}

const main = async () => {
  const args = process.argv;

  if (args.length < 3) {
    console.error('No package was selected');
    process.exit(1);
  }

  // Should we version all packages?
  if (args[2] === 'all') {
    await execa('pnpm changeset version', {
      shell: true,
    });

    process.exit(0);
  }

  const allDependencies = new Set();

  // Find all dependencies of the selected packages
  ALL_PACKAGES[args[2]].map((pkg) =>
    findAllDependencies(pkg).forEach((dep) => allDependencies.add(dep))
  );

  // Version only the selected packages and their dependencies
  const packagesToIgnore = Object.entries(ALL_PACKAGES)
    .filter(([key]) => key !== args[2] && !allDependencies.has(key))
    .flatMap(([, value]) => value);

  await execa(
    `pnpm changeset version ${packagesToIgnore
      .map((pkg) => `--ignore ${pkg}`)
      .join(' ')}`,
    { shell: true }
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
