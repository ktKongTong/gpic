'use client'
import { usePaddleCheckout } from "@/hooks/use-paddle-checkout";
import { useSession } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import {Suspense, useEffect } from "react";
import { toast } from "sonner";


function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {data: session} = useSession();
    const {paddle, handleCheckout} = usePaddleCheckout()
    useEffect(() => {
      if(!session) {
        return
      }
      if(!session.user.emailVerified) {
        toast.error("please verify email first")
        return
      }
        let transactionId = searchParams.get('_ptxn');
        if (transactionId) {
          paddle?.Checkout.open({
            settings: {
              allowLogout: false,
            },
            transactionId,
          });
          return;
        }
        let priceId = searchParams.get('priceId');    
        if (priceId) {
          handleCheckout(priceId);
          return;
        }
        router.push('/');
      }, [paddle?.Checkout, searchParams,session]);
    return <p>Preparing checkout...</p>
}

export default function P() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Page/>
  </Suspense>
}