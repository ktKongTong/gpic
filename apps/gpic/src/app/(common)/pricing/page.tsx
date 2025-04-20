import React from 'react';
import { CheckIcon } from 'lucide-react';
interface PricingTier {
  name: string;
  price: string;
  credits: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  href: string;
}
const PADDLE_PRICE_ID_LEVEL_1 = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_LEVEL_1 as string
const PADDLE_PRICE_ID_LEVEL_2 = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_LEVEL_2 as string
const PADDLE_PRICE_ID_LEVEL_3 = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_LEVEL_3 as string



const tiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    credits: '10 credits',
    features: [
      '10 credits',
      'Limited quality',
      'No watermark',
      'Points never expire'
    ],
    buttonText: 'Free',
    href: '/',
  },
  {
    name: 'Pay as you go',
    price: '$3',
    credits: '200 credits',
    features: [
      '200 credits ≈ 40 images',
      'HD quality',
      'Batch processing',
      'Task retry',
      'Real-time task status',
      'Credits never expire',
      '24/7 customer support',
    ],
    buttonText: 'Buy Now',
    isPopular: true,
    href: `/buy?priceId=${PADDLE_PRICE_ID_LEVEL_1}`,
  },
  {
    name: 'Pay as you go',
    price: '$10',
    credits: '600 credits',
    features: [
      '600 credits ≈ 120 images',
      'HD quality',
      'Batch processing',
      'Task retry',
      'Real-time task status',
      'Credits never expire',
      '24/7 customer support',
    ],
    buttonText: 'Buy Now',
    href: `/buy?priceId=${PADDLE_PRICE_ID_LEVEL_2}`,
  },
];

const PricingPage = () => {
  return (
      <div className="relative max-w-7xl mx-auto m-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Pricing
          </h1>
          <p className="mt-4 text-xl ">
            Choose the plan that best fits your needs.
          </p>

        <p className="mt-2 text-center text-sm">
          1 image = 5 credits
        </p>
        </div>
        <div className="grid grid-cols-1 p-4 gap-8 md:grid-cols-3 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name + tier.price}
              className={`relative rounded-2xl border p-8 shadow-lg ${
                tier.isPopular
                  ? 'border-primary ring-2 ring-primary'
                  : 'border'
              } bg-white/60 backdrop-blur-lg`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-4 -translate-y-1/2 transform">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary text-white">
                    最受欢迎
                  </span>
                </div>
              )}
              <h2 className="text-lg font-semibold leading-6 text-gray-900">
                {tier.name}
              </h2>
              <p className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {tier.price}
                </span>
                <span className="ml-2 text-base font-medium text-gray-500">
                  {tier.credits}
                </span>
              </p>
              <ul role="list" className="mt-6 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-3">
                    <CheckIcon
                      className="h-5 w-5 flex-shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                className={`mt-8 block w-full rounded-md py-2 px-4 text-center text-sm font-semibold ${
                  tier.isPopular
                    ? 'bg-primary text-white hover:bg-primary'
                    : ' text-white border border-primary hover:bg-white/50'
                }`}
              >
                {tier.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>

  );
};

export default PricingPage;