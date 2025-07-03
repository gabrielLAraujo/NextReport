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
        height: "fit-content",
        minHeight: "calc(100vh - 200px)",
        width: "100%",
      }}
    >
      {/* Template HTML */}
      <Card
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          minHeight: "300px",
          maxHeight: "400px",
          width: "100%",
          padding: "20px",
        }}
      >
        <FormField
          label="Template HTML"
          value={template}
          onChange={onTemplateChange}
          placeholder="Digite seu template HTML aqui..."
          rows={10}
          language="html"
        />
      </Card>

      {/* CSS */}
      <Card
        style={{
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
          maxHeight: "250px",
          width: "100%",
          padding: "20px",
        }}
      >
        <FormField
          label="CSS (Opcional)"
          value={css}
          onChange={onCssChange}
          placeholder="Estilos CSS..."
          rows={6}
          language="css"
        />
      </Card>

      {/* JSON */}
      <Card
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          minHeight: "300px",
          maxHeight: "400px",
          width: "100%",
          padding: "20px",
        }}
      >
        <FormField
          label="Dados JSON"
          value={jsonData}
          onChange={onJsonChange}
          placeholder="Cole seus dados JSON aqui..."
          rows={10}
          language="json"
        />
      </Card>
    </div>
  );
}
