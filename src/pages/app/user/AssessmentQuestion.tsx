import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import ScaleAssessment from "@/components/ScaleAssessment";
import { securedApi } from "@/lib/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface QuestionItem {
  id: string;
  statement: string;
  dimension: string;
  scale: string;
}

interface AssessmentResultItem {
  overall_score: number;
  dimensions: { [key: string]: number };
}

export default function Body() {
  const { companyId } = useParams<{ companyId: string }>();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Company");
  const [results, setResults] = useState<AssessmentResultItem | null>(null);
  const ratingOptions = ["1", "2", "3", "4", "5"];

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await securedApi.post(`/api/v1/assessments/question/${companyId}/`);
        const data = res.data;
        setQuestions(data.questions || []);
        if (data.questions.length > 0) {
          setCompanyName(data.name || "Company");
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [companyId]);

  const fetchResults = async () => {
    try {
      const res = await securedApi.get(`/api/v1/assessments/results/${companyId}/`);
      setResults({
        overall_score: res.data.overall_score,
        dimensions: res.data.dimensions,
      });
    } catch (error) {
      console.error("Failed to fetch results:", error);
      alert("Failed to load results.");
    }
  };

  const handleAssessmentSubmit = async (
    answers: { questionId: string; score: number }[]
  ) => {
    try {
      const payload = {
        company_id: companyId,
        answers: answers.map((a) => ({
          question_id: a.questionId,
          score: a.score,
        })),
      };

      await securedApi.post("/api/v1/assessments/submit/", payload);
      toast.success("Assessment submitted successfully!");
      await fetchResults(); // fetch result after successful submit
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Submission failed.");
    }
  };

  return (
    <div className="relative h-full bg-neutral-50">
      <div className="container mx-auto px-5 py-12">
        <h1 className="text-2xl font-normal leading-6">
          {companyName} Culture Fit Assessment
        </h1>
      </div>

      <div className="w-full bg-neutral-100 py-6">
        <div className="container mx-auto px-5">
          <Card className="rounded-lg shadow-sm">
            <CardContent className="p-6">
              {loading ? (
                <p className="text-center">Loading questions...</p>
              ) : results ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">Assessment Results</h3>
                  <div className="mb-4">
                    <span className="font-semibold">Overall Score: </span>
                    <span className="text-indigo-600 font-bold">
                      {results.overall_score.toFixed(2)} / 5
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {Object.entries(results.dimensions).map(([dimension, score]) => (
                      <li
                        key={dimension}
                        className="flex justify-between border-b pb-2"
                      >
                        <span className="font-medium">{dimension}</span>
                        <span className="text-indigo-600 font-semibold">
                          {score.toFixed(2)} / 5
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : questions.length > 0 ? (
                <ScaleAssessment
                  companyName={companyName}
                  questions={questions}
                  ratingOptions={ratingOptions}
                  onSubmit={handleAssessmentSubmit}
                />
              ) : (
                <p className="text-center">No questions available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
