var express = require("express");
var dotenv = require("dotenv");
var cors = require("cors");
const bodyParser = require("body-parser");
var indexRouter = require("./routes/index.js");
const path = require("path");
require('./logs/log');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", indexRouter);

app.get("/sdk.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "sdk.js"));
});

app.get(
  "/.well-known/apple-developer-merchantid-domain-association.txt",
  (req, res) => {
    res.setHeader("Content-Type", "text/javascript");
    res.sendFile(
      path.join(
        __dirname,
        ".well-known/apple-developer-merchantid-domain-association.txt"
      )
    );
  }
);

app.get("/", (req, res) => {
  console.log("path is:", path.join(__dirname, "index.html"));
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
