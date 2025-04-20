import Markdown from '@/components/markdown'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

const tos = `

Effective Date: April 18, 2025

Welcome to [GPIC](https://gpic.ink/). By using our website and services, you agree to the following terms and conditions.

#### Description of Service

GPIC is a service that utilizes advanced artificial intelligence models,
including but not limited to GPT-4o, Gemini-2.0-Flash, and other powerful models,
to help users create images.
Users can generate unique images by inputting prompts and other instructions.

#### Ownership

When you create images using GPIC, all associated prompts and the generated image are the property of GPIC.
While you retain the rights to use the final images generated through the GPIC service.

#### User Data

To provide and improve our services, we may collect the following data:

- Username
- Email address
- Payment information(Please note that sensitive payment information will be processed by our payment service provider, Paddle, and GPIC will not store complete credit card or payment account details.)

We may use technologies such as web cookies to collect non-personal data, such as your IP address, device information, browser type, and website usage patterns, to optimize your user experience and improve our services.

For more information, please refer to our [Privacy Policy](/about/privacy).

#### Acceptable Use

You agree to abide by the following rules when using our service:

- You will not use the service in any unlawful, infringing, fraudulent, malicious, or unauthorized manner.
- You will not attempt to access any part of the service, its servers, or networks through any unauthorized means.
- You must comply with all applicable laws and regulations when using GPIC.
- You are solely responsible for the content you upload to GPIC (such as prompts) and the images you generate using GPIC, and you warrant that this content does not infringe upon the intellectual property rights or other legitimate rights of any third party.
- You are prohibited from uploading and generating any content that violates laws and regulations, social ethics, or contains inappropriate information such as obscenity, defamation, or violence.

#### Termination

We reserve the right to suspend or terminate your access to the service at any time for any reason, including but not limited to your breach of these Terms of Service, without prior notice.

#### Changes to Terms

We may update these Terms of Service from time to time. Any changes will be effective upon posting on the GPIC website. Your continued use of the service after such changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms of Service periodically for updates.

#### Governing Law

These Terms of Service shall be governed by and construed in accordance with the laws of China, without regard to its conflict of law principles. Any dispute arising out of or relating to these Terms of Service or the service shall be resolved through amicable negotiation. If negotiation fails, the dispute shall be submitted to the competent courts in China for litigation

#### Contact

If you have any questions about these Terms, please contact us at: [${ADMIN_EMAIL}](mailto:${ADMIN_EMAIL})

Thank you for using GPIC.
`

export default function Page() {
  return <div className={'flex flex-col items-center w-full px-4 lg:px-8'}>
    <div className={'text-3xl font-black py-10'}>Terms of Service</div>
    <Markdown content={tos}/>
  </div>
}