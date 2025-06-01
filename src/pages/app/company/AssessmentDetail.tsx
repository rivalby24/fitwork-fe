// AssessmentDetail.tsx

import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom'; // No longer used as company_id comes from store
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { securedApi } from '@/lib/api'; // Using the configured API instance
import { AxiosError, AxiosResponse } from 'axios'; // Import AxiosError and AxiosResponse
import { useUserStore } from '@/stores/useUserStore'; // To get company_id for company admin

// Interface for the data expected from the API
interface QuestionWithAverageScore {
  id: string; // UUID of the question
  statement: string;
  dimension: string;
  average_score_all_candidates: number | null;
}

interface CompanyAssessmentOverview {
  company_name: string;
  overall_average_score: number | null;
  questions: QuestionWithAverageScore[];
}

// Main Component
function AssessmentDetail() {
  const { company_id } = useUserStore(); // Get company_id from the user store (for company admin)

  const [assessmentData, setAssessmentData] = useState<CompanyAssessmentOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const targetCompanyId = company_id; // Use company_id from the store

    if (!targetCompanyId) {
      setError("Company ID not found. Please ensure you are logged in as a company representative."); // More specific error
      setIsLoading(false);
      return;
    }

    const loadAssessmentData = async (): Promise<void> => { // Explicit return type
      setIsLoading(true);
      setError(null);
      try {
        // API call using the Axios instance (securedApi)
        // Specify the expected data type from the Axios response
        const response: AxiosResponse<CompanyAssessmentOverview> = await securedApi.get(
          `/api/v1/assessments/overview/${targetCompanyId}/`
        );

        setAssessmentData(response.data);

      } catch (err: any) { // Catch all error types
        console.error("Error fetching assessment data:", err);

        if (err && err.isAxiosError) { // Check if this is an Axios error
            const axiosError = err as AxiosError<any>; // Type assertion
            if (axiosError.response) {
                // Request was made and server responded with an error status (outside of 2xx)
                const status = axiosError.response.status;
                let message = `Failed to retrieve assessment data: Status ${status}.`;
                if (status === 404) {
                    message = `Assessment data for company ID ${targetCompanyId} not found (404).`;
                } else if (axiosError.response.data) {
                    // Try to get error details from Axios response body
                    if (typeof axiosError.response.data === 'string') {
                        message += ` Detail: ${axiosError.response.data.substring(0,300)}`;
                    } else if (axiosError.response.data.detail) { // Common DRF error format
                        message += ` Detail: ${axiosError.response.data.detail}`;
                    } else {
                        try {
                            // Fallback if error detail is a complex object
                            message += ` Detail: ${JSON.stringify(axiosError.response.data).substring(0,300)}`;
                        } catch {
                            message += ` Detail: [Error object could not be stringified]`;
                        }
                    }
                }
                setError(message);
            } else if (axiosError.request) {
                // Request was made but no response was received
                setError("No response from server. Check your network connection.");
            } else {
                // Error occurred during request setup or other Axios error
                setError(axiosError.message || "An unknown error occurred while fetching data.");
            }
        } else if (err instanceof Error) {
             // Non-Axios error, but still an Error instance
            setError(err.message);
        } else {
            // Fallback for unknown error types
            setError("An unknown error occurred while fetching data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessmentData();
  }, [company_id]); // Dependency on company_id from the store

  // Loading State Display
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <Skeleton className="mb-2 h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="mb-6 h-10 w-1/3" />
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center justify-between border-b py-2">
                  <div className="w-1/4"><Skeleton className="h-4 w-full" /></div>
                  <div className="w-1/2"><Skeleton className="h-4 w-full" /></div>
                  <div className="ml-auto w-1/4"><Skeleton className="h-4 w-3/4" /></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State Display
  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Data Retrieval Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Display if Data Not Found (after loading completes and no error)
  if (!assessmentData) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Data Not Available</AlertTitle>
          <AlertDescription>No assessment information can be displayed for this company, or the Company ID is invalid.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Main Display with Data
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 md:text-3xl">
            Assessment Overview: {assessmentData.company_name}
          </CardTitle>
          <CardDescription className="text-md text-gray-600">
            List of assessment questions with average scores from all candidates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessmentData.overall_average_score !== null && typeof assessmentData.overall_average_score === 'number' ? (
            <div className="mb-6 rounded-lg bg-blue-50 p-4">
              <h3 className="text-lg font-semibold text-blue-700">Overall Company Average Score:</h3>
              <p className="text-3xl font-bold text-blue-600">
                {assessmentData.overall_average_score.toFixed(2)} / 5
              </p>
              <Progress 
                value={(assessmentData.overall_average_score / 5) * 100} 
                className="mt-2 h-3 [&>div]:bg-blue-600"
              />
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                 <h3 className="text-lg font-semibold text-gray-700">Overall Company Average Score:</h3>
                 <p className="text-xl text-gray-500 italic">No score yet</p>
            </div>
          )}

          {assessmentData.questions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%] font-semibold text-gray-700">Dimension</TableHead>
                  <TableHead className="w-[50%] font-semibold text-gray-700">Question Statement</TableHead>
                  <TableHead className="w-[25%] text-right font-semibold text-gray-700">Average Candidate Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessmentData.questions.map((q) => (
                  <TableRow key={q.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Badge variant="outline" className="text-sm">{q.dimension}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">{q.statement}</TableCell>
                    <TableCell className="text-right">
                      {q.average_score_all_candidates !== null && typeof q.average_score_all_candidates === 'number' ? (
                        <div className="flex flex-col items-end">
                           <span className="text-lg font-semibold text-indigo-600">
                            {q.average_score_all_candidates.toFixed(2)}
                           </span>
                           <Progress 
                             value={(q.average_score_all_candidates / 5) * 100} 
                             className="mt-1 h-2 w-24"
                           />
                        </div>
                      ) : (
                        <span className="italic text-gray-500">No score yet</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>No Questions Yet</AlertTitle>
                <AlertDescription>
                  No assessment questions are available for this company at the moment.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AssessmentDetail;