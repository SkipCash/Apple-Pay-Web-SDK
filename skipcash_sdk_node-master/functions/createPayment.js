const axios = require("axios");
const crypto = require('crypto');
const { v4: uuidv4 } = require("uuid");
var validateSession = require("../configurations/configuration.js");

const createPayment = async (request, res) => {
  console.successResponse("request: ",request.body);
  if(!request.body.amount){
    return res.send("Please send the amount");
  }


  const amount = request.body.amount.toString();
  let data = {
    Uid: uuidv4(),
    KeyId: validateSession.KeyId,
    Amount: amount,
    FirstName: "Pawan",
    LastName: "Garg",
    Phone: "12345678",
    Email: "pawan.garg@sufalamtech.com",
    TransactionId: uuidv4(),
  };

  let dataString = JSON.stringify(data);
  let resultheader =
    "Uid=" +
    data.Uid +
    ",KeyId=" +
    data.KeyId +
    ",Amount=" +
    data.Amount +
    ",FirstName=" +
    data.FirstName +
    ",LastName=" +
    data.LastName +
    ",Phone=" +
    data.Phone +
    ",Email=" +
    data.Email +
    ",TransactionId=" +
    data.TransactionId;

  let s = hashHmac("sha256", resultheader, validateSession.KeySecret, true);
  let authorisationheader = Buffer.from(s).toString("base64");
  // console.successResponse("auth: ",authorisationheader);
  axios({
    method: "post",
    url: validateSession.prodUrl+"/api/v1/payments",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorisationheader,
    },
    data: dataString,
  })
    .then((response) => {
      console.successResponse(response.data);
      return res.send(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.error(error.response);
      return res.send(error.response);
    });
};



function hashHmac(algorithm, data, key, rawOutput) {
  let hmac = crypto.createHmac(algorithm, key);
  hmac.update(data);
  return hmac.digest(rawOutput ? undefined : "hex");
}

// createPayment()
//   .then((response) => {
//     console.successResponse(response);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

module.exports = createPayment;
