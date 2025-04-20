import Markdown from '@/components/markdown'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

const refundPolicy = `
Thank you for using GPIC's credit recharge service. 

This Refund Policy outlines the circumstances under which you may be eligible for a refund and the refund process.

### Refundable Circumstances

You may be eligible for a refund of your credit recharge in the following situations:

Failed Recharge: If you have completed the payment but the credits were not successfully added to your GPIC account, and the issue cannot be resolved within a reasonable timeframe.

Duplicate Recharge: If you have made an accidental duplicate recharge due to a system error or other reasons.

Significant Service Malfunction: If the GPIC service experiences a persistent and significant malfunction that prevents you from normally using the recharged credits within a reasonable timeframe.

Other Special Circumstances: GPIC may consider other refund requests on a case-by-case basis at its discretion.

### Non-Refundable Circumstances

Refunds are typically not provided in the following situations:

Credits Already Used: Once you have used the recharged credits to consume GPIC's image stylization services, refunds will not be granted.

Dissatisfaction with Generation Results: Due to the subjective nature of image stylization results, refunds will not be provided if you are dissatisfied with the final generated images. We encourage you to fully understand the service's features and expected outcomes before making a purchase.

User Error: For example, if you mistakenly recharged an unintended amount.

Expired Request Period: You must submit your refund request within [Please insert the specific timeframe for refund requests, e.g., 7 days] after the recharge. Requests submitted after this period will not be accepted.

### Refund Request Process

To request a refund, please follow these steps:

Contact Us: Email our customer support team at [${ADMIN_EMAIL}](mailto:${ADMIN_EMAIL}) with the following information:

- Your GPIC username or registered email address.

- The recharge date and amount.

- A detailed explanation of the reason for the refund request, along with any relevant screenshots or evidence.

- Your payment receipt or order number.

Review and Processing: Our customer support team will review your request within  3-5 business days of receipt. We will assess your situation and make a decision based on this Refund Policy.

Refund Method: If your refund request is approved, we will process the refund through your original payment method. The time it takes for the refund to appear in your account may vary depending on the payment channel and typically takes 5-10 business days.


### Other Notes

GPIC reserves the right to modify this Refund Policy at any time without prior notice. Any changes will be effective upon posting on our website.

If you have any questions regarding this Refund Policy, please feel free to contact our customer support team [${ADMIN_EMAIL}](mailto:${ADMIN_EMAIL}).

Thank you for your understanding and cooperation.
`

export default function Page() {
  return <div className={'flex flex-col items-center w-full px-4 lg:px-8'}>
    <div className={'text-3xl font-black py-10'}>Refund Policy</div>
    <Markdown content={refundPolicy}/>
  </div>
}