import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building, Users, BarChart2, AlertCircle, Settings, ListChecks } from "lucide-react";
import { securedApi } from '@/lib/api';
import { AxiosError } from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Interface for platform-wide average scores by dimension
interface DimensionAverageScore {
  dimension: string;
  average_score: number | null;
}

// Interface for data overview from API for Fitwork Admin
interface PlatformAdminOverviewData {
  total_companies: number;
  total_candidates_registered: number;
  total_assessments_completed: number;
  average_scores_by_dimension: DimensionAverageScore[];
}

// Interface for data that will be used by the chart (remains the same)
interface ChartData {
  name: string; // Dimension name or "Overall Avg."
  score: number | null;
}

const DIMENSION_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE',
  '#00C49F', '#FFBB28', '#FF8042', '#A28D8D', '#E4A0F7',
  '#4CAF50', '#FF5722', '#3F51B5', '#E91E63'
];

function DashboardFitworkAdmin() {
  const navigate = useNavigate();
  
  const [overviewData, setOverviewData] = useState<PlatformAdminOverviewData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlatformOverviewData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Replace with your actual API endpoint for fitwork admin overview
        const response = await securedApi.get<PlatformAdminOverviewData>(
          `/api/v1/admin/overview/` 
        );
        setOverviewData(response.data);

        if (response.data && response.data.average_scores_by_dimension) {
          const newChartData: ChartData[] = response.data.average_scores_by_dimension
            .filter(dim => dim.average_score !== null) // Ensure score is not null
            .map(dim => ({
              name: dim.dimension,
              score: parseFloat(dim.average_score!.toFixed(2)) // Add ! for non-null assertion after filter
            }))
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort dimensions alphabetically

          setChartData(newChartData);
        }

      } catch (err) {
        console.error("Error fetching platform overview data:", err);
        if (err instanceof AxiosError) {
          if (err.response) {
            let errorMsg = `Gagal mengambil data: Status ${err.response.status}.`;
            if (typeof err.response.data === 'string') {
              errorMsg += ` Detail: ${err.response.data.substring(0,300)}`;
            } else if (err.response.data && err.response.data.detail) {
              errorMsg += ` Detail: ${err.response.data.detail}`;
            } else {
              try {
                errorMsg += ` Detail: ${JSON.stringify(err.response.data).substring(0,300)}`;
              } catch {
                errorMsg += ` Detail: [Objek error tidak dapat distringify]`;
              }
            }
            setError(errorMsg);
          } else if (err.request) {
            setError("Tidak ada respons dari server. Periksa koneksi jaringan Anda.");
          } else {
            setError(`Error: ${err.message}`);
          }
        } else {
          setError("Terjadi kesalahan yang tidak diketahui saat mengambil data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlatformOverviewData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto p-6 md:p-20 space-y-8">
        <Skeleton className="h-10 w-1/2 mb-4 md:h-12" /> {/* Title Skeleton */}
        <div className="grid grid-cols-1 gap-6 mb-8"> {/* Chart section */}
          <Skeleton className="h-[300px] rounded-lg md:h-[350px]" />
        </div>
        <Skeleton className="h-8 w-1/3 mb-6 md:h-10" /> {/* Subtitle Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Stat cards */}
          <Skeleton className="h-40 rounded-lg" /> 
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1440px] mx-auto p-6 md:p-20">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!overviewData) {
    return (
      <div className="w-full max-w-[1440px] mx-auto p-6 md:p-20">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Tidak Ditemukan</AlertTitle>
          <AlertDescription>
            Tidak ada data platform overview yang dapat ditampilkan. 
            Ini mungkin masalah pada API atau tidak ada data yang tersedia.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-[1440px] mx-auto p-6 md:p-20">
        <div className="mb-10 md:mb-12">
          <StatCard title="Platform-Wide Assessment Averages by Dimension" icon={<BarChart2 className="h-5 w-5 text-indigo-600" />}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} md-height={350}>
                <BarChart 
                  data={chartData} 
                  margin={{ top: 20, right: 20, left: -15, bottom: 25 }}
                  barGap={5}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-25}
                    textAnchor="end" 
                    height={65}
                    interval={0} 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    tickCount={6} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }}
                    formatter={(value: number) => [`${value.toFixed(2)} / 5`, "Platform Avg. Score"]}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}
                    itemStyle={{ fontSize: '12px' }}
                    contentStyle={{backgroundColor: 'white', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 3px 8px rgba(0,0,0,0.1)'}}
                  />
                  <Legend 
                    verticalAlign="top"
                    align="right"
                    height={36}
                    iconSize={10}
                    wrapperStyle={{fontSize: "12px", paddingTop: '5px', paddingBottom: '15px'}}
                  />
                  <Bar 
                    dataKey="score" 
                    name="Platform Average Score"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={50}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={DIMENSION_COLORS[index % DIMENSION_COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] md:h-[350px] text-gray-500">
                Belum ada data skor platform yang cukup untuk ditampilkan pada chart.
              </div>
            )}
          </StatCard>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-gray-800">
          FitWork Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
           <StatCard
            title="Platform Metrics"
            icon={<ListChecks className="h-5 w-5 text-blue-600" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors">
                <span className="font-medium text-sm text-gray-700">Total Registered Companies</span>
                <span className="font-semibold text-base text-gray-900">
                  {overviewData.total_companies}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors">
                <span className="font-medium text-sm text-gray-700">Total Registered Candidates</span>
                <span className="font-semibold text-base text-gray-900">
                  {overviewData.total_candidates_registered}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors">
                <span className="font-medium text-sm text-gray-700">Total Assessments Completed</span>
                <span className="font-semibold text-base text-gray-900">
                  {overviewData.total_assessments_completed}
                </span>
              </div>
            </div>
          </StatCard>

          <StatCard title="Management Links" icon={<Settings className="h-5 w-5 text-teal-600" />}>
            <div className="space-y-3">
               <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate("/app/a/companies")} 
              >
                <Building className="h-5 w-5 mr-3 text-indigo-600" />
                Manage Companies
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate("/app/a/users")} // Placeholder, adjust as needed
              >
                <Users className="h-5 w-5 mr-3 text-green-600" />
                Manage Users
              </Button>
            </div>
          </StatCard>
        </div>

      </div>
    </>
  );
}

export default DashboardFitworkAdmin;