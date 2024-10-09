const validateSession = {
  MerchantIdentifier: "your apple merchant id",
  DomainName: "your website domain with https://",
  DisplayName: "Your Business Name",
  Initiative: "web",
  InitiativeContext: "your domain without https://",
  CertificatesPath: "../configurations/certificate.pem",

  PrivateKeyPath: "../configurations/privateKey.pem",

  CertificatePassword: "your certificate password",
  // CertificatesPath: "fullchain1.pem",
  ClientId: "your skipcash client id",
  KeyId: "your skipcash merchant id", // your public key id
  KeySecret: "your skipcash secret key", // your public Secret id
  sandboxUrl: "https://skipcashtest.azurewebsites.net",
  prodUrl: "https://api.skipcash.app",
};

module.exports = validateSession;
