"use client";

import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect, useRef, useState } from "react";

interface SessionData {
  session: unknown;
  user: unknown;
}

// Create a shared session cache
const sessionCache = {
  data: null as SessionData | null,
  timestamp: 0,
  isLoading: false,
  listeners: new Set<() => void>(),

  // Cache for 30 seconds
  CACHE_DURATION: 30 * 1000,

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },

  notify() {
    this.listeners.forEach((callback) => callback());
  },

  isExpired() {
    return Date.now() - this.timestamp > this.CACHE_DURATION;
  },

  setData(data: SessionData | null) {
    this.data = data;
    this.timestamp = Date.now();
    this.isLoading = false;
    this.notify();
  },

  setLoading(loading: boolean) {
    this.isLoading = loading;
    this.notify();
  },
};

/**
 * Optimized session hook that reduces API calls by:
 * 1. Caching session data for 30 seconds
 * 2. Sharing session state across all components
 * 3. Deduplicating simultaneous requests
 */
export function useOptimizedSession() {
  const { data: authData, isPending: authPending } = authClient.useSession();
  const lastCallRef = useRef<Promise<SessionData | null> | null>(null);

  // Force re-render when cache updates
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = sessionCache.subscribe(() => {
      forceUpdate((prev) => prev + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch session with deduplication
  const fetchSession = useCallback(async () => {
    // If already loading, wait for existing request
    if (lastCallRef.current) {
      return lastCallRef.current;
    }

    // If cache is fresh, use cached data
    if (sessionCache.data && !sessionCache.isExpired()) {
      return sessionCache.data;
    }

    // Mark as loading
    sessionCache.setLoading(true);

    // Create new request
    const promise = new Promise<SessionData | null>((resolve) => {
      // Wait for better-auth's useSession to complete
      const checkAuth = () => {
        if (!authPending && authData !== undefined) {
          sessionCache.setData(authData);
          resolve(authData);
          lastCallRef.current = null;
        } else {
          setTimeout(checkAuth, 50);
        }
      };
      checkAuth();
    });

    lastCallRef.current = promise;
    return promise;
  }, [authData, authPending]);

  // Initialize fetch on mount if needed
  useEffect(() => {
    if (!sessionCache.data && !sessionCache.isLoading && !authPending) {
      fetchSession();
    }
  }, [fetchSession, authPending]);

  // Return cached data if available and fresh
  if (sessionCache.data && !sessionCache.isExpired()) {
    return {
      data: sessionCache.data,
      isPending: false,
      isLoading: false,
      refetch: fetchSession,
    };
  }

  // Return loading state
  if (sessionCache.isLoading || authPending) {
    return {
      data: sessionCache.data,
      isPending: true,
      isLoading: true,
      refetch: fetchSession,
    };
  }

  // Return fresh data from better-auth
  if (authData !== sessionCache.data) {
    sessionCache.setData(authData);
  }

  return {
    data: authData,
    isPending: authPending,
    isLoading: false,
    refetch: fetchSession,
  };
}
