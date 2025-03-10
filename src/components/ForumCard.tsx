import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface ForumCardProps {
  forum: {
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
  };
}

const ForumCard = ({ forum }: ForumCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(forum.createdAt), { addSuffix: true });
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        <Link to={`/forums/${forum.id}`}>
          <h2 className="text-xl font-bold text-gray-800 hover:text-indigo-600 mb-2">{forum.title}</h2>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{forum.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {forum.tags.map((tag, index) => (
            <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
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
                  {(forum.author.name?.[0] || forum.author.email[0]).toUpperCase()}
                </span>
              </div>
            )}
            <span>{forum.author.name || forum.author.email}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>{timeAgo}</span>
            <span>{forum._count.comments} comment{forum._count.comments !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumCard;