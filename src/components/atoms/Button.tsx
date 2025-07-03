import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "success" | "warning" | "purple";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center gap-2 border-none rounded-md cursor-pointer font-medium text-decoration-none transition-all duration-300 ease-in-out";

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-orange-500 text-white hover:bg-orange-600",
    purple: "bg-purple-500 text-white hover:bg-purple-600",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        isDisabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
      disabled={isDisabled}
      style={{
        backgroundColor:
          variant === "primary"
            ? "#3498db"
            : variant === "success"
            ? "#27ae60"
            : variant === "warning"
            ? "#e67e22"
            : "#8e44ad",
        color: "white",
        padding:
          size === "sm"
            ? "8px 12px"
            : size === "lg"
            ? "12px 24px"
            : "10px 20px",
        fontSize: size === "sm" ? "14px" : size === "lg" ? "18px" : "16px",
        borderRadius: "6px",
        border: "none",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: 500,
        textDecoration: "none",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor =
            variant === "primary"
              ? "#2980b9"
              : variant === "success"
              ? "#229954"
              : variant === "warning"
              ? "#d35400"
              : "#7d3c98";
        }
      }}
      onMouseOut={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor =
            variant === "primary"
              ? "#3498db"
              : variant === "success"
              ? "#27ae60"
              : variant === "warning"
              ? "#e67e22"
              : "#8e44ad";
        }
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {icon && icon}
          {children}
        </>
      )}
    </button>
  );
}
