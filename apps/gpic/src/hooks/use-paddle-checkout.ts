import { useSession } from '@/lib/auth';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PaddleCheckoutData {
  checkoutUrl?: string;
  checkoutId?: string;
}

const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN as string
const PADDLE_ENV: 'production' | 'sandbox' = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as any
export function usePaddleCheckout() {
  const router = useRouter();
  const [paddle, setPaddle] = useState<Paddle>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initializePaddle({
        environment: PADDLE_ENV,
        token: PADDLE_CLIENT_TOKEN,
        eventCallback(event) {
          switch (event.name) {
            case 'checkout.closed':
              router.push('/');
              break;
          }
        },
      }).then((paddleInstance) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
          console.log("Paddle.js initialized successfully.");
        } else {
            throw new Error("Paddle instance was not returned after loading.");
        }
      })
    .catch((err) => {
        toast.error("Payment system failed to load. Please try refreshing.");
    })
    .finally(() => {
        setIsLoading(false);
    });    
  }, []);

  const {data: session} = useSession();

  const handleCheckout = (priceId: string) => {
    if(!(session?.user.emailVerified && session.user.email)){
        toast.error('please verify your email first')
        return
    }
    if (!paddle) {
      console.error('Paddle is not initialized yet.');
      return;
    }
    paddle.Checkout.open({
      settings: {
        theme: 'light',
        locale: 'en',
      },
      items: [{ priceId: priceId, quantity: 1 }],
      customer: {
        email: session.user.email,
      },
      customData: {
        userId: session.user.id,
        ipAddress: session.session.ipAddress
      },
    });
  };
  return {
    handleCheckout,
    isLoading,
    paddle,
  };
}