import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { ArrowRight, BarChart3, LineChart, MessageSquare } from "lucide-react";

function App() {
  const navLinks = [
    { name: "About", href: "#" },
    { name: "Features", href: "#" },
    { name: "How it Works", href: "#" },
    { name: "FAQ", href: "#" },
  ];

  // Feature cards data
  const featureCards = [
    {
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      title: "EVP-Based Assessment",
      description:
        "Comprehensive assessment based on Employee Value Proposition metrics",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      title: "AI Career Consultation",
      description: "Get AI-powered career guidance and consultation",
    },
    {
      icon: <LineChart className="h-6 w-6 text-white" />,
      title: "Assessment Comparison",
      description:
        "Compare your culture assessment results across different parameters",
    },
  ];

  // Steps data
  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description:
        "Sign up and tell us about your values, work preferences, and career goals.",
    },
    {
      number: 2,
      title: "Take the Culture Fit Assessment",
      description:
        "This AI assessment measures you against the Employee Value Proposition (EVP).",
    },
    {
      number: 3,
      title: "Get Results and Job Recommendations",
      description:
        "Receive a culture fit score and a list of jobs that match well with your profile.",
    },
  ];

  // FAQ data
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="w-full bg-blue-900 text-white">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="text-xl font-bold">FitWork</div>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm hover:text-blue-200"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="link" className="text-white">
              Login
            </Button>
            <Button
              variant="outline"
              className="bg-white text-blue-900 hover:bg-blue-50"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Find Your Work Culture Fit With FitWork
            </h1>
            <p className="text-gray-600">
              AI-based automated assessment to find workplaces that match your
              values and personality.
            </p>
            <Button className="bg-blue-900 hover:bg-blue-800 text-white flex items-center">
              Start <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <div className="bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
              <p className="text-gray-300">Hero Image</p>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-md flex items-center space-x-3">
              <div className="bg-blue-900 rounded-full p-2">
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              </div>
              <div>
                <p className="font-bold text-blue-900">85% Match</p>
                <p className="text-sm text-gray-500">with Company Culture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {featureCards.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="bg-blue-800 p-6 rounded-t-lg">
                    {feature.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            How FitWork Works
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Begin your path to a fulfilling career by discovering where you
            truly belong
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <Card
                key={step.number}
                className="border-0 shadow-sm bg-blue-900 text-white"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="bg-blue-800 rounded-full h-10 w-10 flex items-center justify-center mb-4">
                      <span>{step.number}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-blue-100 text-sm">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
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

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">FitWork</h3>
              <p className="text-sm text-blue-200">
                Career assessment platform powered by AI
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-200 hover:text-white"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-200 hover:text-white"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-200 hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-200 hover:text-white"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-200 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-blue-200 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-blue-200 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App
