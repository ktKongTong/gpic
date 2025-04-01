'use client'
import {ThemeProvider} from "next-themes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {FileCtxProvider} from "@/hooks/use-file-upload";

const queryClient = new QueryClient()

export default function Providers({children}: {children: React.ReactNode}) {
  return <>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <FileCtxProvider>
          {children}
        </FileCtxProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </>
}