#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Error: bash create-provider.sh pluginTemplate; pluginTemplate should be the name of the method to be used in the plugin, e.g. 'ethr'"
    exit 1
fi

arg=$1
lower=${arg,,}
capital=${lower^}

mkdir -p ../libs/did-provider-$lower
rsync -av --exclude='node_modules' ../templates/did-provider-plugin/ ../libs/did-provider-$lower
find ../libs/did-provider-$lower -type f -name "*pluginTemplate*" -exec bash -c 'mv "$0" "${0//pluginTemplate/$1}"' {} $lower \;
find ../libs/did-provider-$lower -type f -exec sed -i '' -e "s/pluginTemplate/$lower/g;s/PluginTemplate/$capital/g" {} +

echo "module.exports = {
  '*.{js,ts,mts,mjs,cjs,cts,jsx,tsx,json}': ['biome check --apply'],
};" > ../libs/did-provider-$lower/.lintstagedrc.cjs

pnpm install
