import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuestionItem {
  id: string;
  statement: string;
  dimension: string;
  scale: string;
}

interface ScaleAssessmentProps {
  companyName: string;
  questions: QuestionItem[];
  ratingOptions: string[]; // e.g., ["1", "2", "3", "4", "5"]
  onSubmit: (answers: { questionId: string; score: number }[]) => void;
}

const ratingLabels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

export default function ScaleAssessment({
  questions,
  ratingOptions,
  onSubmit,
}: ScaleAssessmentProps) {
  const [selectedRatings, setSelectedRatings] = useState<number[]>(
    Array(questions.length).fill(-1)
  );

  const handleSelect = (qIndex: number, rIndex: number) => {
    const updated = [...selectedRatings];
    updated[qIndex] = rIndex;
    setSelectedRatings(updated);
  };

  const handleSubmit = () => {
    if (selectedRatings.includes(-1)) {
      alert("Please complete all questions before submitting.");
      return;
    }

    const answers = questions.map((q, index) => ({
      questionId: q.id,
      score: selectedRatings[index] + 1,
    }));

    onSubmit(answers);
  };

  return (
    <div className="bg-neutral-100 rounded-lg p-4">
      {questions.map((question, qIndex) => (
        <div key={question.id} className="mb-12">
          <div className="bg-neutral-200 rounded-lg p-5 mx-auto max-w-[615px]">
            <div className="flex items-center justify-center">
              <p className="text-base font-normal">{question.statement}</p>
            </div>
          </div>

          <div className="flex justify-center mt-4 gap-6">
            {ratingOptions.map((_, rIndex) => (
              <div key={rIndex} className="flex flex-col items-center gap-1">
                <div
                  onClick={() => handleSelect(qIndex, rIndex)}
                  className={`w-8 h-8 rounded-full cursor-pointer ${
                    selectedRatings[qIndex] === rIndex
                      ? "bg-indigo-500"
                      : "bg-neutral-300"
                  }`}
                />
                <span className="text-xs text-center w-16">
                  {ratingLabels[rIndex]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-8">
        <Button
          className="bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg w-[615px] h-[42px]"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
