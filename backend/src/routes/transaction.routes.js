const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");

const transactionRouter = Router();

transactionRouter.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);

transactionRouter.post(
  "/system/initial-funds",
  authMiddleware.authMiddlewareSystemUser,
  transactionController.createInitialFundTransaction,
);

transactionRouter.get(
  "/system/check",
  authMiddleware.authMiddlewareSystemUser,
  transactionController.checkSystemUser,
);

module.exports = transactionRouter;
