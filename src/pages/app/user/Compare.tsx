import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { securedApi } from "@/lib/api";

interface Company {
  id: string;
  name: string;
  logo?: string;
}

function Compare() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [leftId, setLeftId] = useState<string>("");
  const [rightId, setRightId] = useState<string>("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchCompanies = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await securedApi.get("api/v1/companies/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : [];
        setCompanies(list);

        const leftParam = searchParams.get("left");
        const rightParam = searchParams.get("right");
        setLeftId(leftParam || (list[0]?.id ?? ""));
        setRightId(rightParam || (list[1]?.id ?? list[0]?.id ?? ""));
      } catch {
        setError("Failed to load companies.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;
  if (companies.length === 0)
    return (
      <div className="text-center py-4">No companies available to compare.</div>
    );

  const leftCompany = companies.find((c) => c.id === leftId) || companies[0];
  const rightCompany =
    companies.find((c) => c.id === rightId) || companies[1] || companies[0];

  return (
    <main className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl mb-8">Assessment Comparison</h2>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          {["First Company", "Second Company"].map((label, idx) => (
            <div key={label} className="flex-1">
              <label className="block mb-2 font-medium text-gray-700">
                {label}
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={idx === 0 ? leftId : rightId}
                onChange={(e) =>
                  idx === 0
                    ? setLeftId(e.target.value)
                    : setRightId(e.target.value)
                }
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <Card className="shadow-md overflow-hidden relative bg-indigo-200">
          <CardContent className="flex flex-col md:flex-row rounded-lg p-0">
            {/* Left Box */}
            <div className="relative w-full md:w-1/2 h-60 md:h-auto bg-cover bg-center flex items-center justify-center">
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-opacity-60"></div>
              {/* Icon */}
              <div className="relative z-10 p-3 rounded-full">
                <img
                  src={leftCompany.logo}
                  alt={leftCompany.name}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Label */}
              <span className="absolute bottom-4 left-4 text-black font-semibold bg-white bg-opacity-90 px-3 py-1 rounded">
                {leftCompany.name}
              </span>
            </div>

            {/* Right Box */}
            <div className="relative w-full md:w-1/2 h-60 md:h-auto bg-cover bg-center flex items-center justify-center">
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-opacity-60"></div>
              {/* Icon */}
              <div className="relative z-10 p-3 rounded-full">
                <img
                  src={rightCompany.logo}
                  alt={rightCompany.name}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Label */}
              <span className="absolute bottom-4 right-4 text-black font-semibold bg-white bg-opacity-90 px-3 py-1 rounded">
                {rightCompany.name}
              </span>
            </div>

            {/* Center Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-1">
                <Link
                  to={`/app/u/compare?left=${leftCompany.id}&right=${rightCompany.id}`}
                >
                  <Button className="h-9 w-44 bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
                    Start Comparing
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Compare;
