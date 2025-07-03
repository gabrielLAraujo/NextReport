"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Code,
  FileText,
  Key,
  Zap,
  Download,
} from "lucide-react";

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({
    code,
    language,
    id,
  }: {
    code: string;
    language: string;
    id: string;
  }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
        >
          {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
          {copiedCode === id ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-b-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                NextReport API
              </h1>
              <p className="text-xl text-gray-600">
                Documentação completa para geração de relatórios
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  v1.0.0
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  OpenAPI 3.0
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="/swagger"
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <ExternalLink size={16} />
                Swagger UI
              </a>
              <a
                href="/"
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Voltar ao App
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="font-bold text-gray-900 mb-4">Navegação</h3>
              <nav className="space-y-2">
                <a
                  href="#overview"
                  className="block text-blue-600 hover:text-blue-800 py-1"
                >
                  Visão Geral
                </a>
                <a
                  href="#authentication"
                  className="block text-blue-600 hover:text-blue-800 py-1"
                >
                  Autenticação
                </a>
                <a
                  href="#endpoints"
                  className="block text-blue-600 hover:text-blue-800 py-1"
                >
                  Endpoints
                </a>
                <a
                  href="#examples"
                  className="block text-blue-600 hover:text-blue-800 py-1"
                >
                  Exemplos
                </a>
                <a
                  href="#formats"
                  className="block text-blue-600 hover:text-blue-800 py-1"
                >
                  Formatos
                </a>
                <a
                  href="#templates"
                  className="block text-blue-600 hover:text-blue-800 py-1"
                >
                  Templates
                </a>
                <a
                  href="#errors"
                  className="block text-blue-600 hover:text-blue-800 py-1"
                >
                  Códigos de Erro
                </a>
                <a
                  href="#sdks"
                  className="block text-blue-600 hover:text-blue-800 py-1"
                >
                  SDKs
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview */}
            <section
              id="overview"
              className="bg-white rounded-lg shadow-md p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Visão Geral
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                A NextReport API permite gerar relatórios profissionais em
                múltiplos formatos (PDF, XLSX, XLS) usando templates dinâmicos.
                Nossa API é RESTful, usa JSON para comunicação e requer
                autenticação via API Key.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Zap className="text-blue-600 mb-2" size={20} />
                  <h4 className="font-semibold text-blue-900">Rápido</h4>
                  <p className="text-blue-700 text-sm">Geração em segundos</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Download className="text-green-600 mb-2" size={20} />
                  <h4 className="font-semibold text-green-900">
                    Múltiplos Formatos
                  </h4>
                  <p className="text-green-700 text-sm">PDF, XLSX, XLS</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <Code className="text-purple-600 mb-2" size={20} />
                  <h4 className="font-semibold text-purple-900">Templates</h4>
                  <p className="text-purple-700 text-sm">
                    HTML + CSS dinâmicos
                  </p>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section
              id="authentication"
              className="bg-white rounded-lg shadow-md p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Key className="text-green-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Autenticação
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Todas as requisições requerem uma API Key válida. Inclua sua
                chave no header da requisição:
              </p>
              <CodeBlock
                language="HTTP Headers"
                id="auth-header"
                code="X-API-Key: nxr_demo_key_123456789"
              />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-yellow-800">
                  <strong>Demo:</strong> Use a chave{" "}
                  <code className="bg-yellow-100 px-2 py-1 rounded">
                    nxr_demo_key_123456789
                  </code>{" "}
                  para testes.
                </p>
              </div>
            </section>

            {/* Endpoints */}
            <section
              id="endpoints"
              className="bg-white rounded-lg shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Endpoints
              </h2>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                      POST
                    </span>
                    <code className="text-lg font-mono">
                      /api/v1/reports/generate
                    </code>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Gera relatórios em PDF, XLSX ou XLS
                  </p>

                  <h4 className="font-semibold mb-2">
                    Parâmetros obrigatórios:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                    <li>
                      <code>title</code> - Título do relatório
                    </li>
                    <li>
                      <code>format</code> - Formato: "pdf", "xlsx" ou "xls"
                    </li>
                    <li>
                      <code>data</code> - Dados JSON para o template
                    </li>
                    <li>
                      <code>template.html</code> - Template HTML
                    </li>
                  </ul>

                  <h4 className="font-semibold mb-2">Parâmetros opcionais:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>
                      <code>template.css</code> - Estilos CSS
                    </li>
                    <li>
                      <code>options.pageSize</code> - Tamanho da página (PDF)
                    </li>
                    <li>
                      <code>options.orientation</code> - Orientação (PDF)
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                      GET
                    </span>
                    <code className="text-lg font-mono">
                      /api/v1/auth/validate
                    </code>
                  </div>
                  <p className="text-gray-600">Valida se a API Key é válida</p>
                </div>
              </div>
            </section>

            {/* Examples */}
            <section
              id="examples"
              className="bg-white rounded-lg shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Exemplos de Uso
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">1. Gerar PDF</h3>
                  <CodeBlock
                    language="cURL"
                    id="pdf-example"
                    code={`curl -X POST http://localhost:3001/api/v1/reports/generate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: nxr_demo_key_123456789" \\
  -d '{
    "title": "Relatório de Vendas",
    "format": "pdf",
    "data": {
      "empresa": "Minha Empresa",
      "periodo": "Janeiro 2024",
      "total": "R$ 15.000,00",
      "vendas": [
        {"produto": "Produto A", "valor": "R$ 5.000,00"},
        {"produto": "Produto B", "valor": "R$ 10.000,00"}
      ]
    },
    "template": {
      "html": "<h1>{{empresa}}</h1><h2>{{periodo}}</h2><p>Total: {{total}}</p>{{#each vendas}}<div>{{produto}}: {{valor}}</div>{{/each}}",
      "css": "h1 { color: #2563eb; } h2 { color: #64748b; } div { padding: 8px; border-bottom: 1px solid #e2e8f0; }"
    },
    "options": {
      "pageSize": "A4",
      "orientation": "portrait"
    }
  }' \\
  --output relatorio.pdf`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    2. Gerar Excel (XLSX)
                  </h3>
                  <CodeBlock
                    language="cURL"
                    id="xlsx-example"
                    code={`curl -X POST http://localhost:3001/api/v1/reports/generate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: nxr_demo_key_123456789" \\
  -d '{
    "title": "Dados de Vendas",
    "format": "xlsx",
    "data": {
      "empresa": "Minha Empresa",
      "vendas": [
        {"produto": "A", "quantidade": 10, "valor": 1500.50},
        {"produto": "B", "quantidade": 5, "valor": 2300.75}
      ],
      "resumo": {
        "totalItens": 15,
        "valorTotal": 3801.25
      }
    },
    "template": {
      "html": "Template não usado para Excel"
    }
  }' \\
  --output dados.xlsx`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    3. JavaScript/Node.js
                  </h3>
                  <CodeBlock
                    language="JavaScript"
                    id="js-example"
                    code={`const response = await fetch('http://localhost:3001/api/v1/reports/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'nxr_demo_key_123456789'
  },
  body: JSON.stringify({
    title: 'Meu Relatório',
    format: 'pdf',
    data: {
      nome: 'João Silva',
      cargo: 'Desenvolvedor',
      salario: 'R$ 5.000,00'
    },
    template: {
      html: '<h1>{{nome}}</h1><p>Cargo: {{cargo}}</p><p>Salário: {{salario}}</p>',
      css: 'h1 { color: blue; } p { margin: 10px 0; }'
    }
  })
});

if (response.ok) {
  const blob = await response.blob();
  // Salvar arquivo ou criar download
} else {
  console.error('Erro:', await response.json());
}`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">4. Python</h3>
                  <CodeBlock
                    language="Python"
                    id="python-example"
                    code={`import requests

url = "http://localhost:3001/api/v1/reports/generate"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "nxr_demo_key_123456789"
}

data = {
    "title": "Relatório Python",
    "format": "pdf",
    "data": {
        "cliente": "Empresa ABC",
        "valor": "R$ 10.000,00",
        "itens": [
            {"descricao": "Serviço A", "valor": "R$ 6.000,00"},
            {"descricao": "Serviço B", "valor": "R$ 4.000,00"}
        ]
    },
    "template": {
        "html": "<h1>{{cliente}}</h1><p>Total: {{valor}}</p>{{#each itens}}<div>{{descricao}}: {{valor}}</div>{{/each}}"
    }
}

response = requests.post(url, json=data, headers=headers)

if response.status_code == 200:
    with open("relatorio.pdf", "wb") as f:
        f.write(response.content)
    print("Relatório gerado com sucesso!")
else:
    print("Erro:", response.json())`}
                  />
                </div>
              </div>
            </section>

            {/* Formats */}
            <section id="formats" className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Formatos Suportados
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-3">
                    PDF
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Templates HTML + CSS</li>
                    <li>• Tamanhos: A4, A3, Letter</li>
                    <li>• Orientação: Portrait/Landscape</li>
                    <li>• Margens customizáveis</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-600 mb-3">
                    XLSX
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Múltiplas planilhas</li>
                    <li>• Formatação automática</li>
                    <li>• Colunas auto-ajustáveis</li>
                    <li>• Totais automáticos</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-600 mb-3">
                    XLS
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Compatibilidade Excel 97-2003</li>
                    <li>• Mesmo formato que XLSX</li>
                    <li>• Suporte legacy</li>
                    <li>• Menor tamanho</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Templates */}
            <section
              id="templates"
              className="bg-white rounded-lg shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Sistema de Templates
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Sintaxe de Variáveis
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-blue-600">{`{{variavel}}`}</code> -
                    Substitui por valor simples
                    <br />
                    <code className="text-blue-600">{`{{#each array}} ... {{/each}}`}</code>{" "}
                    - Loop em arrays
                    <br />
                    <code className="text-blue-600">{`{{#if condicao}} ... {{/if}}`}</code>{" "}
                    - Condicionais
                    <br />
                    <code className="text-blue-600">{`{{@index}}`}</code> -
                    Índice do loop atual
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Exemplo de Template
                  </h3>
                  <CodeBlock
                    language="HTML"
                    id="template-example"
                    code={`<div class="relatorio">
  <header>
    <h1>{{titulo}}</h1>
    <p>Data: {{data}}</p>
  </header>
  
  <main>
    {{#if mostrarResumo}}
    <section class="resumo">
      <h2>Resumo</h2>
      <p>{{resumo}}</p>
    </section>
    {{/if}}
    
    {{#if itens}}
    <section class="tabela">
      <h2>Itens</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {{#each itens}}
          <tr>
            <td>{{@index}}</td>
            <td>{{descricao}}</td>
            <td>{{valor}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>
    </section>
    {{/if}}
  </main>
  
  <footer>
    <p>Total: {{total}}</p>
  </footer>
</div>`}
                  />
                </div>
              </div>
            </section>

            {/* Error Codes */}
            <section id="errors" className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Códigos de Erro
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-mono text-sm">
                    400
                  </span>
                  <div>
                    <h4 className="font-semibold text-red-900">Bad Request</h4>
                    <p className="text-red-700">
                      Dados de entrada inválidos ou campos obrigatórios ausentes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-mono text-sm">
                    401
                  </span>
                  <div>
                    <h4 className="font-semibold text-yellow-900">
                      Unauthorized
                    </h4>
                    <p className="text-yellow-700">
                      API Key inválida ou ausente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono text-sm">
                    500
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Internal Server Error
                    </h4>
                    <p className="text-gray-700">
                      Erro interno do servidor durante o processamento
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SDKs */}
            <section id="sdks" className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                SDKs e Integrações
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Postman Collection
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Importe nossa collection para testar facilmente
                  </p>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors">
                    Download Collection
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">OpenAPI Spec</h3>
                  <p className="text-gray-600 mb-4">
                    Use nossa especificação em qualquer ferramenta
                  </p>
                  <a
                    href="/api/v1/swagger"
                    target="_blank"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block"
                  >
                    Ver Especificação
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
