
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

  // optional util method, not necessery, handled from backend
export const normalizeForum = (forum: Forum): Forum => {
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

