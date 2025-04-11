'use client'

import {useQuery, } from "@tanstack/react-query";
import {api} from "@/lib/api";

const useBalance = () => {

  const {data, isLoading} = useQuery({
    queryKey: ['balance'],
    queryFn: () => {
      return api.getBalance()
    }
  })

  return {
    data,
    isLoading,
  }
}

export default function Balance() {
  // const {data, isLoading} = useBalance()

  return <>
    <div className={'text-2xl font-semibold'}>Balance</div>
    <div className={' rounded-lg  backdrop-blur-2xl p-4 border'}>

      <div>累计消费：123 积分</div>
      <div>余额：123 积分</div>
    </div>
  </>

}