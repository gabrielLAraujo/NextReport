import { TextArea } from "../atoms/TextArea";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}

export function FormField({
  label,
  value,
  onChange,
  placeholder,
  rows = 10,
  error,
}: FormFieldProps) {
  return (
    <TextArea
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      error={error}
      style={{
        flex: 1,
        minHeight: rows === 10 ? "300px" : rows === 6 ? "200px" : "400px",
        maxHeight: rows === 10 ? "400px" : rows === 6 ? "250px" : "400px",
      }}
    />
  );
}
