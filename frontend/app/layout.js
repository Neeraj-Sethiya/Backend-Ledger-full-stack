import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
