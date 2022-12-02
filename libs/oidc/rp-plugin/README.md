# Veramo plugin template

This template repository provides a bare-bones structure for writing an agent plugin for Veramo and/or for providing
your own implementations for key management and storage, or for DID storage.

## Quick start

- Copy this repo
- Rename package in `package.json`
- `yarn`
- `yarn build` or `yarn watch`
- `yarn generate-plugin-schema`
- `yarn start` or VSCode Debugger (CMD + Shift + D) > Run `OpenAPI server`

## Structure of this template

### 1. A custom Veramo agent plugin

An agent plugin for Veramo is a class that provides some methods to be called on the agent object, and also emit and
listen to agent events triggered by other plugins.

This repository has an example of such a class in [`./src/agent/my-plugin.ts`](./src/agent/my-plugin.ts) that provides
the `myPluginFoo()` method and listens to `validatedMessage` events and emits `my-event` and `my-other-event`.

The types associated with this plugin are declared in [`./src/types/IMyAgentPlugin.ts`](./src/types/IMyAgentPlugin.ts)

Adding a declaration for this in `package.json` makes it easier to programmatically generate a schema for your plugin:

```json
{
  //...
  "veramo": {
    "pluginInterfaces": {
      "IMyAgentPlugin": "./src/types/IMyAgentPlugin.ts"
    }
  }
}
```

### 2. Custom key management templates

This template contains some skeleton code for some customizations to the ways keys are managed by Veramo. You can
change [how and where keys are stored](./src/key-manager/my-key-store.ts) and
[how they are encrypted](./src/key-manager/my-secret-box.ts) by the default Veramo plugins, and/or create your own
[`AbstractKeyManagementSystem` implementation](./src/key-manager/my-key-management-system.ts) from scratch.

### 3. Custom DID management templates

You can change [how DIDs are stored](./src/did-manager/my-did-store.ts) by Veramo. You can implement support for other
DID methods by overriding [MyIdentifierProvider](./src/did-manager/my-identifier-provider.ts)

### 4. Use your plugin with @veramo/cli

See [./agent.yml](./agent.yml) for an example Veramo CLI configuration that uses the plugin and customizations from this
template alongside other Veramo plugins to create a fully functioning agent.

## Testing your plugin

There are a number of ways to test your plugin.

### Integration tests

This repository contains 2 sample test setups that run the same tests in different contexts.

- [localAgent.test.ts](./__tests__/localAgent.test.ts) creates an agent using [agent.yml](./agent.yml)
  and runs the shared tests using that agent.
- [restAgent.test.ts](./__tests__/restAgent.test.ts) creates an agent using [agent.yml](./agent.yml)
  and runs it as a remote agent. Then, it creates another agent that uses `@veramo/remote-client` to expose the methods
  of the remote agent locally, and runs the tests using the local agent.

### Call your agent using the Veramo OpenAPI server

You can also run `yarn veramo server` in your terminal and then go to http://localhost:3335/api-docs to see all the
available plugin methods. You can call them after you click Authorize and provide the API key defined
in [agent.yml](./agent.yml#L119). By default, it is `test123`.

### Step by step debugging

This repository includes some [Visual Studio Code launch configurations](./.vscode/launch.json) that can be used for
step by step debugging.
