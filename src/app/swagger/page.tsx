"use client";

import { useState } from "react";

export default function SwaggerPage() {
  const [showIframe, setShowIframe] = useState(false);

  const swaggerUrl = `https://petstore.swagger.io/?url=${encodeURIComponent(
    "http://localhost:3001/api/v1/swagger"
  )}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">NextReport API - Swagger UI</h1>
            <p className="text-blue-100 mt-1">
              Interface interativa para testar a API
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/docs"
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors"
            >
              Documentação
            </a>
            <a
              href="/"
              className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded transition-colors"
            >
              Voltar ao App
            </a>
          </div>
        </div>
      </div>

      {/* Opções de visualização */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-700">
              Visualizar documentação:
            </h3>
            <button
              onClick={() => setShowIframe(true)}
              className={`px-4 py-2 rounded transition-colors ${
                showIframe
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
              }`}
            >
              Swagger UI (Iframe)
            </button>
            <button
              onClick={() => setShowIframe(false)}
              className={`px-4 py-2 rounded transition-colors ${
                !showIframe
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-600 border border-green-600 hover:bg-green-50"
              }`}
            >
              JSON Raw
            </button>
            <a
              href="/api/v1/swagger"
              target="_blank"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Abrir JSON em nova aba
            </a>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ height: "calc(100vh - 180px)" }}>
        {showIframe ? (
          <div className="h-full">
            <iframe
              src={swaggerUrl}
              className="w-full h-full border-0"
              title="Swagger UI"
              onLoad={() => console.log("Swagger UI carregado via iframe")}
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Especificação OpenAPI
              </h2>
              <p className="text-gray-600 mb-6">
                Esta é a especificação da API NextReport em formato JSON. Você
                pode copiar e colar em qualquer ferramenta que suporte OpenAPI
                3.0.
              </p>

              <div
                className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto"
                style={{ maxHeight: "70vh" }}
              >
                <pre className="text-sm">
                  {`{
  "openapi": "3.0.0",
  "info": {
    "title": "NextReport API",
    "version": "1.0.0",
    "description": "Serviço de geração de relatórios em PDF, XLSX e XLS"
  },
  "servers": [
    {
      "url": "http://localhost:3001",
      "description": "Servidor de Desenvolvimento"
    }
  ],
  "paths": {
    "/api/v1/reports/generate": {
      "post": {
        "summary": "Gerar relatório",
        "description": "Gera relatórios em múltiplos formatos",
        "security": [{"ApiKeyAuth": []}],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["title", "format", "data", "template"],
                "properties": {
                  "title": {"type": "string", "example": "Relatório de Vendas"},
                  "format": {"type": "string", "enum": ["pdf", "xlsx", "xls"]},
                  "data": {"type": "object"},
                  "template": {
                    "type": "object",
                    "properties": {
                      "html": {"type": "string"},
                      "css": {"type": "string"}
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {"description": "Arquivo gerado com sucesso"},
          "400": {"description": "Dados inválidos"},
          "401": {"description": "API Key inválida"}
        }
      }
    },
    "/api/v1/auth/validate": {
      "get": {
        "summary": "Validar API Key",
        "security": [{"ApiKeyAuth": []}],
        "responses": {
          "200": {"description": "API Key válida"},
          "401": {"description": "API Key inválida"}
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-Key",
        "description": "Use: nxr_demo_key_123456789"
      }
    }
  }
}`}
                </pre>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Como testar:
                </h3>
                <ol className="list-decimal list-inside text-blue-700 space-y-1">
                  <li>
                    Use a API Key demo:{" "}
                    <code className="bg-blue-100 px-2 py-1 rounded">
                      nxr_demo_key_123456789
                    </code>
                  </li>
                  <li>
                    Adicione no header:{" "}
                    <code className="bg-blue-100 px-2 py-1 rounded">
                      X-API-Key: nxr_demo_key_123456789
                    </code>
                  </li>
                  <li>
                    Faça POST para:{" "}
                    <code className="bg-blue-100 px-2 py-1 rounded">
                      http://localhost:3001/api/v1/reports/generate
                    </code>
                  </li>
                </ol>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  Exemplo de requisição (cURL):
                </h3>
                <pre className="bg-green-100 p-3 rounded text-sm overflow-x-auto">
                  {`curl -X POST http://localhost:3001/api/v1/reports/generate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: nxr_demo_key_123456789" \\
  -d '{
    "title": "Teste",
    "format": "pdf",
    "data": {"nome": "João", "valor": "R$ 100"},
    "template": {
      "html": "<h1>{{nome}}</h1><p>Valor: {{valor}}</p>"
    }
  }' \\
  --output relatorio.pdf`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
