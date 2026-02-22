const mongoose = require('mongoose');


const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Ledger account is required"],
        index: true,
        immutable: true,
    },
    amount: {
        type: Number,
        required: [true, "Ledger amount is required"],
        immutable: true,
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Ledger transaction is required"],
        index: true,
        immutable: true,
    },
    type: {
        type: String,
        enum: {
            values: ["DEBIT", "CREDIT"],
            message: "Ledger type must be either DEBIT or CREDIT",
        },
        required: [true, "Ledger type is required"],
        immutable: true,
    }
})

function preventLedgerModification() {
    throw new Error("Ledger entries cannot be modified or deleted");
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("updateOne",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);
ledgerSchema.pre("findOneAndRemove",preventLedgerModification);
ledgerSchema.pre("remove",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);
ledgerSchema.pre("replaceOne",preventLedgerModification);
ledgerSchema.pre("update",preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;