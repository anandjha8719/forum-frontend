import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { UserContext } from "../context/UserContext";
import ForumCard from "../components/ForumCard";
import CreateForumModal from "../components/CreateForumModal";

interface Forum {
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
}

const Home = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingForum, setIsCreatingForum] = useState(false);

  const { isAuthenticated } = useContext(UserContext);

  const fetchForums = async () => {
    setLoading(true);
    try {
      const response = await api.get("/forums");
      setForums(response.data);
      setError("");
    } catch (err: any) {
      console.error("Error fetching forums:", err);
      setError("Failed to load forums. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  const normalizeForum = (forum: Forum): Forum => {
    if (!forum._count) {
      return {
        ...forum,
        _count: {
          comments: 0,
        },
      };
    }
    return forum;
  };

  const handleCreateForum = async (forum: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    setIsCreatingForum(true);
    try {
      const response = await api.post("/forums", forum);
      // Normalize the forum data to ensure it has _count property
      const normalizedForum = normalizeForum(response.data);
      setForums([normalizedForum, ...forums]);
      setShowCreateModal(false);
    } catch (err: any) {
      console.error("Error creating forum:", err);
      alert(err.response?.data?.message || "Failed to create forum");
    } finally {
      setIsCreatingForum(false);
    }
  };

  const handleUpdateForum = (updatedForum: Forum) => {
    // Normalize the updated forum data
    const normalizedForum = normalizeForum(updatedForum);
    setForums(
      forums.map((forum) =>
        forum.id === normalizedForum.id ? normalizedForum : forum
      )
    );
  };

  const handleDeleteForum = (forumId: string) => {
    setForums(forums.filter((forum) => forum.id !== forumId));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Forums</h1>

        <div className="flex space-x-2">
          <button
            onClick={fetchForums}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
            aria-label="Refresh forums"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          {isAuthenticated() && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Create New Forum
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : forums.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-500">No forums yet</h3>
          {isAuthenticated() ? (
            <p className="mt-2 text-gray-500">
              Be the first to create a discussion!
            </p>
          ) : (
            <p className="mt-2 text-gray-500">
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>{" "}
              to create the first forum!
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {forums.map((forum) => (
            <ForumCard
              key={forum.id}
              forum={forum}
              onForumUpdate={handleUpdateForum}
              onForumDelete={handleDeleteForum}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateForumModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateForum}
          isLoading={isCreatingForum}
        />
      )}
    </div>
  );
};

export default Home;
