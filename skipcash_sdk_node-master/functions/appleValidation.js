// Implement the Apple validation backend call.
var validateSession = require("../configurations/configuration.js");
var axios = require("axios");
var https = require("https");
const fs = require("fs");
const path = require("path");
const main = async (request, res) => {
  console.successResponse("request: ", request.query);
  const { u } = request.query;
  if (!u) {
    return res.send("Please send the validation URL");
  }

  // use set the certificates for the POST request
  httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    cert: fs.readFileSync(path.join(__dirname, "./certificate.pem")),
    key: fs.readFileSync(path.join(__dirname, "./privateKey.pem")),
  });

  response = await axios.post(
    u,
    {
      merchantIdentifier: validateSession.MerchantIdentifier,
      domainName: validateSession.DomainName,
      displayName: validateSession.DisplayName,
      initiative: validateSession.Initiative,
      initiativeContext: validateSession.InitiativeContext,
    },
    {
      httpsAgent,
    }
  );
  // return response.data;
  const responseText = response.data;
  if (response.status !== 200) {
    console.error("responseText: ", responseText);
    return res.send(
      `Request failed with status ${response.status}: ${responseText}`
    );
  }
  console.successResponse("responseText: ", responseText);

  return res.send(JSON.stringify(responseText));
};

// main()
//   .then((response) => {
//     console.successResponse(response);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

module.exports = main;
