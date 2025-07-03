import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({
  label,
  error,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <div style={{ marginBottom: "20px" }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
            color: "#1a1a1a",
            fontSize: "15px",
          }}
        >
          {label}
        </label>
      )}
      <textarea
        className={className}
        style={{
          width: "100%",
          padding: "12px",
          border: `2px solid ${error ? "#e74c3c" : "#e0e0e0"}`,
          borderRadius: "6px",
          fontFamily: "Consolas, Monaco, monospace",
          fontSize: "14px",
          resize: "none",
          backgroundColor: "#ffffff",
          color: "#1a1a1a",
          lineHeight: "1.5",
          outline: "none",
          transition: "border-color 0.3s ease",
          fontWeight: "500",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#3498db";
          e.target.style.backgroundColor = "#f8f9fa";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#e74c3c" : "#e0e0e0";
          e.target.style.backgroundColor = "#ffffff";
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            display: "block",
            marginTop: "4px",
            fontSize: "12px",
            color: "#e74c3c",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
