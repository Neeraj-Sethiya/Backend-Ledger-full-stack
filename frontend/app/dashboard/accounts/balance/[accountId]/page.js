"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "../../../../../lib/api";
import Link from "next/link";

export default function AccountBalancePage() {
  const params = useParams();
  const accountId = params.accountId;

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBalance() {
      try {
        setLoading(true);

        const data = await apiRequest(
          `/api/accounts/balance/${accountId}`,
          "GET",
        );

        setBalance(data.balance ?? data);
        setError("");
      } catch (err) {
        setError("Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    }

    if (accountId) {
      fetchBalance();
    }
  }, [accountId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium">Loading balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Account Balance</h2>

        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-gray-500">Account ID</p>
            <p className="text-xs break-all text-gray-400">{accountId}</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">₹ {balance}</p>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <Link
              href="/dashboard/accounts"
              className="text-blue-600 hover:underline"
            >
              ← Back to Accounts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
