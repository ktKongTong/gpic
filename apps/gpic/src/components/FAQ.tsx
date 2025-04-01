import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqItems = [
    {
      question: "How does the image enhancement work?",
      answer: "Our image enhancement uses advanced AI algorithms to analyze your image and make smart adjustments to lighting, color balance, and sharpness. The AI recognizes elements in your photo and optimizes them specifically for the best visual impact."
    },
    {
      question: "What image formats are supported?",
      answer: "We support most common image formats including JPEG, PNG, WebP, and HEIC. Our system automatically converts your images to the optimal format for processing while maintaining the highest quality possible."
    },
    {
      question: "Are my images stored on your servers?",
      answer: "Your privacy is important to us. Your images are processed securely and are not permanently stored on our servers. After processing is complete, your original and enhanced images are automatically deleted from our system within 24 hours."
    },
    {
      question: "Can I use the enhanced images commercially?",
      answer: "Yes! Once you've enhanced your images with our tool, you retain all rights to your transformed images. You're free to use them for personal or commercial purposes without any attribution requirements."
    },
    {
      question: "Is there a limit to how many images I can enhance?",
      answer: "Free accounts can enhance up to 10 images per day. Premium subscribers enjoy unlimited image enhancements and access to our advanced transformation filters and effects."
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/20 last:border-0">
          <AccordionTrigger className="text-white hover:text-white/80 text-left py-4">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-white/80">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQ;
