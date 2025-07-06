import { useState } from 'react';

const DEFAULT_TEMPLATE = `<div class="header">
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
</div>`;

const DEFAULT_JSON = `{
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
}`;

const DEFAULT_CSS = `/* Estilos principais */
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
}`;

export function useReportGenerator() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [jsonData, setJsonData] = useState(DEFAULT_JSON);
  const [css, setCss] = useState(DEFAULT_CSS);
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

  const generateReport = async (format: 'pdf' | 'xlsx' | 'xls') => {
    setIsGenerating(true);
    try {
      const data = JSON.parse(jsonData);

      const response = await fetch("/api/v1/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Não precisa de API Key para requisições locais
        },
        body: JSON.stringify({
          title: "Relatório Gerado",
          format: format,
          data: data,
          template: {
            html: template,
            css: css,
          },
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        if (format === 'pdf') {
          // Abrir PDF em nova aba
          window.open(url, "_blank");
        } else {
          // Download para Excel
          const link = document.createElement("a");
          link.href = url;
          link.download = `relatorio_${Date.now()}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        // Limpar URL do blob
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        const error = await response.json();
        alert(`Erro ao gerar ${format.toUpperCase()}: ` + error.error);
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

  return {
    template,
    jsonData,
    css,
    isGenerating,
    setTemplate,
    setJsonData,
    setCss,
    getPreviewHtml,
    generatePDF: () => generateReport('pdf'),
    generateXLSX: () => generateReport('xlsx'),
    generateXLS: () => generateReport('xls'),
  };
} 