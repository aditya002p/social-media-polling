import React, { useState } from "react";
import { Avatar, Button, Card, Dropdown, Badge } from "../ui/";
import { Comment, CommentVote } from "@/types/comment";
import { formatDistanceToNow } from "@/lib/utils/date";
import useAuth from "@/hooks/useAuth";
import useComment from "@/hooks/useComment";
import CommentForm from "./CommentForm";
import UserInfo from "../shared/UserInfo";
import LoadingSpinner from "../shared/LoadingSpinner";

interface CommentCardProps {
  comment: Comment;
  onReply?: (parentId: string) => void;
  onDelete?: (commentId: string) => void;
  isReply?: boolean;
  depth?: number;
  maxDepth?: number;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onReply,
  onDelete,
  isReply = false,
  depth = 0,
  maxDepth = 3,
}) => {
  const { user } = useAuth();
  const { voteComment, deleteComment, reportComment } = useComment();

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReplies, setShowReplies] = useState(depth < 1);
  const [userVote, setUserVote] = useState<CommentVote | null>(
    comment.userVote || null
  );
  const [voteCount, setVoteCount] = useState(comment.voteCount || 0);

  const canReply = depth < maxDepth;
  const isAuthor = user?.id === comment.author.id;
  const canModify = isAuthor && !comment.isDeleted;
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt));
  const hasEdited = comment.updatedAt !== comment.createdAt;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleReplyClick = () => {
    if (onReply) {
      onReply(comment.id);
    }
    setIsReplying(!isReplying);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleting(true);
      try {
        await deleteComment(comment.id);
        if (onDelete) {
          onDelete(comment.id);
        }
      } catch (error) {
        console.error("Failed to delete comment:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleVote = async (vote: CommentVote) => {
    try {
      // If user clicks the same vote type, we're removing the vote
      const newVote = userVote === vote ? null : vote;
      await voteComment(comment.id, newVote);

      // Calculate the new vote count
      let countDiff = 0;
      if (userVote === null && newVote !== null) {
        // Adding a new vote
        countDiff = newVote === CommentVote.UP ? 1 : -1;
      } else if (userVote !== null && newVote === null) {
        // Removing an existing vote
        countDiff = userVote === CommentVote.UP ? -1 : 1;
      } else if (
        userVote !== null &&
        newVote !== null &&
        userVote !== newVote
      ) {
        // Changing vote from up to down or vice versa
        countDiff = newVote === CommentVote.UP ? 2 : -2;
      }

      setVoteCount(voteCount + countDiff);
      setUserVote(newVote);
    } catch (error) {
      console.error("Failed to vote on comment:", error);
    }
  };

  const handleReport = async () => {
    if (window.confirm("Are you sure you want to report this comment?")) {
      try {
        await reportComment(comment.id);
        alert("Comment reported successfully.");
      } catch (error) {
        console.error("Failed to report comment:", error);
      }
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  if (comment.isDeleted) {
    return (
      <Card className={`p-4 mb-3 ${isReply ? "ml-6" : ""}`}>
        <div className="text-gray-400 italic">
          This comment has been deleted.
        </div>
        {hasReplies && (
          <div className="mt-2">
            <Button variant="ghost" size="sm" onClick={toggleReplies}>
              {showReplies ? "Hide" : "Show"} {comment.replies?.length}{" "}
              {comment.replies?.length === 1 ? "reply" : "replies"}
            </Button>

            {showReplies && (
              <div className="mt-3 pl-3 border-l-2 border-gray-200">
                {comment.replies?.map((reply) => (
                  <CommentCard
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    onDelete={onDelete}
                    isReply={true}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className={`p-4 mb-3 ${isReply ? "ml-6" : ""}`}>
      {isDeleting && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <Avatar
            src={comment.author.avatarUrl}
            fallback={comment.author.name[0]}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserInfo user={comment.author} />
              <span className="text-xs text-gray-500">
                {timeAgo}
                {hasEdited && <span className="ml-1">(edited)</span>}
              </span>

              {comment.isPinned && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Pinned
                </Badge>
              )}
            </div>

            <Dropdown>
              <Dropdown.Trigger>
                <Button variant="ghost" size="sm">
                  •••
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Content>
                {canModify && (
                  <>
                    <Dropdown.Item onClick={handleEditClick}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleDeleteClick}>
                      Delete
                    </Dropdown.Item>
                  </>
                )}
                {!isAuthor && (
                  <Dropdown.Item onClick={handleReport}>Report</Dropdown.Item>
                )}
              </Dropdown.Content>
            </Dropdown>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <CommentForm
                initialValue={comment.content}
                onSubmit={async (content) => {
                  // This would typically update the comment through a hook or API call
                  console.log("Updating comment with content:", content);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
                submitLabel="Update"
              />
            </div>
          ) : (
            <div className="mt-2 whitespace-pre-wrap">{comment.content}</div>
          )}

          <div className="mt-2 flex items-center text-sm space-x-4">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={userVote === CommentVote.UP ? "text-blue-500" : ""}
                onClick={() => handleVote(CommentVote.UP)}
              >
                ▲
              </Button>
              <span
                className={
                  voteCount > 0
                    ? "text-blue-500"
                    : voteCount < 0
                    ? "text-red-500"
                    : ""
                }
              >
                {voteCount}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={userVote === CommentVote.DOWN ? "text-red-500" : ""}
                onClick={() => handleVote(CommentVote.DOWN)}
              >
                ▼
              </Button>
            </div>

            {canReply && user && (
              <Button variant="ghost" size="sm" onClick={handleReplyClick}>
                Reply
              </Button>
            )}
          </div>

          {isReplying && (
            <div className="mt-3">
              <CommentForm
                onSubmit={async (content) => {
                  // This would typically create a reply through a hook or API call
                  console.log("Creating reply with content:", content);
                  setIsReplying(false);
                }}
                onCancel={() => setIsReplying(false)}
                submitLabel="Reply"
                placeholder="Write a reply..."
              />
            </div>
          )}

          {hasReplies && (
            <div className="mt-2">
              <Button variant="ghost" size="sm" onClick={toggleReplies}>
                {showReplies ? "Hide" : "Show"} {comment.replies?.length}{" "}
                {comment.replies?.length === 1 ? "reply" : "replies"}
              </Button>

              {showReplies && (
                <div className="mt-3 pl-3 border-l-2 border-gray-200">
                  {comment.replies?.map((reply) => (
                    <CommentCard
                      key={reply.id}
                      comment={reply}
                      onReply={onReply}
                      onDelete={onDelete}
                      isReply={true}
                      depth={depth + 1}
                      maxDepth={maxDepth}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommentCard;
