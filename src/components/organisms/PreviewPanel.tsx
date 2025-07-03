import { Card } from "../atoms/Card";
import { ActionButtons } from "../molecules/ActionButtons";
import { PreviewFrame } from "../molecules/PreviewFrame";

interface PreviewPanelProps {
  htmlContent: string;
  cssContent: string;
  onGeneratePDF: () => void;
  onGenerateXLSX: () => void;
  onGenerateXLS: () => void;
  isGenerating: boolean;
}

export function PreviewPanel({
  htmlContent,
  cssContent,
  onGeneratePDF,
  onGenerateXLSX,
  onGenerateXLS,
  isGenerating,
}: PreviewPanelProps) {
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
        minHeight: "calc(100vh - 200px)",
        maxHeight: "calc(100vh - 200px)",
        padding: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h3 style={{ margin: 0, color: "#2c3e50" }}>Preview do Relatório</h3>

        <ActionButtons
          onGeneratePDF={onGeneratePDF}
          onGenerateXLSX={onGenerateXLSX}
          onGenerateXLS={onGenerateXLS}
          isGenerating={isGenerating}
        />
      </div>

      <div
        style={{
          flex: "1 1 auto",
          border: "2px solid #e0e0e0",
          borderRadius: "6px",
          padding: "0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          minHeight: "500px",
          maxHeight: "calc(100vh - 300px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PreviewFrame htmlContent={htmlContent} cssContent={cssContent} />
      </div>
    </Card>
  );
}
