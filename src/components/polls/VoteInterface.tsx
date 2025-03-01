import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Radio } from "@/components/ui/FormElements/Radio";
import { Checkbox } from "@/components/ui/FormElements/Checkbox";

interface Option {
  id: string;
  text: string;
}

interface VoteInterfaceProps {
  pollId: string;
  pollType: "single" | "multiple" | "ranking";
  options: Option[];
  isVoted: boolean;
  onVote: (selectedOptions: string[]) => Promise<void>;
}

const VoteInterface: React.FC<VoteInterfaceProps> = ({
  pollId,
  pollType,
  options,
  isVoted,
  onVote,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [rankings, setRankings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSingleOptionSelect = (optionId: string) => {
    setSelectedOptions([optionId]);
  };

  const handleMultipleOptionSelect = (optionId: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleRankingChange = (optionId: string, rank: number) => {
    setRankings((prev) => ({
      ...prev,
      [optionId]: rank,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (pollType === "single" && selectedOptions.length === 0) {
        setError("Please select an option");
        return;
      }

      if (pollType === "multiple" && selectedOptions.length === 0) {
        setError("Please select at least one option");
        return;
      }

      if (pollType === "ranking") {
        const rankedOptions = Object.entries(rankings)
          .sort((a, b) => a[1] - b[1])
          .map(([optionId]) => optionId);

        if (rankedOptions.length !== options.length) {
          setError("Please rank all options");
          return;
        }

        await onVote(rankedOptions);
      } else {
        await onVote(selectedOptions);
      }
    } catch (err) {
      setError("Failed to submit your vote. Please try again.");
      console.error("Vote submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVoted) {
    return (
      <div className="p-4 bg-gray-100 rounded-md text-center">
        <p className="text-gray-700">Thank you for voting!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      {pollType === "single" && (
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center">
              <Radio
                id={`option-${option.id}`}
                name="poll-option"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleSingleOptionSelect(option.id)}
                label={option.text}
              />
            </div>
          ))}
        </div>
      )}

      {pollType === "multiple" && (
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center">
              <Checkbox
                id={`option-${option.id}`}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleMultipleOptionSelect(option.id)}
                label={option.text}
              />
            </div>
          ))}
        </div>
      )}

      {pollType === "ranking" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Drag to reorder or select a rank for each option
          </p>
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <span>{option.text}</span>
              <select
                value={rankings[option.id] || ""}
                onChange={(e) =>
                  handleRankingChange(option.id, parseInt(e.target.value))
                }
                className="ml-2 p-1 border rounded-md"
              >
                <option value="">Rank</option>
                {options.map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Vote"}
      </Button>
    </div>
  );
};

export default VoteInterface;
