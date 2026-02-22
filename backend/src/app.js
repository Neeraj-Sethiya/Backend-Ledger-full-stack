
const express = require("express");
const cookieParser = require("cookie-parser");


const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");

const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001' , 'https://bank-ledger-six.vercel.app'], // Add your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Bank-Ledger API is running");
});


app.use("/api/auth/", authRouter);
app.use("/api/accounts/", accountRouter);
app.use("/api/transactions/", transactionRouter);

module.exports = app