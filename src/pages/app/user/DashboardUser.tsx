import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ChatBotBox from "@/components/ChatBotBox";
import CompanyA from "@/assets/company-a.webp";
import CompanyB from "@/assets/company-b.webp";
import StartUser from "@/assets/StartUser.webp";
import { Link } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";

function DashboardUser() {
  const { username, fetchStatus, fetchUser, error } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (fetchStatus === "pending") {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <h1 className="text-2xl font-bold animate-pulse">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const assessmentCards = [
    {
      id: "company",
      title: "Company Culture Fit",
      description: "Evaluate your compatibility with company values",
      icon: <Building2 className="w-7 h-9" />,
      buttonText: "Get Started",
    },
  ];

  return (
    <>
      <main className="pt-20 px-6 w-full">
        {/* Welcome message */}
        <div className="text-center mb-10 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Welcome back, {username}!</h1>
        </div>

        {/* Assessment cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 max-w-7xl mx-auto">
          {assessmentCards.map((card) => (
            <Card key={card.id} className="w-[800px] shadow-sm">
              <CardContent className="p-6">
                <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center mb-6">
                  <img src={StartUser} alt="" className="w-full h-full object-cover"/>
                </div>
                <h2 className="text-base font-normal mb-2">{card.title}</h2>
                <p className="text-base font-normal text-neutral-600 mb-6">
                  {card.description}
                </p>
                <Link to="/app/u/assessment">
                  <Button className="w-full h-10 bg-indigo-700 hover:bg-indigo-800 rounded-lg cursor-pointer">
                    {card.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chatbot */}
        <div className="max-w-7xl mx-auto px-4">
          <ChatBotBox />
        </div>

        {/* Comparison Panel */}
        <div className="py-12 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-normal mb-4">Assessment Comparison</h2>
          <Card className="shadow-sm relative">
            <CardContent className="flex rounded-lg overflow-hidden relative">
              {/* Left Box */}
              <div className="relative flex flex-col items-center justify-center w-1/2 py-32 space-y-4 overflow-hidden">
                <img
                  src={CompanyB}
                  alt="Company B"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy" // Load with priority
                  fetchPriority="high" // Modern browsers use this for preload
                />
                <div className="absolute inset-0 bg-black opacity-60 w-full h-full"/>
                <Building2 className="w-6 h-6 text-white drop-shadow-lg z-10" />
              </div>

              {/* Right Box */}
              <div className="relative flex flex-col items-center justify-center w-1/2 py-32 space-y-4 overflow-hidden">
                <img
                  src={CompanyA}
                  alt="Company A"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-black opacity-60 w-full h-full" />
                <Building2 className="w-6 h-6 text-white drop-shadow-lg z-10" />
              </div>

              {/* Center Text */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 font-medium z-20">
                <div className="flex flex-col justify-center items-center mt-2 gap-12 text-white text-center">
                  <h2 className="text-2xl font-bold">
                    Compare your assessment with other company
                  </h2>
                  <Link to="/app/u/compare">
                    <Button className="h-9 w-40 bg-indigo-700 hover:bg-indigo-800 text-white text-sm cursor-pointer">
                      Start Comparing
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

export default DashboardUser;
