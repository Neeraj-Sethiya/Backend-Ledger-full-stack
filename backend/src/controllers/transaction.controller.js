const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "From account, to account, amount and idempotency key are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      message: "From account or to account not found",
    });
  }

  const isTransactionAlreadyExist = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExist) {
    if (isTransactionAlreadyExist.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: isTransactionAlreadyExist,
      });
    }
    if (isTransactionAlreadyExist.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still pending",
      });
    }
    if (isTransactionAlreadyExist.status === "FAILED") {
      return res.status(200).json({
        message: "Transaction processing failed, try again",
      });
    }
    if (isTransactionAlreadyExist.status === "REVERSED") {
      return res.status(200).json({
        message: "Transaction was reversed, please try again",
      });
    }
  }

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "From account or to account is not active",
    });
  }

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Your current balance is ${balance}`,
    });
  }

  let transaction;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    // await (() => {
    //     return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    // })();

    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    return res.status(400).json({
      error: err.message,
      message: "Transaction is PENDING due to some error, please try again",
    });
  }

  transaction = await transactionModel.findById(transaction._id);

  await emailService.sendTransactionEmail({
    userEmail: req.user.email,
    name: req.user.name,
    fromAccount: fromUserAccount._id,
    toAccount: toUserAccount._id,
    amount,
    status: "COMPLETED",
  });

  res.status(201).json({
    message: "Transaction completed successfully",
    transaction,
  });
};

async function createInitialFundTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "To account, amount and idempotency key are required",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.status(404).json({
      message: "To account not found",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(404).json({
      message: "System account not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        type: "DEBIT",
        amount: amount,
        transaction: transaction._id,
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toUserAccount._id,
        type: "CREDIT",
        amount: amount,
        transaction: transaction._id,
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial fund transaction completed successfully",
    transaction,
  });
}

const checkSystemUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "System user confirmed",
      userId: req.user._id,
      systemUser: req.user.systemUser,
    });
  } catch (error) {
    console.error("System check error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTransaction,
  createInitialFundTransaction,
  checkSystemUser,
};
