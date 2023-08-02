# Release workflow documentation

## Introduction

We use [Changesets](https://github.com/changesets/changesets) for creating new releases, bumping versions, publishing to NPM and keeping track of changes in changelogs.

Configuration files for `Changesets` are located inside the `.changeset` directory.

## Developer guide

Changesets are added by developers on PRs that require them.

This is done with:

```sh
# 1. Run the changesets cli
pnpm changeset add

# 2. Select the changed packages
# 3. Select the version bump you want to do
## Major - X.0.0 (breaking changes)
## Minor - 0.X.0 (features)
## Patch - 0.0.X (fix)
# 4. Write a short description of the changes
# 5. Add and commit changes
git add . && git commit -m "chore: add changesets" && git push

# Repeat above steps to add multiple changesets
# This would be done if we made multiple changes in different packages
```

We are also using the `changesets-bot` to remind developers of missing changesets in new PRs. The PRs are not blocked by this, because some changes (like documentation) don't require changesets to be added.

### Workflows

- release-beta
- release-stable
- exit-prerelease-mode

### Scripts

Located inside the `./scripts/changesets` directory.

- publish-beta.sh
- publish-stable.sh
- version-beta.sh
- version-stable.sh
- update-snap-version.mjs (syncs masca version across the repo)
- version-stable.mjs (checks which packages need to be versioned)

## Beta releases

Beta releases are created on the develop branch. We release all the packages (that include changes) at the same time.

Workflow `release-beta` runs when new commits are pushed to the develop branch. It either creates a new release PR (targeting the `develop` branch) or updates the existing one. This means it bumps the package versions (if needed) and commits the changes to the PR. This is done by the `version-beta` script.

When the release PR is merged it will run `publish-beta` which publishes the new beta versions to NPM (with the `beta` tag added).

## Stable release

Stable releases are created on the master branch. We specify which package to release when we run the workflow.

Before we can make a stable release, the master branch needs to be up-to-date with the develop branch. Then we stop the merging process of new PRs to develop and run the `exit-prerelease-mode` workflow on the `master` branch. This exits the prerelease mode of changesets and adds a new commit to master.

After the previous step is completed, we can run `release-stable` on the `master` branch with the selected package we want to publish. This will cause the `version-stable` script to be run. The script updates the selected packages versions and prepares a release PR targeting the `master` branch.

When the release PR is merged, we again need to run the `release-stable` workflow on the `master` branch. This will run `publish-stable` script which publishes the new stable versions of the previously selected packages to NPM (with the `latest` tag added). After publishing the scipt enters the beta prerelease mode and commits the changes to master. Then it calls `git checkout develop` and `git rebase master && git push`.
