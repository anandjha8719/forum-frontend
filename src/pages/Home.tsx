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
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  _count: {
    comments: number;
  };
}

const Home = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { isAuthenticated } = useContext(UserContext);

  useEffect(() => {
    const fetchForums = async () => {
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

    fetchForums();
  }, []);

  const handleCreateForum = async (forum: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    try {
      const response = await api.post("/forums", forum);
      setForums([response.data, ...forums]);
      setShowCreateModal(false);
    } catch (err: any) {
      console.error("Error creating forum:", err);
      alert(err.response?.data?.message || "Failed to create forum");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Forums</h1>

        {isAuthenticated() && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded pointer"
          >
            Create New Forum
          </button>
        )}
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
            <ForumCard key={forum.id} forum={forum} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateForumModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateForum}
        />
      )}
    </div>
  );
};

export default Home;
