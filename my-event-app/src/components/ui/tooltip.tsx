import React, { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  text: string;
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children, text }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      {children}
      <span className="absolute bottom-full mb-2 hidden group-hover:block rounded bg-gray-800 px-2 py-1 text-xs text-white whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}
