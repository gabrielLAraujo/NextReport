import { Card } from "../atoms/Card";

export function HelpSection() {
  return (
    <Card
      style={{
        marginTop: "20px",
        padding: "20px",
        fontSize: "14px",
        color: "#34495e",
        clear: "both",
      }}
    >
      <strong style={{ color: "#2c3e50" }}>
        🎯 Recursos Avançados do Handlebars:
      </strong>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          margin: "15px 0",
        }}
      >
        <div>
          <h4 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>📝 Básico</h4>
          <ul style={{ margin: "0", paddingLeft: "15px", fontSize: "13px" }}>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{variavel}}`}</code>{" "}
              - Variáveis
            </li>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{#each array}} ... {{/each}}`}</code>{" "}
              - Loops
            </li>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{#if condicao}} ... {{/if}}`}</code>{" "}
              - Condicionais
            </li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>
            💰 Formatação
          </h4>
          <ul style={{ margin: "0", paddingLeft: "15px", fontSize: "13px" }}>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{currency valor}}`}</code>{" "}
              - R$ 1.234,56
            </li>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{number quantidade}}`}</code>{" "}
              - 1.234
            </li>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{date data}}`}</code>{" "}
              - 15/01/2024
            </li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>🔤 Texto</h4>
          <ul style={{ margin: "0", paddingLeft: "15px", fontSize: "13px" }}>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{upper texto}}`}</code>{" "}
              - MAIÚSCULO
            </li>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{capitalize nome}}`}</code>{" "}
              - Primeira Maiúscula
            </li>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{truncate texto 50}}`}</code>{" "}
              - Limitar texto
            </li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>
            🧮 Cálculos
          </h4>
          <ul style={{ margin: "0", paddingLeft: "15px", fontSize: "13px" }}>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{sum array "campo"}}`}</code>{" "}
              - Somar
            </li>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{average array "campo"}}`}</code>{" "}
              - Média
            </li>
            <li>
              <code
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >{`{{math a "+" b}}`}</code>{" "}
              - Operações
            </li>
          </ul>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#e8f4fd",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "15px",
        }}
      >
        <strong style={{ color: "#1f4e79" }}>🚀 Exemplo Avançado:</strong>
        <pre
          style={{
            backgroundColor: "#f8f9fa",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "12px",
            margin: "10px 0 0 0",
            overflow: "auto",
          }}
        >{`{{#eachWithIndex produtos}}
<tr class="{{#if even}}par{{else}}impar{{/if}}">
  <td>{{math index "+" 1}}</td>
  <td>{{capitalize nome}}</td>
  <td>{{currency preco}}</td>
  <td>{{#compare estoque ">" 0}}Em Estoque{{else}}Esgotado{{/compare}}</td>
</tr>
{{/eachWithIndex}}`}</pre>
      </div>
    </Card>
  );
}
