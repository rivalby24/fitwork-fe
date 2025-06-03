import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { securedApi } from "@/lib/api";
import { AxiosError, AxiosResponse } from "axios";
import { useUserStore } from "@/stores/useUserStore";

interface QuestionWithAverageScore {
  id: string;
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
  const { companyId } = useUserStore(); // Get company_id from the user store (for company admin)

  const [assessmentData, setAssessmentData] =
    useState<CompanyAssessmentOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const targetCompanyId = companyId; // Use company_id from the store

    if (!targetCompanyId) {
      setError(
        "Company ID not found. Please ensure you are logged in as a company representative."
      ); // More specific error
      setIsLoading(false);
      return;
    }

    const loadAssessmentData = async (): Promise<void> => {
      // Explicit return type
      setIsLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<CompanyAssessmentOverview> =
          await securedApi.get(
            `/api/v1/assessments/overview/${targetCompanyId}/`
          );

        setAssessmentData(response.data);
      } catch (err) {
        // Catch all error types
        console.error("Error fetching assessment data:", err);
        if (err instanceof AxiosError) {
          let errorMsg = "Failed to retrieve assessments data.";
          if (err.response) {
            errorMsg += ` Status: ${err.response.status}.`;
            if (err.response.status === 403) {
              errorMsg =
                "You do not have permission to access this resource. Ensure you are a valid Company Admin.";
            } else if (err.response.status === 405) {
              errorMsg += ` Request method (${err.config?.method?.toUpperCase()}) not allowed for this URL. Check backend endpoint configuration.`;
            } else if (typeof err.response.data === "string") {
              errorMsg += ` Detail: ${err.response.data.substring(0, 300)}`;
            } else if (err.response.data && err.response.data.detail) {
              errorMsg += ` Detail: ${err.response.data.detail}`;
            } else {
              errorMsg += ` Detail: ${JSON.stringify(
                err.response.data
              ).substring(0, 300)}`;
            }
          } else if (err.request) {
            errorMsg =
              "No response from server. Check your network connection.";
          } else {
            errorMsg = `Unknown error: ${err.message}`;
          }
          setError(errorMsg);
        } else {
          setError(
            "An unknown general error occurred while fetching session data."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessmentData();
  }, [companyId]); // Dependency on company_id from the store

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
                <div
                  key={index}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div className="w-1/4">
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="w-1/2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="ml-auto w-1/4">
                    <Skeleton className="h-4 w-3/4" />
                  </div>
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
          <AlertDescription>
            No assessment information can be displayed for this company, or the
            Company ID is invalid.
          </AlertDescription>
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
            List of assessment questions with average scores from all
            candidates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessmentData.overall_average_score !== null &&
          typeof assessmentData.overall_average_score === "number" ? (
            <div className="mb-6 rounded-lg bg-blue-50 p-4">
              <h3 className="text-lg font-semibold text-blue-700">
                Overall Company Average Score:
              </h3>
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
              <h3 className="text-lg font-semibold text-gray-700">
                Overall Company Average Score:
              </h3>
              <p className="text-xl text-gray-500 italic">No score yet</p>
            </div>
          )}

          {assessmentData.questions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%] font-semibold text-gray-700">
                    Dimension
                  </TableHead>
                  <TableHead className="w-[50%] font-semibold text-gray-700">
                    Question Statement
                  </TableHead>
                  <TableHead className="w-[25%] text-right font-semibold text-gray-700">
                    Average Candidate Score
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessmentData.questions.map((q) => (
                  <TableRow key={q.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Badge variant="outline" className="text-sm">
                        {q.dimension}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {q.statement}
                    </TableCell>
                    <TableCell className="text-right">
                      {q.average_score_all_candidates !== null &&
                      typeof q.average_score_all_candidates === "number" ? (
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
                        <span className="italic text-gray-500">
                          No score yet
                        </span>
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
                No assessment questions are available for this company at the
                moment.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AssessmentDetail;
