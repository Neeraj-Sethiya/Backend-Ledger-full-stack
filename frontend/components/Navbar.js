"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="bg-black text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          Bank Ledger
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-gray-300 transition">
            Home
          </Link>

          {!isLoggedIn && (
            <>
              <Link href="/auth/login" className="hover:text-gray-300 transition">
                Login
              </Link>
              <Link href="/auth/register" className="hover:text-gray-300 transition">
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link href="/dashboard" className="hover:text-gray-300 transition">
                Dashboard
              </Link>
              <Link
                href="/auth/logout"
                className="text-red-400 hover:text-red-300 transition"
              >
                Logout
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
