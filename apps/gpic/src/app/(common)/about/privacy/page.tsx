import Markdown from "@/components/markdown";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

const privacy = `
#### Effective Date: March 29, 2025

Welcome to GPIC (https://gpic.ink/). This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services.

### Information We Collect

To provide and improve our services, we may collect the following types of information:

#### Information You Provide to Us:

- Registration Information: When you register for a GPIC account, we may collect your name and email address.

- Payment Information: When you make a credit recharge, we collect necessary payment information to process the transaction. Please note that sensitive payment information is handled by our payment service provider, Paddle, and GPIC does not store complete credit card or payment account details.

- User Content: The images you upload and the prompts you input while using the GPIC service.

- Contact Information: If you contact us via email or other means, we may collect your name, email address, and any other information you provide in your communication.

#### Information We Collect Automatically:

- IP Address: Your Internet Protocol (IP) address.

- Device Information: Your device type, operating system, browser type, and version.

- Usage Data: Information about how you use our website and services, such as the pages you visit, the time you spend, and the features you use.

- Cookies and Similar Technologies: We may use cookies and other similar technologies to collect information to enhance your user experience, authenticate you, analyze website traffic and usage patterns. You can manage your browser settings to control the use of cookies.


### How We Use Your Information

We may use the collected information for the following purposes:

- To Provide and Maintain the Service: Including processing your image stylization requests, managing your credit balance, processing recharges, and providing technical support.   

- To Improve the Service: Analyzing user behavior and feedback to optimize our website, services, and user experience.

- To Personalize Your Experience: Providing you with more relevant services and content based on your usage preferences and history.

- For Security Purposes: Protecting our website and services from fraud, unauthorized access, and other illegal activities.

- To Communicate with You: Responding to your inquiries, sending service updates, notifications, and promotional information (if you have consented to receive such information).

- For Legal Compliance: Complying with applicable laws, regulations, and legal processes.

### How We Store and Protect Your Information

We take reasonable security measures to protect your personal information from unauthorized access, use, disclosure, alteration, or destruction. These measures include but are not limited to data encryption, firewalls, and secure servers. We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy and as required by applicable laws and regulations.


### How We Share Your Information

We will not sell, rent, or trade your personal information to third parties except in the following limited circumstances:

- Service Providers: We may share necessary information with third-party service providers who assist us in providing our services, such as our payment processor Paddle and website analytics providers. These service providers are authorized to use your information only as necessary to perform specific tasks on our behalf and are obligated to protect your information.

- Legal Requirements: We may disclose your personal information if required to do so by law, court order, or other legal processes.

- With Your Consent: We may share your information with third parties with your explicit consent.

### Your Rights

Depending on your location and applicable law, you may have the following rights regarding your personal information:

- Right to Access: You have the right to request access to the personal information we hold about you.
- Right to Rectification: You have the right to request that we correct any inaccurate or incomplete personal information we hold about you. 
- Right to Erasure: In certain circumstances, you have the right to request that we delete your personal information. 
- Right to Restriction of Processing: In certain circumstances, you have the right to request that we restrict the processing of your personal information. 
- Right to Data Portability: In certain circumstances, you have the right to receive your personal information in a structured, commonly used, and machine-readable format and to transmit it to another controller. 
- Right to Withdraw Consent: If we are processing your personal information based on your consent, you have the right to withdraw your consent at any time. 

To exercise these rights, please contact us at [email address removed]. We may require you to provide proof of identity to process your request.

### Children's Privacy

Our services are not directed towards children. If we become aware that 
we have inadvertently collected personal information from a child under
16 without verifiable parental consent, we will take steps to delete such information as soon as possible. 

### Updates to this Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our information practices.
Any changes will be effective upon posting the revised Privacy Policy on our website with an updated effective date. 
We encourage you to review this Privacy Policy periodically for any updates

### Policy Updates
If we make changes to this Privacy Policy, we will notify you via email.

### Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us with [${ADMIN_EMAIL}](mailto:${ADMIN_EMAIL})

Thank you for trusting GPIC.
`

export default function Page() {
  return <div className={'flex flex-col w-full items-center px-4 lg:px-8'}>
    <div className={'text-3xl font-black p-10'}>Privacy Policy</div>
    <Markdown content={privacy}/>
  </div>
}