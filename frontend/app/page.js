"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-3xl text-center">

        <h1 className="text-4xl font-bold mb-6">
          Bank Ledger
        </h1>

        <p className="text-gray-600 text-lg mb-10">
          Securely manage your accounts, track transactions, and monitor balances in one place.
        </p>

        {!isLoggedIn ? (
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Register
            </Link>
          </div>
        ) : (
          <div>
            <Link
              href="/dashboard"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
