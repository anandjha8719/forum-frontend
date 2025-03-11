import { useState, useContext, FormEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import { Comment, CommentSectionProps } from "../types";

const CommentSection = ({
  forumId,
  initialComments,
  expanded,
}: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useContext(UserContext);

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/comments/forums/${forumId}/comments`, {
        content: commentContent.trim(),
      });

      setComments([response.data, ...comments]);
      setCommentContent("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error adding comment:", err);
      alert(err.response?.data?.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/comments/comments/${commentId}`);
        setComments(comments.filter((comment) => comment.id !== commentId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error deleting comment:", err);
        alert(err.response?.data?.message || "Failed to delete comment");
      }
    }
  };

  if (!expanded) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-4 px-6 mt-4">
      {isAuthenticated() && (
        <form
          onSubmit={handleAddComment}
          className="mb-4 flex items-start gap-2"
        >
          <div className="flex-grow">
            <textarea
              placeholder="Add a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              rows={2}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !commentContent.trim()}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              isSubmitting || !commentContent.trim()
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
            }`}
          >
            Add comment
          </button>
        </form>
      )}

      <div className="max-h-[400px] overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="mb-3 pb-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs text-indigo-800">
                      {(
                        comment.author.name?.[0] || comment.author.email[0]
                      ).toUpperCase()}
                    </span>
                  </div>

                  <span className="font-medium text-gray-800">
                    {comment.author.name || comment.author.email}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {user?.id === comment.authorId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    aria-label="Delete comment"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-1 text-gray-700 whitespace-pre-line pl-8">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
