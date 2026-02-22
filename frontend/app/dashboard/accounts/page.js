"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import Link from "next/link";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true);
        const data = await apiRequest("/api/accounts", "GET");
        setAccounts(data.accounts || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch accounts");
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium">Loading accounts...</p>
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
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Accounts</h2>

          <Link
            href="/dashboard/accounts/create"
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Create Account
          </Link>
        </div>

        {/* Empty State */}
        {accounts.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-gray-600">No accounts found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {accounts.map((acc) => (
              <div
                key={acc._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  
                  <div>
                    <p className="text-sm text-gray-500">Account ID</p>
                    <p className="text-xs break-all text-gray-400">
                      {acc._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">
                      {acc.status}
                    </p>
                  </div>

                </div>

                {/* Check Balance Button */}
                <div className="mt-6 border-t pt-4">
                  <Link
                    href={`/dashboard/accounts/balance/${acc._id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Check Balance
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
