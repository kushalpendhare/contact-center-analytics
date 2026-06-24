import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type User = {
  user_id: number;
  organization_id: number;
  email: string;
  role: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (
    token: string,
    user: User
  ) => void;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem("token")
    );

  const [user, setUser] =
    useState<User | null>(
      JSON.parse(
        localStorage.getItem(
          "user"
        ) || "null"
      )
    );

  const login = (
    jwtToken: string,
    userData: User
  ) => {
    localStorage.setItem(
      "token",
      jwtToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "Auth Provider Missing"
    );
  }

  return context;
}