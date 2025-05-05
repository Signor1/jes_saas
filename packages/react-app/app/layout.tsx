"use client";

import "@/styles/globals.css";

import { AppProvider } from "@/providers/AppProvider";
import { APIProvider } from "@/contexts/jes-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          <APIProvider>{children}</APIProvider>
        </AppProvider>
      </body>
    </html>
  );
}
