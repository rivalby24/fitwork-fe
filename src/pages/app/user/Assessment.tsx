import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, Loader } from "lucide-react";
import { securedApi } from "@/lib/api";

interface Company {
  id: string;
  name: string;
  mission_statement: string;
  career_url: string;
  core_values: string[];
  culture_keywords: string[];
  logo?: string;
}

function AssesmentCompany() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await securedApi.get("api/v1/companies/");

      if (Array.isArray(response.data)) {
        setCompanies(response.data);
      } else if (Array.isArray(response.data.results)) {
        setCompanies(response.data.results);
      } else {
        setCompanies([]);
        setError("Unexpected response format");
      }
    } catch {
      setError("Failed to load companies.");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="w-full bg-neutral-50">
        <div className="max-w-[720px] mx-auto px-26 pt-14 pb-14">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-normal text-black leading-[30px] text-center">
              Find the Right Company For You
            </h1>

            <div className="mt-[60px] flex gap-6">
              <div className="relative flex-1">
                <Input
                  className="h-[50px] pl-4 rounded-lg border"
                  placeholder="Company name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="w-full">
        <div className="max-w-[1280px] mx-auto px-20 py-12">
          <div className="px-4">
            <div className="grid grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="w-full h-[214px] rounded-lg border">
                  <CardContent className="p-0">
                    <div className="p-[25px]">
                      <div className="flex items-start">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-300 flex items-center justify-center p-1.5">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={`${company.name} logo`}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <Building className="w-[18px] h-6 text-gray-400" />
                          )}
                        </div>

                        <div className="ml-5 mt-5">
                          <p className="text-base font-normal text-black leading-4">
                            {company.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center mt-[26px]">
                        <Link to={`/app/u/assessment/question/${company.id}/`}>
                          <Button className="w-[170px] h-10 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-[15px]">
                            Start Assessment
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AssesmentCompany;
