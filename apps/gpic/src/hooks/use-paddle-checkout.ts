import { api } from '@/lib/api';
import { useSession } from '@/lib/auth';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PaddleCheckoutData {
  checkoutUrl?: string;
  checkoutId?: string;
}

const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN as string
const PADDLE_ENV: 'production' | 'sandbox' = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as any

const PADDLE_PRICE_ID_LEVEL_1 = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_LEVEL_1 as string
const PADDLE_PRICE_ID_LEVEL_2 = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_LEVEL_2 as string
const PADDLE_PRICE_ID_LEVEL_3 = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_LEVEL_3 as string

const priceItems = [
  { priceId: PADDLE_PRICE_ID_LEVEL_1, quantity: 1 },
  { priceId: PADDLE_PRICE_ID_LEVEL_2, quantity: 1 },
  { priceId: PADDLE_PRICE_ID_LEVEL_3, quantity: 1 },
]

// console.log("priceItems", priceItems)
// {
//   id: it.price.id,
//     paddleId: it.price.id,
//   credits: it.price.customData!['credit'] as any,
//   price: `${it.formattedTotals.total}`,
//   description: it.price.description
// }
type Price = {
  id: string,
  paddleId: string,
  credits: any,
  price: string,
  description: string
}

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

  const { data: session } = useSession();

  const { data: prices } = useQuery({
    queryKey: ['paddle', 'price'],
    queryFn: async () => {
      // const res= await paddle!.PricePreview({items: priceItems})
      // const prices = res.data.details.lineItems
      // return prices.map(it=> ({
      //   id: it.price.id,
      //   paddleId: it.price.id,
      //   credits: it.price.customData!['credit'] as any,
      //   price: `${it.formattedTotals.total}`,
      //   description: it.price.description
      // }))
      return [] as Price[]
    },
    enabled: !!paddle
  })

  const mutation = useMutation({
    mutationKey: ['order', 'recharge'],
    mutationFn: async (priceId: string) => {
      return api.createRechargeOrder(priceId)
    }
  })

  const handleCheckout = async (priceId: string) => {
    if(!(session?.user.emailVerified && session.user.email)){
        toast.error('please verify your email first')
        return
    }
    if (!paddle) {
      console.error('Paddle is not initialized yet.');
      return;
    }
    const res = await mutation.mutateAsync(priceId)

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
        orderId: res.id,
        ipAddress: session.session.ipAddress
      },
    });
  };
  
  const handleWrapper = async (priceId: string) => {
    handleCheckout(priceId).catch(e => {
      toast.error(e)
    })
  }

  return {
    handleCheckout: handleWrapper,
    isLoading,
    prices,
    paddle,
  };
}