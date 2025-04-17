import {queryKeys} from "@/lib/query";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api";

export const useBalance = () => {
  const {data, isLoading, ...rest} = useQuery({
    queryKey: queryKeys.balance,
    queryFn: async () => {
      const res = await api.getBalance()
      return res?.balance
    }
  })
  return {
    balance: data ?? 0,
    isLoading: isLoading,
    ...rest
  }
}