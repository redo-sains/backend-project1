const express = require("express");
const { db } = require("./firebase.config");
const { collection, addDoc } = require("firebase/firestore");
const accountRoute = require("./routers/account.router");

const cors = require("cors");
const app = express();

const port = process.env.PORT || 7000;
// app.options("*", cors()); //

app.use(express.json());

app.use("/api", accountRoute);
app.get("/", (req, res) => {
  res.send({ message: "working" });
});

app.listen(port, () => {
  console.log("server runing");
});
