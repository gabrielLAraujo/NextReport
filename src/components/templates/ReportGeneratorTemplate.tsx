import { ReactNode } from "react";

interface ReportGeneratorTemplateProps {
  children: ReactNode;
}

export function ReportGeneratorTemplate({
  children,
}: ReportGeneratorTemplateProps) {
  return (
    <>
      <style jsx global>{`
        @media (max-width: 1200px) {
          .main-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          .left-column {
            min-height: auto !important;
          }
          .right-column {
            min-height: 500px !important;
            max-height: 600px !important;
          }
        }
      `}</style>
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </>
  );
}
