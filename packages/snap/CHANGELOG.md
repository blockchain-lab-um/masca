# Changelog

## [0.4.0](https://github.com/blockchain-lab-um/masca/compare/masca-v0.3.1...masca-v0.4.0) (2023-07-25)


### :rocket: Features

* add snap type guards ([#310](https://github.com/blockchain-lab-um/masca/issues/310)) ([a7d1472](https://github.com/blockchain-lab-um/masca/commit/a7d14724256f70db7b45a8f8e8035e06bfbbbb57))
* modularize snap arhitecture ([#314](https://github.com/blockchain-lab-um/masca/issues/314)) ([a1450f3](https://github.com/blockchain-lab-um/masca/commit/a1450f3e701cf35c019e6f0b4276f72c46bb8253))
* PolygonID support (query, save, delete, credential offer, authorization request) ([a1450f3](https://github.com/blockchain-lab-um/masca/commit/a1450f3e701cf35c019e6f0b4276f72c46bb8253))
* support network switching on dapp ([a1450f3](https://github.com/blockchain-lab-um/masca/commit/a1450f3e701cf35c019e6f0b4276f72c46bb8253))
* switch to esbuild for bundling masca ([#311](https://github.com/blockchain-lab-um/masca/issues/311)) ([a129fa1](https://github.com/blockchain-lab-um/masca/commit/a129fa14d9e364717cba2263086fe65f2933c478))
* use Ethers HDNodeWallet + entropy for key generation ([a1450f3](https://github.com/blockchain-lab-um/masca/commit/a1450f3e701cf35c019e6f0b4276f72c46bb8253))


### :bug: Bug Fixes

* fixes some styling problems ([#308](https://github.com/blockchain-lab-um/masca/issues/308)) ([8d321fa](https://github.com/blockchain-lab-um/masca/commit/8d321fa9fdbe148cfcb4682bfb775302422b20cb))
* resolves build and test issues ([#354](https://github.com/blockchain-lab-um/masca/issues/354)) ([d178b8a](https://github.com/blockchain-lab-um/masca/commit/d178b8a75abe938aee9e9b2047d25bd7c352ed4f))

## [0.3.1](https://github.com/blockchain-lab-um/masca/compare/masca-v0.3.0...masca-v0.3.1) (2023-07-04)


### :bug: Bug Fixes

* did key jwk jcs ([#304](https://github.com/blockchain-lab-um/masca/issues/304)) ([3112bc1](https://github.com/blockchain-lab-um/masca/commit/3112bc163def2cfbe4083559fa8fde29632918d4))

## [0.3.0](https://github.com/blockchain-lab-um/masca/compare/masca-v0.2.1...masca-v0.3.0) (2023-07-03)


### :bug: Bug Fixes

* dApp does not accept JWT string ([#292](https://github.com/blockchain-lab-um/masca/issues/292)) ([68677ad](https://github.com/blockchain-lab-um/masca/commit/68677ad9763e2fd02ab0992866bd2a525fe5043a))
* fetched label showing elapsed time ([#284](https://github.com/blockchain-lab-um/masca/issues/284)) ([8f4d511](https://github.com/blockchain-lab-um/masca/commit/8f4d511d37de15f149bc9930ccfb1c5e8f8e4d64))


### :rocket: Features

* add global vc filter ([#298](https://github.com/blockchain-lab-um/masca/issues/298)) ([6eac029](https://github.com/blockchain-lab-um/masca/commit/6eac0298cdfef4561ab8f908c3d7c0db6af021d8))
* combine qr scanning with OIDC ([#297](https://github.com/blockchain-lab-um/masca/issues/297)) ([f475c1a](https://github.com/blockchain-lab-um/masca/commit/f475c1a615f13c1212992f6c0ffe3abfdeccae3a))
* createVP  rpc method accepts VCs instead of VC IDs ([#247](https://github.com/blockchain-lab-um/masca/issues/247)) ([6cdd597](https://github.com/blockchain-lab-um/masca/commit/6cdd5976ad99babc5ca1d83b2ecd33e3c0e7342e))
* handle did:ethr and did:pkh ([#296](https://github.com/blockchain-lab-um/masca/issues/296)) ([af3e878](https://github.com/blockchain-lab-um/masca/commit/af3e8786729472bd084af0c37ff899256546be04))
* initial implementation of entropy based account indices handling ([#239](https://github.com/blockchain-lab-um/masca/issues/239)) ([4160d4e](https://github.com/blockchain-lab-um/masca/commit/4160d4e1ad466bc2ce1da5ac4c6129c91bb08dca))
* pass EBSI holder wallet conformance tests ([#291](https://github.com/blockchain-lab-um/masca/issues/291)) ([cdd7b63](https://github.com/blockchain-lab-um/masca/commit/cdd7b635c2a07237834fd2dccadb3dacf137f54b))
* refactor tests ([#286](https://github.com/blockchain-lab-um/masca/issues/286)) ([62bd89c](https://github.com/blockchain-lab-um/masca/commit/62bd89c4b08215cb6968955fdfaa01f19460ce76))

## [0.2.1](https://github.com/blockchain-lab-um/masca/compare/masca-v0.2.0...masca-v0.2.1) (2023-06-19)


### :bug: Bug Fixes

* update masca readme ([f2d1731](https://github.com/blockchain-lab-um/masca/commit/f2d17314256435357957620664674f9fd1d64698))

## [0.2.0](https://github.com/blockchain-lab-um/masca/compare/masca-v0.1.0...masca-v0.2.0) (2023-06-19)


### :bug: Bug Fixes

* add verifyData rpc method to connector ([#243](https://github.com/blockchain-lab-um/masca/issues/243)) ([a67606a](https://github.com/blockchain-lab-um/masca/commit/a67606a279a20247e7d59bd7bbea62eca49b8fa9))
* runtime and ceramic issues ([#229](https://github.com/blockchain-lab-um/masca/issues/229)) ([975d7ec](https://github.com/blockchain-lab-um/masca/commit/975d7ec8a012903f30ff7ccfb757a8c8935be600))


### :rocket: Features

* implement ceramic session ([#246](https://github.com/blockchain-lab-um/masca/issues/246)) ([dc6f985](https://github.com/blockchain-lab-um/masca/commit/dc6f985892dbbb2608b736d3d0693827bf3ec25f))
* nextjs app dir ([#227](https://github.com/blockchain-lab-um/masca/issues/227)) ([be5dce3](https://github.com/blockchain-lab-um/masca/commit/be5dce37ef6485bd0c97b11057ef015205b9cb10))
* OIDC apps and libs ([#88](https://github.com/blockchain-lab-um/masca/issues/88)) ([14feb50](https://github.com/blockchain-lab-um/masca/commit/14feb5022e578002ce475892c29b5ebedf61778d))
* Universal DID Resolver ([#223](https://github.com/blockchain-lab-um/masca/issues/223)) ([2f54b5e](https://github.com/blockchain-lab-um/masca/commit/2f54b5e10b3d787dbbcb62fe6bbef8600dc51ec2))

## [0.1.0](https://github.com/blockchain-lab-um/masca/compare/masca-v0.1.0...masca-v0.1.0) (2023-05-04)


### :page_with_curl: Documentation

* change ssi snap to masca ([#156](https://github.com/blockchain-lab-um/masca/issues/156)) ([08469af](https://github.com/blockchain-lab-um/masca/commit/08469af60103bb25e8e1fc8e7747686af8e6868a))


### :rocket: Features

* add `did:ebsi` provider Veramo plugin ([#161](https://github.com/blockchain-lab-um/masca/issues/161)) ([a4bc1bb](https://github.com/blockchain-lab-um/masca/commit/a4bc1bbe6dc654f56ba528723cbc28dae03bbe50))
* add createVC RPC method ([#141](https://github.com/blockchain-lab-um/masca/issues/141)) ([2b23f93](https://github.com/blockchain-lab-um/masca/commit/2b23f93e9105ddc51790698b69056f4c3a32b865))
* new dapp ([#107](https://github.com/blockchain-lab-um/masca/issues/107)) ([9f172ed](https://github.com/blockchain-lab-um/masca/commit/9f172eda405c7c58fc5d0531f401c2c5bbd6dd2b))
* publish did ebsi veramo plugin  ([#186](https://github.com/blockchain-lab-um/masca/issues/186)) ([afa2d0a](https://github.com/blockchain-lab-um/masca/commit/afa2d0aa90a6ace0ed6cf4bdb42dd8bf484962be))
* update packages to esm ([#135](https://github.com/blockchain-lab-um/masca/issues/135)) ([fb7f759](https://github.com/blockchain-lab-um/masca/commit/fb7f7591e2bd366cbe97c07a14a8920350d58715))
* update snaps to 0.32.2 ([#184](https://github.com/blockchain-lab-um/masca/issues/184)) ([d1328e0](https://github.com/blockchain-lab-um/masca/commit/d1328e03acfac85531ea7f1e21a70fa4cd8f0981))
* update snaps-cli to 0.30.0 ([#172](https://github.com/blockchain-lab-um/masca/issues/172)) ([7fc29dc](https://github.com/blockchain-lab-um/masca/commit/7fc29dc0f8f20d4aba15084ecc106b974d4e4a7f))
* use veramo packages ([#170](https://github.com/blockchain-lab-um/masca/issues/170)) ([d1fc4fe](https://github.com/blockchain-lab-um/masca/commit/d1fc4fe01dd1ddfab3294425dd2c5406920deb37))
* website internationalization ([#153](https://github.com/blockchain-lab-um/masca/issues/153)) ([4e5f8be](https://github.com/blockchain-lab-um/masca/commit/4e5f8bec75f6c412d862f0739f16b1560809bdf8))


### :bug: Bug Fixes

* connector set account ([#195](https://github.com/blockchain-lab-um/masca/issues/195)) ([3e5a922](https://github.com/blockchain-lab-um/masca/commit/3e5a922eb4a0730ca1cbad39124f05f11bfc259f))
* update dapp page titles ([#175](https://github.com/blockchain-lab-um/masca/issues/175)) ([7c86f76](https://github.com/blockchain-lab-um/masca/commit/7c86f7605ef2727241b9c57f8417d191e80745db))
