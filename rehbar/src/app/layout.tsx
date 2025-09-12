"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import "./globals.css";
import QueryProvider from "@/providers/query_provider";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <QueryProvider>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
