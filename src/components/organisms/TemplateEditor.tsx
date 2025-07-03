import { Card } from "../atoms/Card";
import { FormField } from "../molecules/FormField";

interface TemplateEditorProps {
  template: string;
  css: string;
  jsonData: string;
  onTemplateChange: (value: string) => void;
  onCssChange: (value: string) => void;
  onJsonChange: (value: string) => void;
}

export function TemplateEditor({
  template,
  css,
  jsonData,
  onTemplateChange,
  onCssChange,
  onJsonChange,
}: TemplateEditorProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* Template HTML */}
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "20px",
          minHeight: "300px",
          boxSizing: "border-box",
        }}
      >
        <FormField
          label="Template HTML"
          value={template}
          onChange={onTemplateChange}
          placeholder="Digite seu template HTML aqui..."
          rows={12}
          language="html"
        />
      </Card>

      {/* CSS */}
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "20px",
          minHeight: "200px",
          boxSizing: "border-box",
        }}
      >
        <FormField
          label="CSS (Opcional)"
          value={css}
          onChange={onCssChange}
          placeholder="Estilos CSS..."
          rows={8}
          language="css"
        />
      </Card>

      {/* JSON */}
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "20px",
          minHeight: "300px",
          boxSizing: "border-box",
        }}
      >
        <FormField
          label="Dados JSON"
          value={jsonData}
          onChange={onJsonChange}
          placeholder="Cole seus dados JSON aqui..."
          rows={12}
          language="json"
        />
      </Card>
    </div>
  );
}
