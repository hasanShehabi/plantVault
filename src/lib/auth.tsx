import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { MockUser, UserRole } from "@/types/role";

const ROLE_KEY = "plantvault-role";

interface AuthContextValue {
  user: MockUser | null;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const makeUser = (role: UserRole): MockUser =>
  role === "admin"
    ? { id: "admin_1", name: "Farm Admin", role }
    : { id: "u1", name: "Maya Patel", role };

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<MockUser | null>(() => {
    const role = window.localStorage.getItem(ROLE_KEY) as UserRole | null;
    return role ? makeUser(role) : null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setRole: (role: UserRole) => {
        window.localStorage.setItem(ROLE_KEY, role);
        setUser(makeUser(role));
      },
      clearRole: () => {
        window.localStorage.removeItem(ROLE_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
