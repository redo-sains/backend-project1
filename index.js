const express = require("express");
const { db } = require("./firebase.config");
const { collection, addDoc } = require("firebase/firestore");
const accountRoute = require("./routers/account.router");

const cors = require("cors");
const app = express();

// app.options("*", cors()); //

app.use(express.json());

app.use("/api", accountRoute);

app.listen(7000, () => {
  console.log("server runing");
});
