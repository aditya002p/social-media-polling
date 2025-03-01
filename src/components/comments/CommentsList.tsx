import React, { useState, useEffect } from "react";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentsForm";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: "up" | "down" | null;
  parentId: string | null;
  replies?: Comment[];
}

interface CommentsListProps {
  contentId: string;
  contentType: "poll" | "opinion" | "forum" | "thread";
}

const CommentsList: React.FC<CommentsListProps> = ({
  contentId,
  contentType,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [contentId, contentType]);

  const fetchComments = async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      // In a real app, you would fetch from your API
      // For now, simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Mock data
      const mockComments: Comment[] = Array.from({ length: 5 }, (_, i) => ({
        id: `comment-${i + 1}-${Date.now()}`,
        content: `This is comment ${
          i + 1
        }. Here's what I think about this topic.`,
        author: {
          id: `user-${(i % 5) + 1}`,
          name: `User ${(i % 5) + 1}`,
          avatar: `/api/placeholder/40/40`,
        },
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        upvotes: Math.floor(Math.random() * 15),
        downvotes: Math.floor(Math.random() * 5),
        userVote:
          Math.random() > 0.7 ? (Math.random() > 0.5 ? "up" : "down") : null,
        parentId: null,
        replies:
          i % 3 === 0
            ? [
                {
                  id: `reply-${i}-1-${Date.now()}`,
                  content: `Reply to comment ${
                    i + 1
                  }. I agree with your point!`,
                  author: {
                    id: `user-${((i + 1) % 5) + 1}`,
                    name: `User ${((i + 1) % 5) + 1}`,
                    avatar: `/api/placeholder/40/40`,
                  },
                  createdAt: new Date(
                    Date.now() - i * 3600000 + 1800000
                  ).toISOString(),
                  upvotes: Math.floor(Math.random() * 5),
                  downvotes: Math.floor(Math.random() * 2),
                  userVote:
                    Math.random() > 0.7
                      ? Math.random() > 0.5
                        ? "up"
                        : "down"
                      : null,
                  parentId: `comment-${i + 1}`,
                },
              ]
            : [],
      }));

      if (reset) {
        setComments(mockComments);
      } else {
        setComments((prev) => [...prev, ...mockComments]);
      }

      // Simulate running out of comments after a few loads
      setHasMore(comments.length < 15);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSubmitComment = async (
    content: string,
    parentId: string | null = null
  ) => {
    if (!user) {
      return;
    }

    try {
      // In a real app, you would send a request to your API
      // For now, simulate a delay for the comment to be saved
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newComment: Comment = {
        id: `comment-new-${Date.now()}`,
        content,
        author: {
          id: user.id,
          name: user.name || "Anonymous",
          avatar: user.image || `/api/placeholder/40/40`,
        },
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        parentId,
      };

      if (parentId) {
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            return comment;
          })
        );
      } else {
        setComments((prevComments) => [newComment, ...prevComments]);
      }

      setShowReplyForm(null);
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to submit your comment. Please try again.");
    }
  };

  const handleVote = async (commentId: string, voteType: "up" | "down") => {
    // Find if the comment is a top-level comment or a reply
    let isReply = false;
    let parentId = "";

    for (const comment of comments) {
      if (comment.id === commentId) {
        break;
      }

      const reply = comment.replies?.find((reply) => reply.id === commentId);
      if (reply) {
        isReply = true;
        parentId = comment.id;
        break;
      }
    }

    setComments((prevComments) =>
      prevComments.map((comment) => {
        // If this is the comment to update
        if (comment.id === commentId) {
          const currentVote = comment.userVote;
          let newUpvotes = comment.upvotes;
          let newDownvotes = comment.downvotes;

          // Remove previous vote if any
          if (currentVote === "up") newUpvotes--;
          if (currentVote === "down") newDownvotes--;

          // Add new vote if not toggling off
          if (currentVote !== voteType) {
            if (voteType === "up") newUpvotes++;
            if (voteType === "down") newDownvotes++;
          }

          return {
            ...comment,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: currentVote === voteType ? null : voteType,
          };
        }

        // If this is a parent comment and we need to update a reply
        if (isReply && comment.id === parentId && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                const currentVote = reply.userVote;
                let newUpvotes = reply.upvotes;
                let newDownvotes = reply.downvotes;

                // Remove previous vote if any
                if (currentVote === "up") newUpvotes--;
                if (currentVote === "down") newDownvotes--;

                // Add new vote if not toggling off
                if (currentVote !== voteType) {
                  if (voteType === "up") newUpvotes++;
                  if (voteType === "down") newDownvotes++;
                }

                return {
                  ...reply,
                  upvotes: newUpvotes,
                  downvotes: newDownvotes,
                  userVote: currentVote === voteType ? null : voteType,
                };
              }
              return reply;
            }),
          };
        }

        return comment;
      })
    );
  };

  const toggleReplyForm = (commentId: string | null) => {
    setShowReplyForm((prev) => (prev === commentId ? null : commentId));
  };

  if (loading && comments.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>{error}</p>
        <Button onClick={() => fetchComments()} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
        <CommentForm onSubmit={(content) => handleSubmitComment(content)} />
      </div>

      {comments.length === 0 ? (
        <EmptyState
          title="No comments yet"
          description="Be the first to leave a comment!"
        />
      ) : (
        <>
          <h3 className="text-lg font-semibold">
            Comments (
            {comments.reduce(
              (total, comment) => total + 1 + (comment.replies?.length || 0),
              0
            )}
            )
          </h3>

          <div className="space-y-5">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                <CommentCard
                  comment={comment}
                  onVote={handleVote}
                  onReply={() => toggleReplyForm(comment.id)}
                  isReplyOpen={showReplyForm === comment.id}
                />

                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-6 mt-3 pl-4 border-l space-y-4">
                    {comment.replies.map((reply) => (
                      <CommentCard
                        key={reply.id}
                        comment={reply}
                        onVote={handleVote}
                        isReply
                      />
                    ))}
                  </div>
                )}

                {showReplyForm === comment.id && (
                  <div className="ml-6 mt-3">
                    <CommentForm
                      onSubmit={(content) =>
                        handleSubmitComment(content, comment.id)
                      }
                      onCancel={() => setShowReplyForm(null)}
                      isReply
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-6">
              <Button
                onClick={() => fetchComments(false)}
                disabled={loadingMore}
                variant="outline"
              >
                {loadingMore ? "Loading..." : "Load More Comments"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsList;
