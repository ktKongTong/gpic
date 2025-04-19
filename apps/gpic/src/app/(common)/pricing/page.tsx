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

const tiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    credits: '10 credits',
    features: ['10 积分', '有限质量', '无水印', '积分永不过期'],
    buttonText: '免费试用',
    href: '/signup',
  },
  {
    name: 'Pay as you go',
    price: '$10',
    credits: '300 credits',
    features: [
      '300 积分 ≈ 60 张图片',
      '高清质量',
      '批量处理',
      '任务重试',
      '实时任务状态',
      '积分永不过期',
      '24/7客户支持',
    ],
    buttonText: '立即购买',
    isPopular: true,
    href: '/buy?plan=10',
  },
  {
    name: 'Pay as you go',
    price: '$10',
    credits: '1000 credits',
    features: [
      '1000 积分 ≈ 200 张图片',
      '高清质量',
      '批量处理',
      '任务重试',
      '实时任务状态',
      '积分永不过期',
      '24/7客户支持',
    ],
    buttonText: '立即购买',
    href: '/buy?plan=20',
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