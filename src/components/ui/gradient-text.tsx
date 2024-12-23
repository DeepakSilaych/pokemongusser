"use client";

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span className={cn(
      "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x",
      className
    )}>
      {children}
    </span>
  );
}
