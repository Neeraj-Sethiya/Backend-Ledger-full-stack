"use client";

import { useState } from "react";
import { apiRequest } from "../../../lib/api";
import { v7 as uuidv7 } from "uuid";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
  });

  const handleTransaction = async () => {
    if (!form.fromAccount || !form.toAccount || !form.amount) {
      alert("Please fill all fields");
      return;
    }

    if (Number(form.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      // Generate unique idempotency key
      const idempotencyKey = uuidv7();

      const data = await apiRequest("/api/transactions", "POST", {
        fromAccount: form.fromAccount,
        toAccount: form.toAccount,
        amount: Number(form.amount),
        idempotencyKey: idempotencyKey,
      });

      if (data.message || data.transaction) {
        alert("Transaction successful!");
        setForm({
          fromAccount: "",
          toAccount: "",
          amount: "",
        });
      } else {
        alert(data.message || "Transaction failed");
      }
    } catch (error) {
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Send Money
        </h2>

        <div className="space-y-5">

          {/* From Account */}
          <div>
            <label className="block text-sm font-medium mb-2">
              From Account
            </label>
            <input
              type="text"
              placeholder="Enter sender account ID"
              value={form.fromAccount}
              onChange={(e) =>
                setForm({ ...form, fromAccount: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* To Account */}
          <div>
            <label className="block text-sm font-medium mb-2">
              To Account
            </label>
            <input
              type="text"
              placeholder="Enter receiver account ID"
              value={form.toAccount}
              onChange={(e) =>
                setForm({ ...form, toAccount: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleTransaction}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Send"}
          </button>

        </div>
      </div>
    </div>
  );
}
