import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight, BarChart3, LineChart, MessageSquare } from "lucide-react";
import FAQ from "@/components/FAQ";
import Footer from "@/components/FooterLanding";
import NavbarLanding from "@/components/NavbarLanding";

function LandingPage() {
  const location = useLocation();

  // Scroll ke elemen yang ditentukan jika ada state scrollTo
  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.querySelector(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // delay agar DOM siap
      }
    }
  }, [location]);

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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarLanding />
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
            <Button className="bg-[#6366F1] hover:bg-[#6366F1] text-white flex items-center">
              Start <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <div className="bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
              <p className="text-gray-300">Hero Image</p>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-md flex items-center space-x-3">
              <div className="bg-[#6366F1] rounded-full p-2">
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
      <section className="py-16" id="feature">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {featureCards.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="bg-[#6366F1] p-6 rounded-t-lg">
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
      <section id="how" className="py-16 bg-gray-50">
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
                className="border-0 shadow-sm bg-[#6366F1] text-white"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center mb-4">
                      <span className="text-[#6366F1]">{step.number}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-blue-100 text-sm">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - pastikan ID ada di sini */}
      <section id="faq">
        <FAQ />
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
