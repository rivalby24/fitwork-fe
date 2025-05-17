import FooterDashboardPerusahaanDanUser from "@/components/FooterDashboardPerusahaanDanUser";
import NavbarDashboardPerusahaan from "@/components/NavbarDashboardPerusahaan";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckSquare, ChevronDown, MoreHorizontal } from "lucide-react";
import React from "react";

export default function DashboardPerusahaan() {
  // Data for candidate overview
  const candidateData = [
    { label: "Total Candidates", value: "156" },
    { label: "In Progress", value: "45" },
    { label: "Completed", value: "111" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarDashboardPerusahaan />
      <div className="w-full max-w-[1440px] mx-auto p-20">
        <div className="max-w-[1280px] mx-auto">
          {/* Top Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Generated Assessment Card */}
            <Card className="shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]">
              <CardHeader className="flex flex-row items-center justify-between pb-0">
                <CardTitle className="text-lg font-normal text-[#232323]">
                  Generated Assessment
                </CardTitle>
                <ChevronDown className="h-4 w-3" />
              </CardHeader>
              <CardContent className="pt-8">
                <div className="bg-indigo-500 rounded p-4">
                  <div className="flex justify-between text-white mb-2">
                    <span className="text-base font-normal">
                      Completed Assessments
                    </span>
                    <span className="text-base font-normal">24/30</span>
                  </div>
                  <div className="h-2 bg-[#cfcfcf] rounded-full">
                    <div className="h-2 w-4/5 bg-white rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Results Card */}
            <Card className="shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]">
              <CardHeader className="flex flex-row items-center justify-between pb-0">
                <CardTitle className="text-lg font-normal">
                  Assessment Results
                </CardTitle>
                <MoreHorizontal className="h-4 w-4" />
              </CardHeader>
              <CardContent className="pt-8">
                <Button className="w-full h-14 bg-indigo-500 hover:bg-indigo-600">
                  <span className="text-base font-normal">Comparison Chart</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Company Dashboard Section */}
          <div>
            <h2 className="text-xl font-normal mb-12">Company Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Overview Card */}
              <Card className="shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]">
                <CardHeader>
                  <CardTitle className="text-lg font-normal">
                    Candidate Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidateData.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-200 rounded p-3 h-12"
                      >
                        <span className="font-normal text-base text-black">
                          {item.label}
                        </span>
                        <span className="font-normal text-base text-black">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="link" className="font-bold text-sm text-black">
                    See Candidate
                  </Button>
                </CardFooter>
              </Card>

              {/* EVP Updates Card */}
              <Card className="shadow-[0px_1px_3px_#0000001a,0px_1px_2px_#0000001a]">
                <CardHeader>
                  <CardTitle className="text-lg font-normal">
                    EVP Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center bg-gray-200 rounded p-3 h-12">
                      <CheckSquare className="h-4 w-4 mr-3" />
                      <span className="font-normal text-base text-black">
                        Update Company EVP
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Last updated: Jan 15, 2025
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <FooterDashboardPerusahaanDanUser />
    </div>
  );
}
