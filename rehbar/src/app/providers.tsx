"use client";

import { SessionProvider } from "next-auth/react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import QueryProvider from "@/providers/query_provider";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      <QueryProvider>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
