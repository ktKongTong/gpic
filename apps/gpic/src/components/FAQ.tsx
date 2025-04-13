import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const faqItems = [
  {
    question: "What is GPIC? How does it work?",
    answer: "GPIC is an AI-powered tool that uses the most advanced image generation technology to transform your photos into different styles. It analyzes your images and applies an artistic style while preserving important details."
  },
  {
    question: "Which kind of images can I convert?",
    answer: "You can convert most type of image - animation, portrait, landscape. Advanced AI models can effectively process various types of pictures.",
  },
  {
    question: "Why is the generation slow?",
    answer: "Due to the distribution of the number of users and limited server resources, the generation may take some time, usually completed within 5 minutes."
  },
  {
    question: "What AI model is used?",
    answer: "We use the latest GPT-4o model, one of the most advanced AI techniques currently available, capable of generating high-quality stylized images."
  },
  {
    question: "How to get the best results?",
    answer: "For best results, use a high-quality input image. Our live preview feature helps you find the perfect balance."
  }
];

const FAQ = () => {

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
