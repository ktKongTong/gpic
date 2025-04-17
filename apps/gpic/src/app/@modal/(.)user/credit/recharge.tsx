import { usePaddleCheckout } from '@/hooks/use-paddle-checkout';
import { Label } from '@/components/ui/label';
import { PendableButton } from '@/components/pendable-button';
import { useQuery } from '@tanstack/react-query';

// 定义价格选项的接口
interface PriceOption {
  id: string;
  paddleId: string;
  credits: number;
  price: string;
  description: string;
}


export const Recharge = () => {
  const {data: priceOptions} = useQuery({
    queryKey: ['user', 'credit', 'price'],
    queryFn: async () => {
      return [] as PriceOption[];
    }
  });
  
  const { paddle, isLoading, handleCheckout } = usePaddleCheckout();
  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {priceOptions?.map((option) => (
          <div key={option.id} className='border rounded-xl p-2 space-y-2'>
            <Label className='text-xl'>{option.credits} Credits</Label>
            <div className='flex w-full items-center justify-between'>
            <p className="text-lg font-bold">{option.price}</p>
            <PendableButton
                pending={isLoading}
                onClick={() => handleCheckout(option.id)}
                disabled={isLoading}
                size={'sm'}
                className="w-fit min-w-14"
              >Buy</PendableButton>
            </div>

          </div>
        ))}
      </div>
  );
};