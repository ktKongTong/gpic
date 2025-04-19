import Markdown from "@/components/markdown";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

const privacy = `
### Privacy Policy

#### Effective Date: March 29, 2025

At [GPIC](https://gpic.ink/), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information.

### Information We Collect
We collect the following personal information when you use our services:

- Name
- Email address
- Payment information

We also collect non-personal data through the use of web cookies to enhance your experience on our website.

#### Use of Information
We use your personal data solely for the purpose of processing orders.

### Data Sharing
We do not share your personal information with any third parties, except for necessary sharing with our large language model API providers to deliver our services.

### Children’s Privacy
We do not knowingly collect any personal information from children.

### Policy Updates
If we make changes to this Privacy Policy, we will notify you via email.

### Contact Us
If you have any questions or concerns about this policy, please contact us with [${ADMIN_EMAIL}](mailto:${ADMIN_EMAIL})

Thank you for trusting GPIC.
`

export default function Page() {
  return <div className={'flex flex-col w-full items-center px-4 lg:px-8'}>
    <div className={'text-3xl font-black p-10'}>Privacy Policy</div>
    <Markdown content={privacy}/>
  </div>
}