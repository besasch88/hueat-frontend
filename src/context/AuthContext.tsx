import { jwtDecode } from 'jwt-decode';
import { createContext, useContext } from 'react';

export type Permission =
  | 'read-printer'
  | 'write-printer'
  | 'read-menu'
  | 'write-menu'
  | 'read-my-tables'
  | 'write-my-tables'
  | 'read-other-tables'
  | 'write-other-tables'
  | 'read-takeaway'
  | 'write-takeaway'
  | 'read-statistics'
  | 'delete-statistics';

export interface JwtClaims {
  iss: string; // issuer
  sub: string; // subject (e.g., username)
  exp: number; // expiration timestamp (unix)
  iat: number; // issued at timestamp (unix)
  jti: string; // JWT ID
  permissions: Permission[]; // array of permissions
}

export type AuthContextType = {
  getUserId: () => string | null;
  getUsername: () => string | null;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getPermissions: () => string[];
  login: (userId: string, username: string, accessToken: string, refreshToken: string) => void;
  refresh: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  hasPermissionTo: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const getUserId = () => {
    return localStorage.getItem('userId');
  };

  const getUsername = () => {
    return localStorage.getItem('username');
  };

  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
  };

  const getPermissions = () => {
    const accessToken = getAccessToken();
    if (!accessToken) return [];
    const decoded = jwtDecode<JwtClaims>(accessToken);
    return decoded.permissions;
  };

  const login = (userId: string, username: string, accessToken: string, refreshToken: string) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const refresh = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const hasPermissionTo = (permission: Permission): boolean => {
    return getPermissions().includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        getUserId,
        getUsername,
        getAccessToken,
        getRefreshToken,
        hasPermissionTo,
        getPermissions,
        login,
        refresh,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
