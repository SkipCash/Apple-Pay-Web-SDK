package com.secretdemo.skipcashjava;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;


@RestController
public class ApiController {

    private static final String prodUrl = "https://api.skipcash.app"; // Replace with the actual production URL
    private static final String keyId = "304e78fb-5c95-4d51-aa87-eda492adbcc5"; // Replace with your key ID
    private static final String keySecret = "LyNP+mMyiTwvn/kTth4ri1RTq9Z8yyz7CZ7dsUu7zzVaXd+vDerkduWSc2FOvAdBQo9h+CVQtdIKLUwbSqQucqz+YuEpVgXeQgWZhFaAZxCxgsBnQl7joV6p9+ntgjHIlQGAj8d6g3AksAnWP6gm0htW4CX8RyVko13QZoS9PblorkgkH4qoYH1weDxwvHb70SiuM8ev22vcX1SZbMnYTFDzzB0u6yxHNSV447oAypeOvdEXd96EACjp9Y61PKCPzlT1aUP/4oDlPL6QqTp3Qo1NW5/edv//sjMsz8MFYT0Zmk4ZCdbL7k68l8gkPC6p4AGLa3L0vCWmPEAA8vSJt65rXHCtQ/LLHugY7d0xdoA3u7JF591/1qHUvI/EHzFadTM1tW1gvWS2fLoXqMrTVT9F1vsFY5bHKTOXmj0xHkM1NzbB26iiF6vIPfz78rpT8IoUp2BAtJRsy5gIkd4Rl8/OF+BZxfS4F404z0EfRnc8UC3vl66UdwuldzjDIpbAgJ0EHzM78b5q4SiU2dLgqw=="; // Replace with your key secret

    private ObjectMapper objectMapper = new ObjectMapper().setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY)
            .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);;

    // Define your POJO classes here
    // PaymentRequest and PaymentData

    public static class PaymentRequest {
        private String amount;

        public String getAmount() {
            return amount;
        }

        public void setAmount(String amount) {
            this.amount = amount;
        }
    }

    public static class PaymentData {
        @JsonProperty
        public String Uid;
        @JsonProperty
        public String KeyId;
        @JsonProperty
        public String Amount;
        @JsonProperty
        public String FirstName = "Pawan";
        @JsonProperty
        public String LastName = "Garg";
        @JsonProperty
        public String Phone = "12345678";
        @JsonProperty
        public String Email = "pawan.garg@sufalamtech.com";
        @JsonProperty
        public String TransactionId;

        public PaymentData(String uid, String keyId, String amount) {
            Uid = uid;
            KeyId = keyId;
            Amount = amount;
            TransactionId = uid;
        }

        // Getters and setters
    }

    public static class DataPayload {
        public String merchantIdentifier;
        public String domainName;
        public String displayName;
        public String initiative;
        public String initiativeContext;

        public DataPayload(String merchantIdentifier, String domainName, String displayName,
                           String initiative, String initiativeContext) {
            this.merchantIdentifier = merchantIdentifier;
            this.domainName = domainName;
            this.displayName = displayName;
            this.initiative = initiative;
            this.initiativeContext = initiativeContext;
        }
    }


    @GetMapping("/")
    public String showHomePage() {
        return "index"; // This maps to index.html in the templates folder
    }

    @GetMapping("/validateSession")
    public ResponseEntity<String> validateSession(@RequestParam String u) {
        try {

            System.out.println("uuuuuuuuu");
            System.out.println(u);

            if (u == null || u.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Please send a valid URL");
            }

            // Prepare data payload
            DataPayload dataPayload = new DataPayload(
                    "merchant.com.skipcash.appay",
                    "https://skipcashpython.secretdemo.com",
                    "https://skipcashpython.secretdemo.com",
                    "web",
                    "skipcashpython.secretdemo.com"
            );

            // Convert payload to JSON
            String payload = objectMapper.writeValueAsString(dataPayload);

            // Set up HTTP client
            HttpClient httpClient = HttpClients.createDefault();
            HttpPost httpPost = new HttpPost(u);
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setEntity(new StringEntity(payload, StandardCharsets.UTF_8));

            HttpResponse response = httpClient.execute(httpPost);

            System.out.println(response);

            if (response.getStatusLine().getStatusCode() == 200) {
                String responseBody = EntityUtils.toString(response.getEntity());
                return ResponseEntity.ok(responseBody);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(response.getStatusLine().getReasonPhrase());
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @PostMapping("/makepayment")
    public ResponseEntity<String> processPayment(@RequestParam("amount") String amount) {
        try {
           String uid = UUID.randomUUID().toString();
           PaymentData paymentData = new PaymentData(uid, keyId, amount);
           Mac sha256Hmac = Mac.getInstance("HmacSHA256");
           SecretKeySpec secretKeySpec = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
           sha256Hmac.init(secretKeySpec);

           String resultHeader = "Uid=" + uid
                    + ",KeyId=" + keyId
                    + ",Amount=" + "12"
                    + ",FirstName=Pawan"
                    + ",LastName=Garg"
                    + ",Phone=12345678"
                    + ",Email=pawan.garg@sufalamtech.com"
                    + ",TransactionId=" + uid;

           byte[] hashBytes = sha256Hmac.doFinal(resultHeader.getBytes(StandardCharsets.UTF_8));
           String authorizationHeader = Base64.getEncoder().encodeToString(hashBytes);

           HttpClient httpClient = HttpClients.createDefault();
           HttpPost httpPost = new HttpPost(prodUrl + "/api/v1/payments");
           httpPost.addHeader("Content-Type", "application/json");
           httpPost.addHeader("Authorization", authorizationHeader);
           httpPost.setEntity(new StringEntity(objectMapper.writeValueAsString(paymentData)));

           HttpResponse response = httpClient.execute(httpPost);
           if (response.getStatusLine().getStatusCode() == 200) {
              String responseBody = EntityUtils.toString(response.getEntity());
                return ResponseEntity.ok(responseBody);
           } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(response.getStatusLine().getReasonPhrase()); // Handle the error
           }
        } catch (NoSuchAlgorithmException | InvalidKeyException | IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

}
