import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('readify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling global errors (like token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and reload or trigger redirect via custom event if needed
      localStorage.removeItem('readify_token');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Helper to map status between frontend and backend
export const mapStatusToBackend = (status) => {
  const mapping = {
    'currently-reading': 'reading',
    'to-read': 'want_to_read',
    'completed': 'completed',
  };
  return mapping[status] || status;
};

export const mapStatusToFrontend = (status) => {
  const mapping = {
    'reading': 'currently-reading',
    'want_to_read': 'to-read',
    'completed': 'completed',
  };
  return mapping[status] || status;
};

// Helper to generate coverColor deterministically based on book title
export const getBookCoverColor = (title) => {
  const COVER_GRADIENTS = [
    'linear-gradient(135deg, #101c38 0%, #1e3c72 100%)', // Deep Navy
    'linear-gradient(135deg, #a86b32 0%, #6e401c 100%)', // Desert Rust
    'linear-gradient(135deg, #e4a853 0%, #b85c38 100%)', // Warm Ochre
    'linear-gradient(135deg, #4b5320 0%, #2e3b1c 100%)', // Olive Forest
    'linear-gradient(135deg, #112d32 0%, #254b50 100%)', // Teal Parchment
    'linear-gradient(135deg, #1C120C 0%, #4D331F 100%)', // Dark Charcoal
    'linear-gradient(135deg, #444E4F 0%, #151F20 100%)', // Slate
    'linear-gradient(135deg, #BC7C33 0%, #68380A 100%)', // Golden Clay
    'linear-gradient(135deg, #8C7550 0%, #3B301B 100%)', // Bronze Stone
    'linear-gradient(135deg, #9C3333 0%, #4C1212 100%)', // Crimson Red
  ];

  if (!title) return COVER_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COVER_GRADIENTS.length;
  return COVER_GRADIENTS[index];
};

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('readify_token', response.data.token);
    }
    return response.data;
  },
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('readify_token');
  },
};

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
  updateGoal: async (goalValue) => {
    const response = await api.patch('/dashboard/goal', { yearlyReadingGoal: goalValue });
    return response.data;
  },
};

export const shelfService = {
  getBooks: async (filters = {}) => {
    const response = await api.get('/shelf', { params: filters });
    return response.data.books || [];
  },
  addBook: async (bookData) => {
    const response = await api.post('/shelf', bookData);
    return response.data.book;
  },
  updateBook: async (id, updateData) => {
    const response = await api.patch(`/shelf/${id}`, updateData);
    return response.data.book;
  },
  deleteBook: async (id) => {
    const response = await api.delete(`/shelf/${id}`);
    return response.data;
  },
};

export const booksService = {
  search: async (query) => {
    const response = await api.get('/books/search', { params: { query } });
    return response.data.books || [];
  },
  getRecommendations: async () => {
    const response = await api.get('/books/recommendations');
    return response.data;
  },
};

export const reflectionsService = {
  getAllReflections: async () => {
    const response = await api.get('/reflection');
    return response.data.reflections || [];
  },
  getReflectionsForBook: async (bookId) => {
    const response = await api.get(`/reflection/${bookId}`);
    return response.data.reflections || [];
  },
  addReflection: async (bookId, content) => {
    const response = await api.post(`/reflection/${bookId}`, { content });
    return response.data.reflection;
  },
};

export default api;
