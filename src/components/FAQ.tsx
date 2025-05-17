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
      color: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    },
    {
      question: "How long does the assessment take?",
      answer:
        "The assessment only takes a few minutes to complete, and the results are available immediately.",
      color: "bg-indigo-500 text-white hover:bg-indigo-600",
    },
    {
      question: "Can I consult about my assessment results?",
      answer:
        "Yes. You can use the AI Chat feature for career discussions and to interpret your assessment results.",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    },
    {
      question: "How does FitWork help me find the right job?",
      answer:
        "FitWork matches your personal values with a company's EVP and recommends workplaces that align best with your profile.",
      color: "bg-indigo-500 text-white hover:bg-indigo-600",
    },
  ];

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Find answers to common questions about FitWork
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="mb-5 rounded-2xl shadow-md overflow-hidden"
              >
                <AccordionTrigger
                  className={`${item.color} px-6 py-5 text-lg font-semibold`}
                  iconColor={item.color.includes("indigo") ? "text-white" : "text-gray-700"}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-5 bg-white text-gray-700 text-base">
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
