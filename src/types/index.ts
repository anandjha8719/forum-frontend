export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface UserContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
}

export interface Forum {
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

export interface Comment {
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

export interface CommentSectionProps {
  forumId: string;
  initialComments: Comment[];
  expanded: boolean;
  onToggle: () => void;
}
