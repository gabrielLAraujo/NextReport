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
            fontWeight: 500,
            color: "#2c3e50",
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
          fontSize: "13px",
          resize: "none",
          backgroundColor: "#fafafa",
          color: "#2c3e50",
          lineHeight: "1.4",
          outline: "none",
          transition: "border-color 0.3s ease",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#3498db";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#e74c3c" : "#e0e0e0";
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
