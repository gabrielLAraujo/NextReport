import { CodeEditor } from "../atoms/CodeEditor";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  language?: "html" | "css" | "json";
}

export function FormField({
  label,
  value,
  onChange,
  placeholder,
  rows = 10,
  error,
  language = "html",
}: FormFieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <CodeEditor
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        error={error}
        language={language}
        style={{
          flex: 1,
          width: "100%",
          minHeight: rows === 10 ? "300px" : rows === 6 ? "200px" : "400px",
          maxHeight: rows === 10 ? "400px" : rows === 6 ? "250px" : "400px",
          height: "100%",
        }}
      />
    </div>
  );
}
