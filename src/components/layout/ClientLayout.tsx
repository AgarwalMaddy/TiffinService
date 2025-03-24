'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/layout/Navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navigation />
      <main className="flex-grow bg-white text-gray-800">{children}</main>
    </AuthProvider>
  );
} 
