"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../../../lib/api";
import { v7 as uuidv7 } from "uuid";

export default function InitialFundsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    toAccount: "",
    amount: "",
  });

  const handleCreateInitialFunds = async () => {
    if (!form.toAccount || !form.amount || Number(form.amount) <= 0) {
      alert("Please fill all fields with valid values");
      return;
    }

    try {
      setLoading(true);

      // ✅ Generate idempotency key
      const idempotencyKey = uuidv7();

      const data = await apiRequest(
        "/api/transactions/system/initial-funds",
        "POST",
        {
          toAccount: form.toAccount,     // ✅ match backend
          amount: Number(form.amount),   // ✅ convert to number
          idempotencyKey: idempotencyKey // ✅ required
        }
      );

      if (data.message || data.transaction || data.success) {
        alert("Initial funds added successfully!");
        setForm({ toAccount: "", amount: "" });
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (error) {
      alert("Failed to add initial funds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Add Initial Funds
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          (System Admin Action)
        </p>

        <div className="space-y-5">

          {/* Account ID */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Account ID
            </label>
            <input
              type="text"
              placeholder="Enter account ID"
              value={form.toAccount}
              onChange={(e) =>
                setForm({ ...form, toAccount: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleCreateInitialFunds}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Add Initial Funds"}
          </button>

        </div>
      </div>
    </div>
  );
}
