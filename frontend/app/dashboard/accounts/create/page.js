"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../../lib/api";

export default function CreateAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [currency, setCurrency] = useState("INR");

  const handleCreateAccount = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/api/accounts", "POST", {
        currency,   // ✅ Only send what backend expects
      });

      if (data.account) {
        alert("Account created successfully!");
        router.push("/dashboard/accounts");
      } else {
        alert(data.message || "Failed to create account");
      }
    } catch (error) {
      alert("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Create New Account
        </h2>

        <div className="space-y-6">

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleCreateAccount}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </div>

      </div>
    </div>
  );
}
