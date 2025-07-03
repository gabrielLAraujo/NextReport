import { TextareaHTMLAttributes } from "react";

interface CodeEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  language?: "html" | "css" | "json";
}

export function CodeEditor({
  label,
  error,
  language = "html",
  className = "",
  ...props
}: CodeEditorProps) {
  const getPlaceholderText = () => {
    switch (language) {
      case "html":
        return "Digite seu template HTML aqui...";
      case "css":
        return "Estilos CSS...";
      case "json":
        return "Cole seus dados JSON aqui...";
      default:
        return "Digite seu código aqui...";
    }
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: 700,
            color: "#000000",
            fontSize: "16px",
            textShadow: "none",
          }}
        >
          {label}
        </label>
      )}
      <textarea
        className={className}
        placeholder={props.placeholder || getPlaceholderText()}
        style={{
          width: "100%",
          padding: "16px",
          border: `2px solid ${error ? "#e74c3c" : "#cbd5e1"}`,
          borderRadius: "8px",
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
          fontSize: "15px",
          resize: "none",
          backgroundColor: "#ffffff",
          color: "#000000",
          lineHeight: "1.6",
          outline: "none",
          transition: "all 0.3s ease",
          fontWeight: "400",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          flex: 1,
          minHeight: "inherit",
          maxHeight: "inherit",
          boxSizing: "border-box",
          ...props.style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#2563eb";
          e.target.style.backgroundColor = "#fefefe";
          e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#e74c3c" : "#cbd5e1";
          e.target.style.backgroundColor = "#ffffff";
          e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            display: "block",
            marginTop: "6px",
            fontSize: "13px",
            color: "#e74c3c",
            fontWeight: "500",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
