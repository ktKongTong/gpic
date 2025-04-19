'use client'
import { usePaddleCheckout } from "@/hooks/use-paddle-checkout";
import { useSession } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import {Suspense, useEffect} from "react";
import { toast } from "sonner";

export default function P() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Page/>
  </Suspense>
}

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {data: session} = useSession();
  const {paddle, handleCheckout} = usePaddleCheckout()
  useEffect(() => {

    toast.info("Payment method not prepared yet.")
    router.push('/')
    if(!session) {
      // router.push('/?sign-in=true')
      return
    }
    if(!session.user.emailVerified) {
      toast.error("please verify email first")
      router.push('/')
      return
    }
    let priceId = searchParams.get('priceId');
    if (priceId) {
      handleCheckout(priceId);
      return;
    }
    router.push('/');
  }, [paddle?.Checkout, searchParams,session]);
  return <p>Preparing ...</p>
}
