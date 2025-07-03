import { HTMLAttributes } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "html" | "css" | "json" | "javascript";
  rows?: number;
  placeholder?: string;
  style?: React.CSSProperties;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export function CodeEditor({
  value,
  onChange,
  language = "html",
  rows = 8,
  placeholder,
  style,
  onFocus,
  onBlur,
}: CodeEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      rows={rows}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px",
        border: "2px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "15px",
        fontFamily:
          "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace",
        lineHeight: "1.5",
        color: "#000000",
        backgroundColor: "#ffffff",
        resize: "vertical",
        minHeight: `${rows * 24}px`,
        transition: "all 0.2s ease",
        boxSizing: "border-box",
        outline: "none",
        WebkitTextFillColor: "#000000",
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#2563eb";
        e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
        onFocus?.(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#d1d5db";
        e.target.style.boxShadow = "none";
        onBlur?.(e);
      }}
    />
  );
}
