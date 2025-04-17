'use client'
import { QueryClientProvider } from "@tanstack/react-query";
import {LocaleProvider} from "@/i18n";
import {queryClient} from "@/lib/query";

export default function Providers({children}: {children: React.ReactNode}) {
  return <>
    <LocaleProvider>
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
    </LocaleProvider>
  </>
}