# Utility scripts for Masca monorepo

> Note: you may have to change the file permissions for scripts you wish to run:
>
> ```
> chmod u+x /path/to/script.sh
>
> or
>
> chmod 755 /path/to/script.sh
>
> ```

## `init-provider.sh`

### Additional requirements

- `rsync`

This script initializes a new Veramo DID Provider plugin and prepares the package in the correct folder.

### Running the script

Example run:

```
bash init-provider.sh github
```

This will create the structure below:

```
$ tree ROOT_DIR/libs/did-provider-github
ROOT_DIR/libs/did-provider-github
├── node_modules/...
├── src
│   ├── githubDidProvider.ts
│   ├── githubDidResolver.ts
│   ├── index.ts
│   └── types
│       └── githubProviderTypes.ts
├── tests
│   ├── agent.spec.ts
│   └── plugin.ts
├── tsconfig.build.json
├── tsconfig.eslint.json
├── tsconfig.json
├── .eslintrc.cjs
├── .lintstagedrc.cjs
├── .prettierignore
├── tsup.config.ts
├── README.md
├── jest.config.ts
├── sonar-project.properties
└── package.json

27 directories, 14 files
```

Check `package.json` for configured scripts.
