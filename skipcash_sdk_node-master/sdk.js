var skipcash = {
  sdk: {
    defaults: {
      btnInnerHtml: "Pay with ",
      btnHmlAfterLogo: "SkipCash",
      sandBoxUrl: "https://skipcashtest.azurewebsites.net/",
      productionUrl: "https://api.skipcash.app/",
      // environment: "sandbox",
      environment: "production",

      onError: function (message) {
        console.log(message);
      },
      direct: false,
    },

    /**
     * /
     * @param {any} options
     * sandbox : bool - true for TEST env, false for PROD env
     * @param {any} onSuccess
     * @param {any} onError
     */
    canPayWithApple: function (merchantIdentifier, onSuccess, onError) {
      if (!window.ApplePaySession) {
        if (onError != null) onError(1);
        return;
      }
      if (!window.ApplePaySession.canMakePayments()) {
        if (onError != null) onError(2);
        return;
      }

      var promise =
        window.ApplePaySession.canMakePaymentsWithActiveCard(
          merchantIdentifier
        );

      promise.then(function (canMakePayments) {
        if (canMakePayments) {
          if (onSuccess != null) onSuccess();
        } else {
          if (onError != null) onError(3);
        }
      });
    },

    /**
     * /
     * @param {any} options
     * amount : number - the amount on the transaction
     * paymentId : string - the skipcash transaction ID, options, if onCreatePayment was passed
     * sandbox : bool - true: TEST environment, false: PROD environment
     * server : string - optional, can overwrite the skipcash server URL set by sandbox value
     * merchant : string - optional, merchant name, if not set, SkipCash
     * onCreatePayment : function to generate a new payment, if paymentId was not supplied
     * onValidateSession : validate call to apple
     */

    payWithApplePay: async function (options, onSuccess, onError) {
      var skipcashServer = options.sandbbox
        ? "https://skipcashtest.azurewebsites.net"
        : "https://api.skipcash.app";

      if (options.server) {
        skipcashServer = options.server;
      }

      console.log("skipcashServer ---> ", skipcashServer);

      var merchantName = options.merchant ? options.merchant : "SkipCash";

      console.log("merchantName ---> ", merchantName);

      var request = {
        countryCode: "QA",
        currencyCode: "QAR",
        supportedNetworks: ["visa", "masterCard", "amex", "discover"],
        merchantCapabilities: ["supports3DS"],
        total: { label: merchantName, amount: options.amount },
      };
      console.log("request ---> ", request);

      var session = new ApplePaySession(12, request);
      console.log("session ---> ", session);

      session.begin();
      session.onvalidatemerchant = function (event) {
        var url = event.validationURL;
        //   console.log("url ---> ", url);

        if (!options.paymentId && !options.onCreatePayment) {
          onError("Missing event for creating the payment!");
          return;
        }

        var createPayment = function (amount, onSuccess, onError) {
          onSuccess(options.paymentId);
        };

        if (!options.paymentId && options.onCreatePayment) {
          createPayment = options.onCreatePayment;
        }

        createPayment(
          options.amount,
          function (newPaymentId) {
            options.paymentId = newPaymentId;
            console.log("newPaymentId", newPaymentId);

            if (!options.onValidateSession) {
              onError("Missing event for validating the session!");
              return;
            }

            var promise = options.onValidateSession(url, onSuccess, onError);
            promise.then(function (merchantSession) {
              session.completeMerchantValidation(merchantSession);
            });
          },
          function (e) {
            console.log("createPayment failed", e);

            if (onError != null) onError("Create payment failed: " + e);
          }
        );
      };
      session.onpaymentauthorized = (e) => {
        var applePaymentToken = e.payment.token;
        callApplePay(
          options.paymentId,
          skipcashServer,
          applePaymentToken,
          function () {
            if (onError) {
              console.log("onpaymentauthorized error time", applePaymentToken);

              onError("Apple pay failed!");
            }
          },
          (isSuccess) => {
            console.log(
              "onpaymentauthorized isSuccess time",
              applePaymentToken
            );
            console.log(
              "ApplePaySession.STATUS_SUCCESS",
              ApplePaySession.STATUS_SUCCESS
            );
            console.log(
              "ApplePaySession.STATUS_FAILURE",
              ApplePaySession.STATUS_FAILURE
            );

            if (isSuccess) {
              session.completePayment(ApplePaySession.STATUS_SUCCESS);
              if (onSuccess) {
                onSuccess();
              }
            } else {
              session.completePayment(ApplePaySession.STATUS_FAILURE);
              if (onError) {
                onError("Payment failed!");
              }
            }
          }
        );
      };
    },
  },
};

function callApplePay(
  paymentId,
  server,
  applePaymentToken,
  onError,
  onSuccess
) {
  var request = {
    token: applePaymentToken,
  };
  var req = new XMLHttpRequest();
  req.onload = function () {
    var response = JSON.parse(req.responseText);
    if (req.status === 200) {
      onSuccess(response.resultObj.isSuccess);
    } else {
      onError(response);
    }
  };
  console.log("applePaymentToken", applePaymentToken);
  console.log(
    "API URL",
    server + "/api/v1/payments/apple/" + paymentId + "/pay"
  );

  req.open(
    "POST",
    server + "/api/v1/payments/apple/" + paymentId + "/pay",
    true
  );
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.send(JSON.stringify(request));
}
