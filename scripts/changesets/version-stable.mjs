import { execa } from 'execa';

const ALL_PACKAGES = [
  // Core
  '@blockchain-lab-um/masca-connector',
  '@blockchain-lab-um/masca',
  '@blockchain-lab-um/masca-types',
  '@blockchain-lab-um/veramo-datamanager',
  // OIDC
  '@blockchain-lab-um/oidc-client-plugin',
  '@blockchain-lab-um/oidc-types',
  // Other
  '@blockchain-lab-um/utils',
  '@blockchain-lab-um/did-provider-key',
  '@blockchain-lab-um/did-provider-ebsi',
  // Private (not published)
  '@blockchain-lab-um/dapp',
];

const DEPENDENCIES = {
  // Core
  '@blockchain-lab-um/masca-connector': [
    '@blockchain-lab-um/utils',
    '@blockchain-lab-um/masca-types',
  ],
  '@blockchain-lab-um/masca': [
    '@blockchain-lab-um/did-provider-ebsi',
    '@blockchain-lab-um/did-provider-key',
    '@blockchain-lab-um/masca-types',
    '@blockchain-lab-um/oidc-client-plugin',
    '@blockchain-lab-um/oidc-types',
    '@blockchain-lab-um/utils',
    '@blockchain-lab-um/veramo-datamanager',
  ],
  '@blockchain-lab-um/masca-types': ['@blockchain-lab-um/utils'],
  '@blockchain-lab-um/veramo-datamanager': ['@blockchain-lab-um/masca-types'],
  // OIDC
  '@blockchain-lab-um/oidc-rp-plugin': ['@blockchain-lab-um/oidc-types'],
  '@blockchain-lab-um/oidc-client-plugin': ['@blockchain-lab-um/oidc-types'],
  '@blockchain-lab-um/oidc-types': [],
  // Other
  '@blockchain-lab-um/utils': [],
  '@blockchain-lab-um/did-provider-key': [
    '@blockchain-lab-um/utils',
    '@blockchain-lab-um/masca-types',
  ],
  '@blockchain-lab-um/did-provider-ebsi': [],
  // Private (not published)
  '@blockchain-lab-um/dapp': [
    '@blockchain-lab-um/masca-connector',
    '@blockchain-lab-um/oidc-types',
  ],
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
    return;
  }

  // Should we version all packages?
  if (args[2] === 'all') {
    console.log('Versioning all packages');
    const { stdout } = await execa('pnpm changeset version', {
      shell: true,
    });

    console.log(stdout);

    return;
  }

  const allDependencies = new Set();

  // Find all dependencies of the selected packages
  findAllDependencies(args[2]).forEach((dep) => allDependencies.add(dep));

  console.log(allDependencies);

  // Version only the selected packages and their dependencies
  const packagesToIgnore = ALL_PACKAGES.filter(
    (name) => name !== args[2] && !allDependencies.has(name)
  );

  console.log(`Ignoring packages: ${packagesToIgnore.join(', ')}`);

  await execa(
    `pnpm changeset version ${packagesToIgnore
      .map((pkg) => `--ignore ${pkg}`)
      .join(' ')}`,
    { shell: true, stdio: 'inherit' }
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
