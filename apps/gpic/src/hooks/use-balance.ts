import {queryKeys} from "@/lib/query";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api";

export const useBalance = () => {
  const {data, isLoading} = useQuery({
    queryKey: queryKeys.balance,
    queryFn: async () => {
      const res = await api.getBalance()
      return res
    },
  })
  return {
    balance: data ?? { balance: 0 },
    isLoading: isLoading,
  }
}