import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "../atoms/Button";

interface ActionButtonsProps {
  onGeneratePDF: () => void;
  onGenerateXLSX: () => void;
  onGenerateXLS: () => void;
  isGenerating: boolean;
}

export function ActionButtons({
  onGeneratePDF,
  onGenerateXLSX,
  onGenerateXLS,
  isGenerating,
}: ActionButtonsProps) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <Button
        variant="primary"
        onClick={onGeneratePDF}
        disabled={isGenerating}
        icon={<Download size={16} />}
        isLoading={isGenerating}
      >
        {isGenerating ? "Gerando..." : "PDF"}
      </Button>

      <Button
        variant="success"
        onClick={onGenerateXLSX}
        disabled={isGenerating}
        icon={<FileSpreadsheet size={16} />}
        isLoading={isGenerating}
      >
        {isGenerating ? "Gerando..." : "XLSX"}
      </Button>

      <Button
        variant="warning"
        onClick={onGenerateXLS}
        disabled={isGenerating}
        icon={<FileSpreadsheet size={16} />}
        isLoading={isGenerating}
      >
        {isGenerating ? "Gerando..." : "XLS"}
      </Button>
    </div>
  );
}
