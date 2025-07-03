"use client";

import { useState } from "react";

export default function ApiKeyPage() {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerateKey = async () => {
    if (!email || !email.includes("@")) {
      setError("Por favor, insira um email válido");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/v1/auth/generate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setApiKey(data.apiKey);
        setSuccess(data.message);
      } else {
        setError(data.message || "Erro ao gerar API Key");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setSuccess("API Key copiada para a área de transferência!");
    } catch (err) {
      setError("Erro ao copiar API Key");
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "10px" }}>
          🔑 NextReport - Gerador de API Keys
        </h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Gere sua API Key para acessar a API de geração de relatórios
        </p>
      </div>

      <div
        style={{
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        <button
          onClick={handleGenerateKey}
          disabled={!email || isLoading}
          style={{
            width: "100%",
            padding: "12px 24px",
            backgroundColor: isLoading ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isLoading ? "not-allowed" : "pointer",
            marginBottom: "20px",
          }}
        >
          {isLoading ? "Gerando..." : "Gerar API Key"}
        </button>

        {error && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              color: "#dc2626",
              marginBottom: "20px",
            }}
          >
            ❌ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#dcfce7",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              color: "#16a34a",
              marginBottom: "20px",
            }}
          >
            ✅ {success}
          </div>
        )}

        {apiKey && (
          <div style={{ marginTop: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#2c3e50",
              }}
            >
              Sua API Key:
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={apiKey}
                readOnly
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "2px solid #10b981",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#f0fdf4",
                  fontFamily: "monospace",
                  color: "#065f46",
                }}
              />
              <button
                onClick={copyToClipboard}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                📋 Copiar
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>
          📖 Como usar sua API Key
        </h3>

        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ color: "#374151", marginBottom: "10px" }}>
            1. Incluir no Header
          </h4>
          <pre
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              fontSize: "14px",
              overflow: "auto",
              border: "1px solid #d1d5db",
            }}
          >
            {`X-API-Key: sua_api_key_aqui`}
          </pre>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ color: "#374151", marginBottom: "10px" }}>
            2. Endpoints Disponíveis
          </h4>
          <ul style={{ color: "#4b5563", lineHeight: "1.6" }}>
            <li>
              <strong>POST /api/v1/reports/generate</strong> - Gerar relatório
              (PDF, XLSX, XLS)
            </li>
            <li>
              <strong>GET /api/v1/auth/validate</strong> - Validar API Key
            </li>
            <li>
              <strong>GET /docs</strong> - Documentação completa da API
            </li>
          </ul>
        </div>

        <div
          style={{
            padding: "15px",
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "8px",
            color: "#92400e",
          }}
        >
          <strong>⚠️ Importante:</strong> Mantenha sua API Key segura e não a
          compartilhe publicamente.
        </div>
      </div>
    </div>
  );
}
