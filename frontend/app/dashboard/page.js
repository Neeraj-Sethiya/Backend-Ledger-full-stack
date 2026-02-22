"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [isSystemUser, setIsSystemUser] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("systemUser");
    setIsSystemUser(role === "true");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

        <div className="grid sm:grid-cols-2 gap-6">

          <DashboardCard
            title="View Accounts"
            description="Check all your bank accounts"
            href="/dashboard/accounts"
          />

          <DashboardCard
            title="Create Account"
            description="Open a new bank account"
            href="/dashboard/accounts/create"
          />

          <DashboardCard
            title="Send Money"
            description="Transfer funds securely"
            href="/dashboard/transactions"
          />

          {isSystemUser && (
            <DashboardCard
              title="Admin: Initial Funds"
              description="Add system-level funds"
              href="/dashboard/transactions/system/initial-funds"
              admin
            />
          )}

          <DashboardCard
            title="Logout"
            description="Sign out of your account"
            href="/auth/logout"
            danger
          />

        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, description, href, admin, danger }) {
  return (
    <Link
      href={href}
      className={`p-6 rounded-xl shadow bg-white hover:shadow-md transition block 
        ${admin ? "border-l-4 border-green-500" : ""} 
        ${danger ? "border-l-4 border-red-500" : ""}`}
    >
      <h3
        className={`text-lg font-semibold ${
          danger ? "text-red-600" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </Link>
  );
}
