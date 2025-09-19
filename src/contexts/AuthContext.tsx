import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, ApiError } from '../types/auth';
import { apiService } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('auth_token');
    if (token) {
      const fetchUser = async () => {
        setIsLoading(true);
        try {
          const userData = await apiService.getCurrentUser(token); // Debes tener este método en tu apiService
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('auth_token');
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);



  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(credentials);
      setUser(response.user);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${response.user.username}`,
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Error de autenticación",
        description: apiError.message || "Credenciales incorrectas",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};