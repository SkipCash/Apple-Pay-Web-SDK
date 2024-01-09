const validateSession = {
    MerchantIdentifier: "merchant.com.skipcash.appay",
    DomainName: "https://skipcashnode.secretdemo.com",
    DisplayName: "SkipCash Sufalam",
    Initiative: "web",
    InitiativeContext: "skipcashnode.secretdemo.com",
    CertificatesPath: "../configurations/certificate.pem",

    PrivateKeyPath: "../configurations/privateKey.pem",

    CertificatePassword: "$k1pC@$H_2o22",
    // CertificatesPath: "fullchain1.pem",
    ClientId: "a5153ff8-e409-4e0a-999c-7385d3ec6a9e",
    KeyId: "304e78fb-5c95-4d51-aa87-eda492adbcc5", // your public key id
    KeySecret: "LyNP+mMyiTwvn/kTth4ri1RTq9Z8yyz7CZ7dsUu7zzVaXd+vDerkduWSc2FOvAdBQo9h+CVQtdIKLUwbSqQucqz+YuEpVgXeQgWZhFaAZxCxgsBnQl7joV6p9+ntgjHIlQGAj8d6g3AksAnWP6gm0htW4CX8RyVko13QZoS9PblorkgkH4qoYH1weDxwvHb70SiuM8ev22vcX1SZbMnYTFDzzB0u6yxHNSV447oAypeOvdEXd96EACjp9Y61PKCPzlT1aUP/4oDlPL6QqTp3Qo1NW5/edv//sjMsz8MFYT0Zmk4ZCdbL7k68l8gkPC6p4AGLa3L0vCWmPEAA8vSJt65rXHCtQ/LLHugY7d0xdoA3u7JF591/1qHUvI/EHzFadTM1tW1gvWS2fLoXqMrTVT9F1vsFY5bHKTOXmj0xHkM1NzbB26iiF6vIPfz78rpT8IoUp2BAtJRsy5gIkd4Rl8/OF+BZxfS4F404z0EfRnc8UC3vl66UdwuldzjDIpbAgJ0EHzM78b5q4SiU2dLgqw==", // your public Secret id
    sandboxUrl: "https://skipcashtest.azurewebsites.net",
    prodUrl: "https://api.skipcash.app"

}

module.exports = validateSession;