import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg"; 
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    
    const sizes = {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    
    const variants = {
      default: "bg-yellow-400 hover:bg-yellow-500 text-black",
      outline: "border border-white text-white hover:bg-white/10",
      ghost: "text-white hover:bg-white/10",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
