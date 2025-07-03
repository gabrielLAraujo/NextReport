import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  shadow?: boolean;
}

export function Card({
  children,
  padding = "md",
  shadow = true,
  className = "",
  style,
  ...props
}: CardProps) {
  const paddings = {
    sm: "12px",
    md: "20px",
    lg: "32px",
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: shadow ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
        padding: paddings[padding],
        marginBottom: "20px",
        border: shadow ? "none" : "1px solid #e0e0e0",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
