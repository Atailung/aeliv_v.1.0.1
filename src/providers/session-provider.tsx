"use client";

import { authClient } from "@/lib/auth-client";
import { createContext, useContext, ReactNode, useMemo } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  user: User;
}

interface SessionContextType {
  data: Session | null;
  isPending: boolean;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

interface SessionProviderProps {
  children: ReactNode;
}

/**
 * Session Provider that calls useSession only once at the top level
 * and shares the result via React Context to all child components
 */
export function SessionProvider({ children }: SessionProviderProps) {
  const { data: session, isPending } = authClient.useSession();

  const value = useMemo(
    () => ({
      data: session,
      isPending,
      isLoading: isPending,
    }),
    [session, isPending]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

/**
 * Hook to access session data from the SessionProvider
 * This prevents multiple API calls by using shared context
 */
export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
}
