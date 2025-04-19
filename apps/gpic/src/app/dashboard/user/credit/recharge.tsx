import { usePaddleCheckout } from '@/hooks/use-paddle-checkout';
import { Label } from '@/components/ui/label';
import { PendableButton } from '@/components/pendable-button';
import { useRouter } from 'next/navigation';

export const Recharge = () => {
  const router = useRouter()
  const { paddle, isLoading, handleCheckout, prices } = usePaddleCheckout();
  // const prices = [] as any
  // const isLoading = true
  const paddleOk = false

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        { paddleOk && prices?.map((option) => (
          <div key={option.id} className='border rounded-xl p-2 space-y-2'>
            <Label className='text-xl'>{option.credits} Credits</Label>
            <div className='flex w-full items-center justify-between'>
            <p className="text-lg font-bold">{option.price}</p>
            <PendableButton
                pending={isLoading}
                onClick={() => {
                  handleCheckout(option.paddleId)
                }}
                disabled={isLoading}
                size={'sm'}
                className="w-fit min-w-14"
              >Buy</PendableButton>
            </div>

          </div>
        ))}
        {
          !paddleOk && <div className={'text-xl flex justify-center items-center w-full min-h-32'}>
                Coming Soon
            </div>
        }
      </div>
  );
};