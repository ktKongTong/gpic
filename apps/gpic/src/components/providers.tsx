'use client'
import {QueryCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {FileCtxProvider} from "@/hooks/use-file-upload";
import {toast} from "sonner";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      toast.error(error.message);
    }
  }),
  defaultOptions: {
    queries: {
      retry: false,
    }
  }
})
export default function Providers({children}: {children: React.ReactNode}) {
  return <>
      <QueryClientProvider client={queryClient}>
        <FileCtxProvider>
          {children}
        </FileCtxProvider>
      </QueryClientProvider>
  </>
}