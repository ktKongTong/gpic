'use client'
import { usePaddleCheckout } from "@/hooks/use-paddle-checkout";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {paddle, handleCheckout} = usePaddleCheckout()
    useEffect(() => {
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
      }, [paddle?.Checkout, searchParams]);
    return <p>Preparing checkout...</p>
}