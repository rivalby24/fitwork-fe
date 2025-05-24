import { useEffect, useState } from "react";
import {
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { securedApi } from "@/lib/api";
import ChatBotBox from "@/components/ChatBotBox";
import CompanyA from "@/assets/company-a.jpg";
import CompanyB from "@/assets/company-b.jpg";
import { Link } from "react-router-dom";

function DashboardUser() {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await securedApi.get("http://127.0.0.1:8000/api/v1/me/");
        setUsername(res.data.username);
      } catch (error) {
        console.error("Failed to fetch user info", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
          {loading ? (
            <h1 className="text-3xl font-bold">Loading...</h1>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <h1 className="text-3xl font-bold">Welcome back, {username}!</h1>
          )}
        </div>

        {/* Assessment cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 max-w-7xl mx-auto">
          {assessmentCards.map((card) => (
            <Card key={card.id} className="w-[400px] shadow-sm">
              <CardContent className="p-6">
                <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center mb-6">
                  {card.icon}
                </div>
                <h2 className="text-base font-normal mb-2">{card.title}</h2>
                <p className="text-base font-normal text-neutral-600 mb-6">
                  {card.description}
                </p>
                <Button className="w-full h-10 bg-neutral-600 hover:bg-neutral-700 rounded-lg">
                  {card.buttonText}
                </Button>
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
              <div
                className="flex flex-col items-center justify-center w-1/2 py-32 space-y-4 bg-cover bg-white bg-center"
                style={{
                  backgroundImage: `url('${CompanyB}')`,
                  opacity: '90%'
                }}
              >
                <Building2 className="w-6 h-6 text-black drop-shadow-lg" />
              </div>

              {/* Right Box */}
              <div
                className="flex flex-col items-center justify-center w-1/2 py-32 space-y-4 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${CompanyA}')`,
                  opacity: '90%'
                }}
              >
                <Building2 className="w-6 h-6 text-white drop-shadow-lg" />
              </div>

              {/* Center Text */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 font-medium">
                <div className="flex flex-col justify-center items-center mt-2 gap-12">
                  <h2 className="text-2xl font-bold">Compare your assessment with other company</h2>
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
