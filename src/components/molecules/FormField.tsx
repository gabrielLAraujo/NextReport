import { CodeEditor } from "../atoms/CodeEditor";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  language?: "html" | "css" | "json" | "javascript";
  error?: string;
}

export function FormField({
  label,
  value,
  onChange,
  placeholder,
  rows = 8,
  language = "html",
  error,
}: FormFieldProps) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "inherit",
      }}
    >
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CodeEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          language={language}
          style={{
            flex: 1,
            minHeight: "inherit",
          }}
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
    </div>
  );
}
