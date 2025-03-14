import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { UserContext } from "../context/UserContext";
import EditForumModal from "./EditForumModal";
import CommentSection from "./CommentSection";
import api from "../services/api";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface ForumCardProps {
  forum: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
    authorId: string;
    author: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    _count?: {
      comments: number;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onForumUpdate: (updatedForum: any) => void;
  onForumDelete: (forumId: string) => void;
}

const ForumCard = ({ forum, onForumUpdate, onForumDelete }: ForumCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { user } = useContext(UserContext);

  const timeAgo = formatDistanceToNow(new Date(forum.createdAt), {
    addSuffix: true,
  });

  // Get comment count, defaulting to 0 if _count is missing
  const commentCount = forum._count?.comments || 0;

  const isOwner = user?.id === forum.author.id;

  useEffect(() => {
    if (commentsExpanded && comments.length === 0) {
      fetchComments();
    }
  }, [commentsExpanded]);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await api.get(`/forums/${forum.id}`);
      setComments(response.data.comments);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleEditForum = async (
    forumId: string,
    forumData: { title: string; description: string; tags: string[] }
  ) => {
    try {
      const response = await api.put(`/forums/${forumId}`, forumData);
      onForumUpdate(response.data);
      setShowEditModal(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error updating forum:", err);
      alert(err.response?.data?.message || "Failed to update forum");
    }
  };

  const handleDeleteForum = async () => {
    if (window.confirm("Are you sure you want to delete this forum?")) {
      try {
        await api.delete(`/forums/${forum.id}`);
        onForumDelete(forum.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error deleting forum:", err);
        alert(err.response?.data?.message || "Failed to delete forum");
      }
    }
  };

  const toggleComments = () => {
    setCommentsExpanded(!commentsExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/forums/${forum.id}`}>
            <h2 className="text-xl font-bold text-gray-800 hover:text-indigo-600">
              {forum.title}
            </h2>
          </Link>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <button
                    onClick={() => {
                      setShowOptions(false);
                      setShowEditModal(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowOptions(false);
                      handleDeleteForum();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{forum.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {forum.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            {forum.author.avatar ? (
              <img
                src={forum.author.avatar}
                alt={forum.author.name || forum.author.email}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs text-indigo-800">
                  {(
                    forum.author.name?.[0] || forum.author.email[0]
                  ).toUpperCase()}
                </span>
              </div>
            )}
            <span>{forum.author.name || forum.author.email}</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>{timeAgo}</span>
            <button
              onClick={toggleComments}
              className="flex items-center hover:text-indigo-600 focus:outline-none"
            >
              <span>
                {commentCount} comment{commentCount !== 1 ? "s" : ""}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transform transition-transform ${
                  commentsExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isLoadingComments && commentsExpanded ? (
        <div className="px-6 pb-6 pt-2 border-t border-gray-200">
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      ) : (
        <CommentSection
          forumId={forum.id}
          initialComments={comments}
          expanded={commentsExpanded}
          onToggle={toggleComments}
        />
      )}

      {showEditModal && (
        <EditForumModal
          forum={forum}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditForum}
        />
      )}
    </div>
  );
};

export default ForumCard;
