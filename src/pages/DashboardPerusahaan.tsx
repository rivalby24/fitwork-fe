import React from "react";
import { useNavigate } from "react-router-dom";
import FooterDashboardPerusahaanDanUser from "@/components/FooterDashboardPerusahaanDanUser";
import StatCard from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal, CheckSquare } from "lucide-react";
import Navbar from "@/components/Navbar";

function DashboardPerusahaan() {
  const navigate = useNavigate();

  const candidateData = [
    { label: "Total Candidates", value: "156" },
    { label: "In Progress", value: "45" },
    { label: "Completed", value: "111" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar/>
      <div className="w-full max-w-[1440px] mx-auto p-6 md:p-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <StatCard title="Generated Assessment" icon={<ChevronDown className="h-4 w-3" />}>
            <div className="bg-indigo-500 rounded p-4">
              <div className="flex justify-between text-white mb-2">
                <span className="text-base font-normal">Completed Assessments</span>
                <span className="text-base font-normal">24/30</span>
              </div>
              <div className="h-2 bg-[#cfcfcf] rounded-full">
                <div className="h-2 w-4/5 bg-white rounded-full" />
              </div>
            </div>
          </StatCard>

          <StatCard title="Assessment Results" icon={<MoreHorizontal className="h-4 w-4" />}>
            <Button className="w-full h-14 bg-indigo-500 hover:bg-indigo-600">
              Comparison Chart
            </Button>
          </StatCard>
        </div>

        <h2 className="text-xl font-normal mb-12">Company Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Candidate Overview"
            footer={
              <Button
                variant="link"
                className="font-bold text-sm text-black"
                onClick={() => navigate("/c/candidates")}
              >
                See Candidate
              </Button>
            }
          >
            <div className="space-y-4">
              {candidateData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-200 rounded p-3 h-12"
                >
                  <span className="font-normal text-base text-black">{item.label}</span>
                  <span className="font-normal text-base text-black">{item.value}</span>
                </div>
              ))}
            </div>
          </StatCard>

          <StatCard title="EVP Updates">
            <div className="space-y-4">
              <div className="flex items-center bg-gray-200 rounded p-3 h-12">
                <CheckSquare className="h-4 w-4 mr-3" />
                <span className="font-normal text-base text-black">
                  Update Company EVP
                </span>
              </div>
              <p className="text-sm text-neutral-600">Last updated: Jan 15, 2025</p>
            </div>
          </StatCard>
        </div>
      </div>
      <FooterDashboardPerusahaanDanUser />
    </div>
  );
}

export default DashboardPerusahaan