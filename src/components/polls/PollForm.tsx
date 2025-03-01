import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements/Input";
import { Textarea } from "@/components/ui/FormElements/Textarea";
import { Select } from "@/components/ui/FormElements/Select";
import { Checkbox } from "@/components/ui/FormElements/Checkbox";
import { DatePicker } from "@/components/ui/FormElements/DatePicker";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { usePoll } from "@/hooks/usePoll";

// Validation schema for poll form
const pollSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  questions: z
    .array(
      z.object({
        question: z
          .string()
          .min(3, "Question must be at least 3 characters")
          .max(200, "Question must be less than 200 characters"),
        type: z.enum(["single", "multiple", "ranking", "open"]),
        options: z
          .array(
            z.object({
              value: z.string().min(1, "Option cannot be empty"),
            })
          )
          .min(2, "At least 2 options are required")
          .optional(),
      })
    )
    .min(1, "At least one question is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  expiresAt: z.date().optional(),
  isPrivate: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  showResultsBeforeVoting: z.boolean().default(false),
  allowReVoting: z.boolean().default(false),
});

type PollFormValues = z.infer<typeof pollSchema>;

interface PollFormProps {
  pollId?: string; // If provided, we're editing an existing poll
}

export const PollForm: React.FC<PollFormProps> = ({ pollId }) => {
  const router = useRouter();
  const { createPoll, updatePoll, getPoll, isLoading, error } = usePoll();
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    "Politics",
    "Sports",
    "Entertainment",
    "Technology",
    "Science",
    "Health",
    "Business",
    "Education",
    "Other",
  ]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PollFormValues>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          question: "",
          type: "single",
          options: [{ value: "" }, { value: "" }],
        },
      ],
      categories: [],
      isPrivate: false,
      allowComments: true,
      showResultsBeforeVoting: false,
      allowReVoting: false,
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  // Watch the question type to conditionally render option fields
  const questionTypes = watch("questions").map((q) => q.type);

  useEffect(() => {
    // If pollId is provided, fetch the poll data for editing
    if (pollId) {
      const fetchPoll = async () => {
        const pollData = await getPoll(pollId);
        if (pollData) {
          reset({
            title: pollData.title,
            description: pollData.description,
            questions: pollData.questions,
            categories: pollData.categories,
            expiresAt: pollData.expiresAt
              ? new Date(pollData.expiresAt)
              : undefined,
            isPrivate: pollData.isPrivate,
            allowComments: pollData.allowComments,
            showResultsBeforeVoting: pollData.showResultsBeforeVoting,
            allowReVoting: pollData.allowReVoting,
          });
        }
      };

      fetchPoll();
    }
  }, [pollId, getPoll, reset]);

  const onSubmit: SubmitHandler<PollFormValues> = async (data) => {
    try {
      if (pollId) {
        await updatePoll(pollId, data);
        router.push(`/polls/${pollId}`);
      } else {
        const newPoll = await createPoll(data);
        router.push(`/polls/${newPoll.id}`);
      }
    } catch (error) {
      console.error("Failed to save poll:", error);
    }
  };

  const addQuestion = () => {
    appendQuestion({
      question: "",
      type: "single",
      options: [{ value: "" }, { value: "" }],
    });
  };

  const addOption = (questionIndex: number) => {
    const currentOptions =
      control._formValues.questions[questionIndex].options || [];
    const updatedQuestions = [...control._formValues.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: [...currentOptions, { value: "" }],
    };

    reset({
      ...control._formValues,
      questions: updatedQuestions,
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = [
      ...(control._formValues.questions[questionIndex].options || []),
    ];
    if (currentOptions.length <= 2) return; // Maintain at least 2 options

    currentOptions.splice(optionIndex, 1);
    const updatedQuestions = [...control._formValues.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: currentOptions,
    };

    reset({
      ...control._formValues,
      questions: updatedQuestions,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {pollId ? "Edit Poll" : "Create New Poll"}
        </h2>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Poll Title *
          </label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter a clear, specific title for your poll"
            error={errors.title?.message}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description *
          </label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Provide context and details about your poll"
            rows={3}
            error={errors.description?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categories *</label>
          <Select
            isMulti
            options={availableCategories.map((cat) => ({
              label: cat,
              value: cat,
            }))}
            {...register("categories")}
            error={errors.categories?.message}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Questions</h3>
            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              size="sm"
            >
              Add Question
            </Button>
          </div>

          {errors.questions && (
            <Alert variant="destructive" className="mb-4">
              <p>{errors.questions.message}</p>
            </Alert>
          )}

          {questionFields.map((field, questionIndex) => (
            <Card key={field.id} className="p-4 mb-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Question {questionIndex + 1}</h4>
                {questionFields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Input
                    {...register(`questions.${questionIndex}.question`)}
                    placeholder="Enter your question"
                    error={errors.questions?.[questionIndex]?.question?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Question Type
                  </label>
                  <Select
                    options={[
                      { value: "single", label: "Single Choice" },
                      { value: "multiple", label: "Multiple Choice" },
                      { value: "ranking", label: "Ranking" },
                      { value: "open", label: "Open-ended" },
                    ]}
                    {...register(`questions.${questionIndex}.type`)}
                  />
                </div>

                {(questionTypes[questionIndex] === "single" ||
                  questionTypes[questionIndex] === "multiple" ||
                  questionTypes[questionIndex] === "ranking") && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Options
                      </label>
                      <Button
                        type="button"
                        onClick={() => addOption(questionIndex)}
                        variant="outline"
                        size="sm"
                      >
                        Add Option
                      </Button>
                    </div>

                    {errors.questions?.[questionIndex]?.options && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.questions[questionIndex]?.options?.message}
                      </p>
                    )}

                    {field.options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-2 mb-2"
                      >
                        <Input
                          {...register(
                            `questions.${questionIndex}.options.${optionIndex}.value`
                          )}
                          placeholder={`Option ${optionIndex + 1}`}
                          error={
                            errors.questions?.[questionIndex]?.options?.[
                              optionIndex
                            ]?.value?.message
                          }
                          className="flex-1"
                        />
                        {field.options && field.options.length > 2 && (
                          <Button
                            type="button"
                            onClick={() =>
                              removeOption(questionIndex, optionIndex)
                            }
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Poll Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiresAt"
                className="block text-sm font-medium mb-1"
              >
                Expiration Date (Optional)
              </label>
              <DatePicker
                id="expiresAt"
                {...register("expiresAt")}
                placeholder="Select when this poll should close"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <Checkbox id="isPrivate" {...register("isPrivate")} />
                <label htmlFor="isPrivate" className="ml-2 text-sm">
                  Make this poll private
                </label>
              </div>

              <div className="flex items-center">
                <Checkbox id="allowComments" {...register("allowComments")} />
                <label htmlFor="allowComments" className="ml-2 text-sm">
                  Allow comments
                </label>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="showResultsBeforeVoting"
                  {...register("showResultsBeforeVoting")}
                />
                <label
                  htmlFor="showResultsBeforeVoting"
                  className="ml-2 text-sm"
                >
                  Show results before voting
                </label>
              </div>

              <div className="flex items-center">
                <Checkbox id="allowReVoting" {...register("allowReVoting")} />
                <label htmlFor="allowReVoting" className="ml-2 text-sm">
                  Allow users to change their vote
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Saving..." : pollId ? "Update Poll" : "Create Poll"}
        </Button>
      </div>
    </form>
  );
};
