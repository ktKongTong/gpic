import Markdown from '@/components/markdown'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

const tos = `

Effective Date: April 18, 2025

Welcome to [GPIC](https://gpic.ink/). By using our website and services, you agree to the following terms and conditions.

#### Description of Service

GPIC allows users to create images with advanced ai model include GPT-4o, Gemini-2.0-Flash and other powerful model.

#### Ownership

When you create a site using GPIC, all associated prompts and the generated code belong to GPIC.

#### User Data

We collect personal data including:

- Name
- Email address
- Payment information

We also collect non-personal data through the use of web cookies to improve your experience.

For more information, please refer to our Privacy Policy.

#### Acceptable Use

You agree not to misuse the service or attempt to access it using unauthorized methods. You must comply with all applicable laws and regulations when using GPIC.

#### Termination

We reserve the right to suspend or terminate your access to the service at any time for any reason, including violation of these Terms.

#### Changes to Terms

We may update these Terms of Service from time to time. Continued use of the service after changes constitutes your acceptance of the new terms.

7. Governing Law
These terms are governed by the laws of China.

8. Contact
If you have any questions about these Terms, please contact us at: [${ADMIN_EMAIL}](mailto:${ADMIN_EMAIL})

Thank you for using GPIC.
`

export default function Page() {
  return <div className={'flex flex-col items-center w-full px-4 lg:px-8'}>
    <div className={'text-3xl font-black py-10'}>Terms of Service</div>
    <Markdown content={tos}/>
  </div>
}