const generateValidCredentials = () => {
  // TODO:
  // - Create a valid credential with a valid schema
  // - EIP712, JWT
  // - EBSI Trusted Issuer in registry
};

const generateInvalidCredentials = () => {
  // TODO:
  // - Create an invalid credential with an invalid schema
  // - JWT: invalid signature, expired, not yet valid
  // - EIP712: invalid signature, expired, not yet valid ?
  // - Revoked
  // - EBSI Trusted Issuer not in registry
};

const generateValidPresentations = () => {};

const generateInvalidPresentations = () => {};

const main = async () => {
  // const agent = await createVeramoAgent();

  const validCredentials = generateValidCredentials();
  const invalidCredentials = generateInvalidCredentials();
  const validPresentations = generateValidPresentations();
  const invalidPresentations = generateInvalidPresentations();
};

const createVeramoAgent = async () => {};
