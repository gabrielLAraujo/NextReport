import { FileText } from "lucide-react";
import { Card } from "../atoms/Card";
import { Button } from "../atoms/Button";

export function Header() {
  return (
    <Card
      style={{
        marginBottom: "20px",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>
            NextReport - Gerador de Relatórios
          </h1>
          <p style={{ color: "#34495e", margin: 0 }}>
            Crie templates, visualize o preview e gere PDFs/Excel
          </p>
        </div>

        <Button
          variant="purple"
          onClick={() => window.open("/docs", "_blank")}
          icon={<FileText size={16} />}
        >
          API Docs
        </Button>
      </div>
    </Card>
  );
}
