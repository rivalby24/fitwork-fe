import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestionListProps {
  suggestions: string[];
  onSelect: (topic: string) => void;
  disabled?: boolean;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, onSelect, disabled }) => {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((topic, idx) => (
        <Button
          key={idx}
          onClick={() => onSelect(topic)}
          disabled={disabled}
          variant="outline"
          className="whitespace-nowrap"
        >
          {topic}
        </Button>
      ))}
    </div>
  );
};

export default SuggestionList;
