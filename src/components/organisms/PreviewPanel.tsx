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
        width: "100%",
        padding: "15px",
        minHeight: "800px",
        boxSizing: "border-box",
        position: "sticky",
        top: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          flexShrink: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#2c3e50",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Preview do Relatório
        </h3>

        <ActionButtons
          onGeneratePDF={onGeneratePDF}
          onGenerateXLSX={onGenerateXLSX}
          onGenerateXLS={onGenerateXLS}
          isGenerating={isGenerating}
        />
      </div>

      <div
        style={{
          flex: "1",
          border: "2px solid #e0e0e0",
          borderRadius: "8px",
          padding: "0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
          minHeight: "700px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PreviewFrame htmlContent={htmlContent} cssContent={cssContent} />
      </div>
    </Card>
  );
}
