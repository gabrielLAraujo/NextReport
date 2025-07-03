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
        /* Reset para textareas */
        textarea {
          color: #000000 !important;
          font-weight: 400 !important;
          -webkit-text-fill-color: #000000 !important;
          font-family: "JetBrains Mono", "Fira Code", "Monaco", "Consolas",
            monospace !important;
          font-size: 15px !important;
          line-height: 1.5 !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        textarea::placeholder {
          color: #6b7280 !important;
          opacity: 1 !important;
        }

        textarea:focus {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          outline: 2px solid #2563eb !important;
          outline-offset: 2px !important;
        }

        /* Estilos para labels */
        label {
          color: #000000 !important;
          font-weight: 700 !important;
          font-size: 16px !important;
          margin-bottom: 8px !important;
          display: block !important;
        }

        /* Grid responsivo */
        .main-grid {
          container-type: inline-size;
        }

        /* Responsividade aprimorada */
        @media (max-width: 1400px) {
          .main-grid {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }

          .left-column {
            order: 1;
          }

          .right-column {
            order: 2;
            position: static !important;
          }
        }

        @media (max-width: 768px) {
          .main-grid {
            gap: 15px !important;
            margin: 10px 0 !important;
          }
        }

        /* Melhorar scrollbars */
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        *::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </>
  );
}
