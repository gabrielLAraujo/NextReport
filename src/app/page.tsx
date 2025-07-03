"use client";

import { useState } from "react";
import { FileText, Download, FileSpreadsheet } from "lucide-react";

export default function Home() {
  const [template, setTemplate] = useState(`<div class="header">
  <h1>{{upper titulo}}</h1>
  <p>Data: {{date dataAtual "dd/MM/yyyy HH:mm"}}</p>
  <p>Empresa: {{capitalize empresa}}</p>
</div>

<div class="content">
  <h2>Resumo Executivo</h2>
  <p>{{resumo}}</p>
  
  <div class="metricas">
    <div class="metric">
      <h3>Receita Total</h3>
      <span class="valor">{{currency receita}}</span>
    </div>
    <div class="metric">
      <h3>Total de Itens</h3>
      <span class="valor">{{count itens}} itens</span>
    </div>
  </div>
  
  {{#if mostrarTabela}}
  <h2>Detalhamento de Vendas</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Valor Unitário</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{#eachWithIndex itens}}
      <tr class="{{#if even}}even{{else}}odd{{/if}}">
        <td>{{math index "+" 1}}</td>
        <td>{{capitalize nome}}</td>
        <td>{{number quantidade}}</td>
        <td>{{currency valorUnitario}}</td>
        <td>{{currency total}}</td>
      </tr>
      {{/eachWithIndex}}
    </tbody>
  </table>
  {{/if}}
  
  <div class="summary">
    <div class="total-section">
      <p><strong>Subtotal: {{currency subtotal}}</strong></p>
      <p><strong>Quantidade Total: {{totalQuantidade}} itens</strong></p>
      <p><strong>TOTAL GERAL: {{currency totalGeral}}</strong></p>
    </div>
  </div>
</div>`);

  const [jsonData, setJsonData] = useState(`{
  "titulo": "relatório de vendas mensal",
  "empresa": "tech solutions ltda",
  "dataAtual": "2024-01-15T14:30:00",
  "resumo": "Análise detalhada das vendas realizadas no mês de janeiro de 2024, incluindo produtos, quantidades e valores.",
  "receita": 125750.50,
  "mostrarTabela": true,
  "itens": [
    {
      "nome": "notebook dell inspiron",
      "quantidade": 2,
      "valorUnitario": 2500.00,
      "total": 5000.00
    },
    {
      "nome": "mouse wireless logitech",
      "quantidade": 15,
      "valorUnitario": 85.50,
      "total": 1282.50
    },
    {
      "nome": "teclado mecânico gamer",
      "quantidade": 8,
      "valorUnitario": 350.00,
      "total": 2800.00
    },
    {
      "nome": "monitor 24 polegadas",
      "quantidade": 5,
      "valorUnitario": 890.00,
      "total": 4450.00
    }
  ],
  "subtotal": 13532.50,
  "totalQuantidade": 30,
  "totalGeral": 13532.50,
  "observacoes": "Vendas superaram a meta em 15%"
}`);

  const [css, setCss] = useState(`/* Estilos principais */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.5;
  color: #333;
  margin: 0;
  padding: 8px;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.header p {
  margin: 3px 0;
  opacity: 0.9;
  font-size: 14px;
}

.content {
  margin: 15px 0;
}

.content h2 {
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
  padding-bottom: 8px;
  margin-bottom: 15px;
  font-size: 18px;
}

/* Métricas */
.metricas {
  display: flex;
  gap: 15px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.metric {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 3px solid #007bff;
  flex: 1;
  min-width: 150px;
  text-align: center;
}

.metric h3 {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.metric .valor {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

/* Tabela */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  font-size: 13px;
}

th {
  background: linear-gradient(135deg, #34495e, #2c3e50);
  color: white;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 1px;
}

td {
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
}

tr.even {
  background-color: #f8f9fa;
}

tr.odd {
  background-color: white;
}

tr:hover {
  background-color: #e3f2fd !important;
  transition: background-color 0.3s ease;
}

/* Resumo */
.summary {
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.total-section {
  text-align: right;
}

.total-section p {
  margin: 6px 0;
  font-size: 14px;
}

.total-section .total {
  font-size: 16px;
  color: #28a745;
  background: white;
  padding: 8px 12px;
  border-radius: 5px;
  display: inline-block;
  margin-top: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Responsividade */
@media (max-width: 768px) {
  .metricas {
    flex-direction: column;
  }
  
  table {
    font-size: 12px;
  }
  
  th, td {
    padding: 6px;
  }
  
  .header h1 {
    font-size: 20px;
  }
  
  .content h2 {
    font-size: 16px;
  }
}`);

  const [isGenerating, setIsGenerating] = useState(false);

  const processTemplate = (
    htmlContent: string,
    data: Record<string, unknown>
  ): string => {
    let html = htmlContent;

    try {
      // Função auxiliar para formatar moeda
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(value);
      };

      // Função auxiliar para formatar número
      const formatNumber = (value: number) => {
        return new Intl.NumberFormat('pt-BR').format(value);
      };

      // Função auxiliar para capitalizar
      const capitalize = (str: string) => {
        return str.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      };

      // Função auxiliar para formatar data
      const formatDate = (dateStr: string, format?: string) => {
        const date = new Date(dateStr);
        if (format === 'dd/MM/yyyy HH:mm') {
          return date.toLocaleString('pt-BR');
        }
        return date.toLocaleDateString('pt-BR');
      };

      // 1. Processar condicionais {{#if condition}}...{{/if}}
      html = html.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match: string, condition: string, content: string) => {
        const conditionValue = data[condition];
        console.log(`Processando condicional: ${condition} = ${conditionValue}`);
        return conditionValue ? content : "";
      });

      // 2. Processar loops {{#eachWithIndex array}}...{{/eachWithIndex}}
      html = html.replace(/\{\{#eachWithIndex\s+(\w+)\}\}([\s\S]*?)\{\{\/eachWithIndex\}\}/g, (match: string, arrayName: string, template: string) => {
        const array = data[arrayName];
        if (!Array.isArray(array)) return "";

        return array.map((item: any, index: number) => {
          let itemHtml = template;
          
          // Processar condicionais even/odd
          itemHtml = itemHtml.replace(/\{\{#if\s+even\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g, 
            (condMatch: string, evenContent: string, oddContent: string) => {
              return index % 2 === 0 ? evenContent : oddContent;
            });
          
          // Processar condicionais simples dentro do loop
          itemHtml = itemHtml.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (condMatch: string, condition: string, content: string) => {
            if (condition === 'even') {
              return index % 2 === 0 ? content : "";
            } else if (condition === 'odd') {
              return index % 2 === 1 ? content : "";
            }
            return item[condition] ? content : "";
          });
          
          // Substituir {{index}}
          itemHtml = itemHtml.replace(/\{\{index\}\}/g, String(index));
          
          // Processar {{math index "+" 1}}
          itemHtml = itemHtml.replace(/\{\{math\s+(\w+)\s+"([+\-*/])"\s+(\d+)\}\}/g, (mathMatch: string, a: string, op: string, b: string) => {
            const numA = a === 'index' ? index : (item[a] || 0);
            const numB = parseInt(b);
            
            switch (op) {
              case '+': return String(numA + numB);
              case '-': return String(numA - numB);
              case '*': return String(numA * numB);
              case '/': return String(numA / numB);
              default: return mathMatch;
            }
          });
          
          // Substituir propriedades do item com helpers
          Object.keys(item).forEach(key => {
            const value = item[key];
            
            // {{currency key}}
            itemHtml = itemHtml.replace(new RegExp(`\\{\\{currency\\s+${key}\\}\\}`, 'g'), 
              typeof value === 'number' ? formatCurrency(value) : String(value));
            
            // {{number key}}
            itemHtml = itemHtml.replace(new RegExp(`\\{\\{number\\s+${key}\\}\\}`, 'g'), 
              typeof value === 'number' ? formatNumber(value) : String(value));
            
            // {{capitalize key}}
            itemHtml = itemHtml.replace(new RegExp(`\\{\\{capitalize\\s+${key}\\}\\}`, 'g'), 
              typeof value === 'string' ? capitalize(value) : String(value));
            
            // {{key}} - substituição simples
            itemHtml = itemHtml.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), String(value));
          });
          
          return itemHtml;
        }).join("");
      });

      // 3. Processar loops simples {{#each array}}...{{/each}}
      html = html.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match: string, arrayName: string, template: string) => {
        const array = data[arrayName];
        if (!Array.isArray(array)) return "";

        return array.map((item: any) => {
          let itemHtml = template;
          Object.keys(item).forEach(key => {
            itemHtml = itemHtml.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), String(item[key]));
          });
          return itemHtml;
        }).join("");
      });

      // 4. Processar helpers para variáveis principais
      Object.keys(data).forEach(key => {
        const value = data[key];
        
        // {{currency key}}
        html = html.replace(new RegExp(`\\{\\{currency\\s+${key}\\}\\}`, 'g'), 
          typeof value === 'number' ? formatCurrency(value) : String(value));
        
        // {{upper key}}
        html = html.replace(new RegExp(`\\{\\{upper\\s+${key}\\}\\}`, 'g'), 
          typeof value === 'string' ? value.toUpperCase() : String(value));
        
        // {{capitalize key}}
        html = html.replace(new RegExp(`\\{\\{capitalize\\s+${key}\\}\\}`, 'g'), 
          typeof value === 'string' ? capitalize(value) : String(value));
        
        // {{date key "format"}}
        html = html.replace(new RegExp(`\\{\\{date\\s+${key}(?:\\s+"([^"]+)")?\\}\\}`, 'g'), (match: string, format?: string) => {
          return typeof value === 'string' ? formatDate(value, format) : String(value);
        });
        
        // {{count key}}
        html = html.replace(new RegExp(`\\{\\{count\\s+${key}\\}\\}`, 'g'), 
          Array.isArray(value) ? String(value.length) : String(value));
        
        // {{number key}}
        html = html.replace(new RegExp(`\\{\\{number\\s+${key}\\}\\}`, 'g'), 
          typeof value === 'number' ? formatNumber(value) : String(value));
      });

      // 5. Substituir variáveis simples {{key}}
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          html = html.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), String(value));
        }
      });

      // 6. Limpar tags não processadas (fallback)
      html = html.replace(/\{\{[^}]*\}\}/g, '');
      html = html.replace(/\{\{\/[^}]*\}\}/g, '');

      console.log('HTML final processado:', html);
      return html;

    } catch (error) {
      console.error('Erro ao processar template:', error);
      return `<div style="color: red; padding: 20px; border: 1px solid red; background: #ffe6e6;">
        <h3>Erro ao processar template:</h3>
        <p>${error}</p>
        <p><strong>Dados:</strong> ${JSON.stringify(data, null, 2)}</p>
      </div>`;
    }
  };

  const getPreviewHtml = () => {
    try {
      const data = JSON.parse(jsonData);
      return processTemplate(template, data);
    } catch (error) {
      return `<div style="color: red; padding: 20px; border: 1px solid red; background: #ffe6e6;">
        <h3>Erro no JSON:</h3>
        <p>${error}</p>
        <p>Verifique a sintaxe do JSON</p>
      </div>`;
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
          template: {
            html: template,
            css: css,
          },
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
          template: {
            html: "<h1>{{title}}</h1>", // Template simples para Excel
            css: "",
          },
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
          className="main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            minHeight: "calc(100vh - 180px)",
            alignItems: "start",
          }}
        >
        {/* Coluna Esquerda - Template e JSON */}
        <div 
          className="left-column"
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "20px",
            height: "fit-content",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {/* Template HTML */}
          <div
            style={{
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              minHeight: "300px",
              maxHeight: "400px",
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
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              minHeight: "200px",
              maxHeight: "250px",
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
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              minHeight: "300px",
              maxHeight: "400px",
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
          className="right-column"
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: "fit-content",
            minHeight: "calc(100vh - 200px)",
            maxHeight: "calc(100vh - 200px)",
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
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html style="height: 100%;">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    /* Reset básico */
                    * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                    }
                    
                    html, body {
                      height: 100%;
                      width: 100%;
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      line-height: 1.6;
                      color: #2c3e50;
                      background: #ffffff;
                      overflow-x: hidden;
                    }
                    
                    body {
                      padding: 10px;
                      min-height: 100vh;
                      margin: 0;
                      display: flex;
                      flex-direction: column;
                    }
                    
                    .container {
                      flex: 1;
                      width: 100%;
                    }
                    
                    /* Estilos base para elementos */
                    h1, h2, h3, h4, h5, h6 {
                      color: #2c3e50;
                      margin-bottom: 10px;
                    }
                    
                    h1 {
                      font-size: 24px;
                    }
                    
                    h2 {
                      font-size: 20px;
                    }
                    
                    p {
                      margin-bottom: 10px;
                      color: #34495e;
                    }
                    
                    table {
                      border-collapse: collapse;
                      width: 100%;
                      margin: 10px 0;
                      font-size: 14px;
                    }
                    
                    th, td {
                      border: 1px solid #bdc3c7;
                      padding: 8px;
                      text-align: left;
                    }
                    
                    th {
                      background-color: #ecf0f1;
                      font-weight: bold;
                      color: #2c3e50;
                    }
                    

                    
                    /* Estilos para métricas */
                    .metricas {
                      display: flex;
                      gap: 15px;
                      margin: 15px 0;
                      flex-wrap: wrap;
                    }
                    
                    .metric {
                      flex: 1;
                      min-width: 150px;
                      padding: 15px;
                      background: #f8f9fa;
                      border-radius: 8px;
                      text-align: center;
                    }
                    
                    .metric h3 {
                      font-size: 12px;
                      color: #666;
                      margin-bottom: 8px;
                      text-transform: uppercase;
                    }
                    
                    .metric .valor {
                      font-size: 18px;
                      font-weight: bold;
                      color: #007bff;
                    }
                    
                    /* Responsividade */
                    @media (max-width: 600px) {
                      .metricas {
                        flex-direction: column;
                      }
                      
                      table {
                        font-size: 12px;
                      }
                      
                      th, td {
                        padding: 6px;
                      }
                    }
                    
                    /* CSS personalizado do usuário */
                    ${css}
                  </style>
                </head>
                <body>
                  <div class="container">
                    ${getPreviewHtml()}
                  </div>
                </body>
                </html>
              `}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
                flex: "1 1 auto",
              }}
              title="Preview do Relatório"
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
          clear: "both",
        }}
      >
        <strong style={{ color: "#2c3e50" }}>🎯 Recursos Avançados do Handlebars:</strong>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", margin: "15px 0" }}>
          <div>
            <h4 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>📝 Básico</h4>
            <ul style={{ margin: "0", paddingLeft: "15px", fontSize: "13px" }}>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{variavel}}`}</code> - Variáveis</li>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{#each array}} ... {{/each}}`}</code> - Loops</li>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{#if condicao}} ... {{/if}}`}</code> - Condicionais</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>💰 Formatação</h4>
            <ul style={{ margin: "0", paddingLeft: "15px", fontSize: "13px" }}>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{currency valor}}`}</code> - R$ 1.234,56</li>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{number quantidade}}`}</code> - 1.234</li>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{date data}}`}</code> - 15/01/2024</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>🔤 Texto</h4>
            <ul style={{ margin: "0", paddingLeft: "15px", fontSize: "13px" }}>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{upper texto}}`}</code> - MAIÚSCULO</li>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{capitalize nome}}`}</code> - Primeira Maiúscula</li>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{truncate texto 50}}`}</code> - Limitar texto</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>🧮 Cálculos</h4>
            <ul style={{ margin: "0", paddingLeft: "15px", fontSize: "13px" }}>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{sum array "campo"}}`}</code> - Somar</li>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{average array "campo"}}`}</code> - Média</li>
              <li><code style={{ backgroundColor: "#ecf0f1", padding: "1px 4px", borderRadius: "3px" }}>{`{{math a "+" b}}`}</code> - Operações</li>
            </ul>
          </div>
        </div>
        <div style={{ backgroundColor: "#e8f4fd", padding: "15px", borderRadius: "8px", marginTop: "15px" }}>
          <strong style={{ color: "#1f4e79" }}>🚀 Exemplo Avançado:</strong>
          <pre style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "10px", 
            borderRadius: "5px", 
            fontSize: "12px", 
            margin: "10px 0 0 0",
            overflow: "auto"
          }}>{`{{#eachWithIndex produtos}}
<tr class="{{#if even}}par{{else}}impar{{/if}}">
  <td>{{math index "+" 1}}</td>
  <td>{{capitalize nome}}</td>
  <td>{{currency preco}}</td>
  <td>{{#compare estoque ">" 0}}Em Estoque{{else}}Esgotado{{/compare}}</td>
</tr>
{{/eachWithIndex}}`}</pre>
        </div>
      </div>
    </div>
    </>
  );
}
