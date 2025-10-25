import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded font-medium transition",
          variant === "default" && "bg-yellow-400 hover:bg-yellow-500 text-black",
          variant === "outline" && "border border-white text-white hover:bg-white/10",
          variant === "ghost" && "text-white hover:bg-white/10",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
