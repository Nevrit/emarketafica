import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configuration d'Axios
const API_URL = 'https://ecommerce-backend-2-12tl.onrender.com/api';

// Configuration globale d'Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

// Intercepteur pour ajouter le token aux requêtes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  provider?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.error("Erreur de chargement utilisateur:", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await axios.post('/auth/login', { email, password });
      
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setUser(user);
        navigate('/profile');
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw new Error('Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const res = await axios.post('/auth/register', { 
        username, 
        email, 
        password 
      });
      
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setUser(user);
        navigate('/profile');
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      throw new Error('Échec de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) return;
      
      const res = await axios.put('/auth/updatedetails', updates);
      
      if (res.data.success) {
        setUser({ ...user, ...res.data.data });
      }
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      throw new Error('Échec de la mise à jour');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};