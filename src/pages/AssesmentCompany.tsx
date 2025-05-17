import FooterDashboard from "@/components/FooterDashboard";
import NavbarUser from "@/components/NavbarUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, Search } from "lucide-react";
import React from "react";

const companies = [
  {
    name: "Tech Corp",
    industry: "Software Development",
    employees: "1000-5000 employees",
  },
  {
    name: "Global Solutions Inc",
    industry: "Consulting",
    employees: "5000+ employees",
  },
  {
    name: "Innovation Labs",
    industry: "Research & Development",
    employees: "500-1000 employees",
  },
];

export default function AssesmentCompany() {
  return (
    
    <div className="flex flex-col items-start">
        <NavbarUser/>
      {/* Header Section */}
      <header className="w-full bg-neutral-50">
        <div className="max-w-[1280px] mx-auto px-20 pt-14 pb-14">
          <div className="max-w-[768px] ml-64">
            <h1 className="text-3xl font-normal text-black leading-[30px]">
              Find the Right Company For You
            </h1>
            <div className="mt-[60px] flex gap-1">
              <div className="relative flex-1">
                <Input
                  className="h-[50px] pl-4 rounded-lg border"
                  placeholder="Company name"
                />
              </div>
              <Button className="h-[50px] w-[141px] bg-indigo-500 hover:bg-indigo-600 rounded-lg flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        <div className="max-w-[1280px] mx-auto px-20 py-12">
          <div className="px-4">
            {/* Company Cards */}
            <div className="grid grid-cols-3 gap-6">
              {companies.map((company, index) => (
                <Card
                  key={index}
                  className="w-full h-[214px] rounded-lg border"
                >
                  <CardContent className="p-0">
                    <div className="p-[25px]">
                      <div className="flex items-start">
                        <div className="w-16 h-16 bg-neutral-600 rounded-lg flex items-center justify-center">
                          <Building className="w-[18px] h-6 text-white" />
                        </div>
                        <div className="ml-5 mt-5">
                          <p className="text-base font-normal text-black leading-4">
                            {company.name}
                          </p>
                        </div>
                      </div>
                      <p className="mt-[25px] text-base font-normal text-neutral-600 leading-4">
                        {company.industry} • {company.employees}
                      </p>
                      <div className="flex justify-center mt-[26px]">
                        <Button className="w-[170px] h-10 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-[15px]">
                          Start Assessment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                className="w-[221px] h-[50px] bg-gray-200 hover:bg-gray-300 rounded-lg border text-black"
              >
                Load More Companies
              </Button>
            </div>
          </div>
        </div>
        <FooterDashboard />
      </main>
    </div>
  );
}
