import sinon from 'sinon';

// Restores the default sandbox after every test
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
exports.mochaHooks = {
  afterEach() {
    sinon.restore();
  },
};
