import * as React from "react";
import { cn } from "../lib/utils"; // or use relative path: "../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  className = "",
  children,
  ...props
}) => {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition focus:outline-none";
  const variants: Record<string, string> = {
    default: "bg-gradient-to-r from-yellow-400 to-green-400 text-black hover:opacity-90",
    ghost: "text-white hover:text-yellow-400",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
