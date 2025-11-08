"use client";

import { useConfetti } from "@/hooks/use-confetti";
import { useEffect } from "react";

interface ConfettiWrapperProps {
  children: React.ReactNode;
}

export function ConfettiWrapper({ children }: ConfettiWrapperProps) {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    // Trigger confetti after component mounts
    const timer = setTimeout(() => {
      triggerConfetti();
    }, 500); // Small delay for better UX

    return () => clearTimeout(timer);
  }, [triggerConfetti]);

  return <>{children}</>;
}
