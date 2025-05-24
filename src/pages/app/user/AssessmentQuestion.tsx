import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import ScaleAssessment from "@/components/ScaleAssessment";

// Tipe pertanyaan dari backend
interface QuestionItem {
  id: string;
  statement: string;
  dimension: string;
  scale: string;
}

export default function Body() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const companyId = "your-company-id"; // Ganti dengan ID asli perusahaan
  const ratingOptions = ["1", "2", "3", "4", "5"];

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/assessments/question/${companyId}/`);
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [companyId]);

  const handleAssessmentSubmit = async (
    answers: { questionId: string; score: number }[]
  ) => {
    try {
      const res = await fetch("/api/assessments/submit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: companyId,
          answers,
        }),
      });

      const data = await res.json();
      console.log("Submitted:", data);
      alert("Assessment submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed.");
    }
  };

  return (
    <div className="relative h-full bg-neutral-50">
      {/* Title section */}
      <div className="container mx-auto px-5 py-12">
        <h1 className="text-2xl font-normal leading-6">
          Company Culture Fit Assessment
        </h1>
      </div>

      {/* Main content */}
      <div className="w-full bg-neutral-100 py-6">
        <div className="container mx-auto px-5">
          <Card className="rounded-lg shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-normal leading-6 mb-16">Tech Corp</h2>

              {loading ? (
                <p className="text-center">Loading questions...</p>
              ) : questions.length > 0 ? (
                <ScaleAssessment
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
