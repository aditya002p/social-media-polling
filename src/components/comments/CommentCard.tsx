import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";

interface CommentAuthor {
  id: string;
  name: string;
  avatar: string;
}

interface CommentProps {
  comment: {
    id: string;
    content: string;
    author: CommentAuthor;
    createdAt: string;
    upvotes: number;
    downvotes: number;
    userVote?: "up" | "down" | null;
  };
  onVote: (commentId: string, voteType: "up" | "down") => void;
  onReply?: () => void;
  isReplyOpen?: boolean;
  isReply?: boolean;
}

const CommentCard: React.FC<CommentProps> = ({
  comment,
  onVote,
  onReply,
  isReplyOpen,
  isReply = false,
}) => {
  const { user } = useAuth();

  const handleVote = (voteType: "up" | "down") => {
    if (!user) {
      alert("Please log in to vote on comments.");
      return;
    }
    onVote(comment.id, voteType);
  };

  const formattedDate = (() => {
    try {
      return formatDistanceToNow(new Date(comment.createdAt), {
        addSuffix: true,
      });
    } catch (error) {
      return "recently";
    }
  })();

  return (
    <div className={`${isReply ? "" : "bg-gray-50"} p-3 rounded-md`}>
      <div className="flex items-start gap-3">
        <Avatar
          src={comment.author.avatar}
          alt={comment.author.name}
          size="sm"
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>

          <div className="text-sm whitespace-pre-line break-words">
            {comment.content}
          </div>

          <div className="flex items-center mt-2 text-sm gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVote("up")}
                className={`p-1 rounded focus:outline-none ${
                  comment.userVote === "up"
                    ? "text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-label="Upvote"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.77 4.21a.75.75 0 01.02 1.06l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 011.08-1.04L10 8.168l3.71-3.938a.75.75 0 011.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span>{comment.upvotes}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVote("down")}
                className={`p-1 rounded focus:outline-none ${
                  comment.userVote === "down"
                    ? "text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-label="Downvote"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 15.79a.75.75 0 01-.02-1.06l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 11-1.08 1.04L10 11.832l-3.71 3.938a.75.75 0 01-1.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span>{comment.downvotes}</span>
            </div>

            {!isReply && onReply && (
              <Button
                onClick={onReply}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                {isReplyOpen ? "Cancel" : "Reply"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
