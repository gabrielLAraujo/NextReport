"use client";

import { useState } from "react";
import { FileText, Download, FileSpreadsheet } from "lucide-react";

export default function Home() {
  const [template, setTemplate] = useState(`<div class="header">
  <h1>{{titulo}}</h1>
  <p>Data: {{data}}</p>
</div>

<div class="content">
  <h2>Resumo</h2>
  <p>{{resumo}}</p>
  
  {{#if mostrarTabela}}
  <h2>Itens</h2>
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Quantidade</th>
        <th>Valor</th>
      </tr>
    </thead>
    <tbody>
      {{#each itens}}
      <tr>
        <td>{{nome}}</td>
        <td>{{quantidade}}</td>
        <td>R$ {{valor}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  {{/if}}
  
  <div class="total">
    <strong>Total: R$ {{total}}</strong>
  </div>
</div>`);

  const [jsonData, setJsonData] = useState(`{
  "titulo": "Relatório de Vendas",
  "data": "15/01/2024",
  "resumo": "Resumo das vendas do mês de janeiro",
  "mostrarTabela": true,
  "itens": [
    {"nome": "Produto A", "quantidade": 2, "valor": "150,00"},
    {"nome": "Produto B", "quantidade": 1, "valor": "300,00"},
    {"nome": "Produto C", "quantidade": 3, "valor": "75,00"}
  ],
  "total": "675,00"
}`);

  const [css, setCss] = useState(`.header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #007bff;
}

.header h1 {
  color: #007bff;
  margin: 0;
  font-size: 28px;
}

.content {
  margin: 20px 0;
}

.content h2 {
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.total {
  text-align: right;
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
  font-size: 18px;
}`);

  const [isGenerating, setIsGenerating] = useState(false);

  const processTemplate = (
    htmlContent: string,
    data: Record<string, unknown>
  ): string => {
    let processedHtml = htmlContent;

    // Substituir variáveis simples
    Object.keys(data).forEach((key) => {
      if (key !== "itens") {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        processedHtml = processedHtml.replace(regex, String(data[key] || ""));
      }
    });

    // Processar loops
    const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
    processedHtml = processedHtml.replace(
      eachRegex,
      (match, arrayName, template) => {
        const array = data[arrayName];
        if (!Array.isArray(array)) return "";

        return array
          .map((item: Record<string, unknown>, index: number) => {
            let itemTemplate = template;
            Object.keys(item).forEach((key) => {
              const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
              itemTemplate = itemTemplate.replace(regex, String(item[key]));
            });
            itemTemplate = itemTemplate.replace(/{{@index}}/g, String(index));
            return itemTemplate;
          })
          .join("");
      }
    );

    // Processar condicionais
    const ifRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
    processedHtml = processedHtml.replace(
      ifRegex,
      (match, condition, content) => {
        return data[condition] ? content : "";
      }
    );

    return processedHtml;
  };

  const getPreviewHtml = () => {
    try {
      const data = JSON.parse(jsonData);
      return processTemplate(template, data);
    } catch (error) {
      return '<p style="color: red;">Erro no JSON: Verifique a sintaxe</p>';
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const data = JSON.parse(jsonData);

      const response = await fetch("/api/v1/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "nxr_demo_key_123456789",
        },
        body: JSON.stringify({
          title: "Relatório Gerado",
          format: "pdf",
          data: data,
          template: template,
          styles: css,
        }),
      });

      if (response.ok) {
        // A resposta agora é um arquivo direto
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Abrir PDF em nova aba
        window.open(url, "_blank");

        // Limpar URL do blob após um tempo
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        const error = await response.json();
        alert("Erro ao gerar PDF: " + error.error);
      }
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      alert(
        "Erro ao processar dados: " +
          (error instanceof Error ? error.message : "Erro desconhecido")
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExcel = async (format: "xlsx" | "xls") => {
    setIsGenerating(true);
    try {
      const data = JSON.parse(jsonData);

      const response = await fetch("/api/v1/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "nxr_demo_key_123456789",
        },
        body: JSON.stringify({
          title: "Relatório Gerado",
          format: format,
          data: data,
          template: "<h1>{{title}}</h1>", // Template simples para Excel
          styles: "",
        }),
      });

      if (response.ok) {
        // A resposta agora é um arquivo direto
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Criar link para download
        const link = document.createElement("a");
        link.href = url;
        link.download = `relatorio_${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpar URL do blob
        window.URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        alert("Erro ao gerar Excel: " + error.error);
      }
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      alert(
        "Erro ao processar dados: " +
          (error instanceof Error ? error.message : "Erro desconhecido")
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          textAlign: "center",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
          <a
            href="/docs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: "#8e44ad",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#7d3c98";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#8e44ad";
            }}
          >
            <FileText size={16} />
            API Docs
          </a>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          height: "calc(100vh - 180px)",
        }}
      >
        {/* Coluna Esquerda - Template e JSON */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Template HTML */}
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
              Template HTML
            </h3>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              style={{
                flex: 1,
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "6px",
                fontFamily: "Consolas, Monaco, monospace",
                fontSize: "13px",
                resize: "none",
                backgroundColor: "#fafafa",
                color: "#2c3e50",
                lineHeight: "1.4",
              }}
              placeholder="Digite seu template HTML aqui..."
            />
          </div>

          {/* CSS */}
          <div
            style={{
              flex: "0.5",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
              CSS (Opcional)
            </h3>
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              style={{
                flex: 1,
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "6px",
                fontFamily: "Consolas, Monaco, monospace",
                fontSize: "13px",
                resize: "none",
                backgroundColor: "#fafafa",
                color: "#2c3e50",
                lineHeight: "1.4",
              }}
              placeholder="Estilos CSS..."
            />
          </div>

          {/* JSON */}
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
              Dados JSON
            </h3>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              style={{
                flex: 1,
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "6px",
                fontFamily: "Consolas, Monaco, monospace",
                fontSize: "13px",
                resize: "none",
                backgroundColor: "#fafafa",
                color: "#2c3e50",
                lineHeight: "1.4",
              }}
              placeholder="Cole seus dados JSON aqui..."
            />
          </div>
        </div>

        {/* Coluna Direita - Preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
            <h3 style={{ margin: 0, color: "#2c3e50" }}>
              Preview do Relatório
            </h3>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  backgroundColor: isGenerating ? "#95a5a6" : "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.backgroundColor = "#2980b9";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.backgroundColor = "#3498db";
                  }
                }}
              >
                {isGenerating ? (
                  <>Gerando...</>
                ) : (
                  <>
                    <Download size={16} />
                    PDF
                  </>
                )}
              </button>

              <button
                onClick={() => generateExcel("xlsx")}
                disabled={isGenerating}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  backgroundColor: isGenerating ? "#95a5a6" : "#27ae60",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.backgroundColor = "#229954";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.backgroundColor = "#27ae60";
                  }
                }}
              >
                {isGenerating ? (
                  <>Gerando...</>
                ) : (
                  <>
                    <FileSpreadsheet size={16} />
                    XLSX
                  </>
                )}
              </button>

              <button
                onClick={() => generateExcel("xls")}
                disabled={isGenerating}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  backgroundColor: isGenerating ? "#95a5a6" : "#e67e22",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.backgroundColor = "#d35400";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.backgroundColor = "#e67e22";
                  }
                }}
              >
                {isGenerating ? (
                  <>Gerando...</>
                ) : (
                  <>
                    <FileSpreadsheet size={16} />
                    XLS
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              border: "2px solid #e0e0e0",
              borderRadius: "6px",
              padding: "20px",
              backgroundColor: "#ffffff",
              overflow: "auto",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
              /* Estilos base para garantir legibilidade */
              .preview-container {
                color: #2c3e50 !important;
                font-family: Arial, sans-serif;
                line-height: 1.6;
              }
              .preview-container h1, .preview-container h2, .preview-container h3, 
              .preview-container h4, .preview-container h5, .preview-container h6 {
                color: #2c3e50 !important;
              }
              .preview-container p, .preview-container td, .preview-container th {
                color: #34495e !important;
              }
              .preview-container table {
                border-collapse: collapse;
                width: 100%;
              }
              .preview-container th, .preview-container td {
                border: 1px solid #bdc3c7;
                padding: 8px;
                text-align: left;
              }
              .preview-container th {
                background-color: #ecf0f1;
                font-weight: bold;
                color: #2c3e50 !important;
              }
              /* CSS personalizado do usuário */
              ${css}
            `,
              }}
            />
            <div
              className="preview-container"
              dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
            />
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          fontSize: "14px",
          color: "#34495e",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <strong style={{ color: "#2c3e50" }}>Instruções de Uso:</strong>
        <ul
          style={{ margin: "10px 0", paddingLeft: "20px", lineHeight: "1.6" }}
        >
          <li>
            <code
              style={{
                backgroundColor: "#ecf0f1",
                padding: "2px 6px",
                borderRadius: "3px",
                color: "#e74c3c",
              }}
            >{`{{variavel}}`}</code>{" "}
            - Para variáveis simples
          </li>
          <li>
            <code
              style={{
                backgroundColor: "#ecf0f1",
                padding: "2px 6px",
                borderRadius: "3px",
                color: "#e74c3c",
              }}
            >{`{{#each array}} ... {{/each}}`}</code>{" "}
            - Para loops em arrays
          </li>
          <li>
            <code
              style={{
                backgroundColor: "#ecf0f1",
                padding: "2px 6px",
                borderRadius: "3px",
                color: "#e74c3c",
              }}
            >{`{{#if condicao}} ... {{/if}}`}</code>{" "}
            - Para condicionais
          </li>
          <li>
            <code
              style={{
                backgroundColor: "#ecf0f1",
                padding: "2px 6px",
                borderRadius: "3px",
                color: "#e74c3c",
              }}
            >{`{{@index}}`}</code>{" "}
            - Para índice em loops
          </li>
        </ul>
      </div>
    </div>
  );
}
