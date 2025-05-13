import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

function FAQ() {
  const faqItems = [
    {
      question: "What do I need to start the assessment?",
      answer:
        "Just create an account and complete your work culture profile — the system will automatically begin the assessment process.",
    },
    {
      question: "How long does the assessment take?",
      answer:
        "The assessment only takes a few minutes to complete, and the results are available immediately.",
    },
    {
      question: "Can I consult about my assessment results?",
      answer:
        "Yes. You can use the AI Chat feature for career discussions and to interpret your assessment results.",
    },
    {
      question: "How does FitWork help me find the right job?",
      answer:
        "FitWork matches your personal values with a company's EVP and recommends workplaces that align best with your profile.",
    },
  ];

  // ✅ Tambahkan 'return' untuk mengembalikan JSX
  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Find answers to common questions about FitWork
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-md overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 bg-gray-100 hover:bg-gray-200">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-white">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
