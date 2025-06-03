import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { CheckSquare, Users, BarChart2, AlertCircle } from "lucide-react";
import { securedApi } from '@/lib/api'; 
import { AxiosError } from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useUserStore } from "@/stores/useUserStore";

// Interface untuk data pertanyaan dari API
interface QuestionWithAverageScore {
  id: string;
  statement: string;
  dimension: string;
  average_score_all_candidates: number | null;
}

// Interface untuk data overview dari API
interface CompanyOverviewData {
  company_name: string;
  overall_average_score: number | null;
  total_candidates: number;
  questions: QuestionWithAverageScore[];
}

// Interface untuk data yang akan digunakan oleh chart
interface ChartData {
  name: string;
  score: number | null;
}

const DIMENSION_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', 
  '#00C49F', '#FFBB28', '#FF8042', '#A28D8D', '#E4A0F7',
  '#4CAF50', '#FF5722', '#3F51B5', '#E91E63'
];

function DashboardPerusahaan() {
  const navigate = useNavigate();
  const { companyId } = useUserStore(); // Mengambil company_id dari Zustand store
  
  const [overviewData, setOverviewData] = useState<CompanyOverviewData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setError("Company ID tidak tersedia dari user store. Pastikan Anda telah login sebagai perusahaan.");
      setIsLoading(false);
      return;
    }

    const fetchOverviewData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await securedApi.get<CompanyOverviewData>(
          `/api/v1/assessments/overview/${companyId}/`
        );
        setOverviewData(response.data);

        if (response.data) {
          const newChartData: ChartData[] = [];
          
          if (response.data.overall_average_score !== null) {
            newChartData.push({ 
              name: "Overall Avg.", 
              score: response.data.overall_average_score 
            });
          }

          const dimensionScores: { [key: string]: { totalScore: number; count: number } } = {};
          response.data.questions.forEach(q => {
            if (q.average_score_all_candidates !== null) {
              if (!dimensionScores[q.dimension]) {
                dimensionScores[q.dimension] = { totalScore: 0, count: 0 };
              }
              dimensionScores[q.dimension].totalScore += q.average_score_all_candidates;
              dimensionScores[q.dimension].count++;
            }
          });

          const sortedDimensions = Object.keys(dimensionScores).sort();

          sortedDimensions.forEach(dim => {
            newChartData.push({
              name: dim,
              score: parseFloat((dimensionScores[dim].totalScore / dimensionScores[dim].count).toFixed(2))
            });
          });
          setChartData(newChartData);
        }

      } catch (err) {
        console.error("Error fetching overview data:", err);
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

    fetchOverviewData();
  }, [companyId]);

  if (isLoading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto p-6 md:p-20 space-y-8">
        <Skeleton className="h-10 w-1/2 mb-4 md:h-12" /> {/* Title Skeleton */}
        <div className="grid grid-cols-1 gap-6 mb-8"> {/* Chart section */}
          <Skeleton className="h-[300px] rounded-lg md:h-[350px]" />
        </div>
        <Skeleton className="h-8 w-1/3 mb-6 md:h-10" /> {/* Subtitle Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Other cards */}
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
            Tidak ada data assessment yang dapat ditampilkan untuk perusahaan ini, atau Company ID tidak valid. 
            Pastikan Company ID dari user store sudah benar.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-[1440px] mx-auto p-6 md:p-20">
        <div className="mb-10 md:mb-12"> {/* Increased bottom margin */}
          {/* Jika StatCard Anda mengharapkan satu anak, dan Anda menggunakan TypeScript, 
            pastikan children di StatCard bertipe React.ReactNode.
            Struktur kondisional (ternary) ini sudah menghasilkan satu elemen.
          */}
          <StatCard title="Assessment Results Overview" icon={<BarChart2 className="h-5 w-5 text-indigo-600" />}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} md-height={350}>
                <BarChart 
                  data={chartData} 
                  margin={{ top: 20, right: 20, left: -15, bottom: 25 }} // Adjusted margins
                  barGap={5}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-25}
                    textAnchor="end" 
                    height={65} // Adjusted height for XAxis labels
                    interval={0} 
                    tick={{ fontSize: 11, fill: '#6b7280' }} // Smaller font, gray color
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
                    formatter={(value: number) => [`${value.toFixed(2)} / 5`, "Avg. Score"]}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}
                    itemStyle={{ fontSize: '12px' }}
                    contentStyle={{backgroundColor: 'white', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 3px 8px rgba(0,0,0,0.1)'}}
                  />
                  <Legend 
                    verticalAlign="top"
                    align="right" // Align legend to the right
                    height={36}
                    iconSize={10}
                    wrapperStyle={{fontSize: "12px", paddingTop: '5px', paddingBottom: '15px'}}
                  />
                  <Bar 
                    dataKey="score" 
                    name="Average Score"
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
                Belum ada data skor yang cukup untuk ditampilkan pada chart.
              </div>
            )}
          </StatCard>
        </div>

        <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-gray-800">
          {overviewData.company_name} Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Candidate Overview"
            icon={<Users className="h-5 w-5 text-green-600" />}
            footer={
              <Button
                variant="link"
                className="font-bold text-sm text-indigo-600 hover:text-indigo-700 px-0"
                onClick={() => navigate("/app/c/candidates")} // Sesuaikan path jika perlu
              >
                See All Candidates
              </Button>
            }
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-4 h-14 transition-colors">
                <span className="font-medium text-sm md:text-base text-gray-700">Total Candidates Assessed</span>
                <span className="font-semibold text-base md:text-lg text-gray-900">
                  {overviewData.total_candidates}
                </span>
              </div>
            </div>
          </StatCard>

          <StatCard title="EVP Updates" icon={<CheckSquare className="h-5 w-5 text-sky-600" />}>
            <div className="space-y-4">
              <div
                className="flex items-center bg-sky-50 hover:bg-sky-100 rounded-lg p-3 h-14 cursor-pointer transition-colors duration-150"
                onClick={() => navigate("/app/c/evp")} // Sesuaikan path jika perlu
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate("/app/c/evp")}
              >
                <CheckSquare className="h-5 w-5 mr-3 text-sky-700" />
                <span className="font-medium text-sm md:text-base text-sky-800">
                  Update Company EVP
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 px-1">Last updated: Jan 15, 2025</p> {/* Ini masih statis */}
            </div>
          </StatCard>
        </div>
      </div>
    </>
  );
}

export default DashboardPerusahaan;