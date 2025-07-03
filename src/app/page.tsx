"use client";

import { useReportGenerator } from '@/hooks/useReportGenerator';
import { ReportGeneratorTemplate } from '@/components/templates/ReportGeneratorTemplate';
import { Header } from '@/components/organisms/Header';
import { TemplateEditor } from '@/components/organisms/TemplateEditor';
import { PreviewPanel } from '@/components/organisms/PreviewPanel';
import { HelpSection } from '@/components/organisms/HelpSection';

export default function Home() {
  const {
    template,
    jsonData,
    css,
    isGenerating,
    setTemplate,
    setJsonData,
    setCss,
    getPreviewHtml,
    generatePDF,
    generateXLSX,
    generateXLS,
  } = useReportGenerator();

  return (
    <ReportGeneratorTemplate>
      <Header />

      <div
        className="main-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "20px",
          alignItems: "start",
          gridAutoRows: "max-content",
        }}
      >
        {/* Coluna Esquerda - Template Editor */}
        <div className="left-column" style={{ width: "100%" }}>
          <TemplateEditor
            template={template}
            css={css}
            jsonData={jsonData}
            onTemplateChange={setTemplate}
            onCssChange={setCss}
            onJsonChange={setJsonData}
          />
        </div>

        {/* Coluna Direita - Preview Panel */}
        <div className="right-column" style={{ width: "100%" }}>
          <PreviewPanel
            htmlContent={getPreviewHtml()}
            cssContent={css}
            onGeneratePDF={generatePDF}
            onGenerateXLSX={generateXLSX}
            onGenerateXLS={generateXLS}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      <HelpSection />
    </ReportGeneratorTemplate>
  );
}
