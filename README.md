# 📊 NextReport - Gerador de Relatórios

**NextReport** é um serviço completo de geração de relatórios que permite criar documentos em PDF, XLSX e XLS através de templates HTML personalizáveis e dados JSON.

## 🚀 **Demo Online**

🔗 **[https://nextreport.vercel.app](https://nextreport.vercel.app)**

## ✨ **Características Principais**

- 📝 **Templates HTML**: Crie templates personalizados com sintaxe Handlebars-like
- 📊 **Múltiplos Formatos**: Gere relatórios em PDF, XLSX e XLS
- 🔍 **Preview em Tempo Real**: Veja o resultado antes de gerar
- 🎨 **CSS Personalizado**: Estilize seus relatórios como desejar
- 🔐 **API Externa**: Use como serviço através de API Keys
- 📖 **Documentação Completa**: Interface visual e Swagger UI
- ⚡ **Processamento Rápido**: Geração otimizada de documentos

## 🛠️ **Tecnologias Utilizadas**

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Puppeteer** - Geração de PDF
- **XLSX** - Geração de planilhas Excel
- **Prisma** - ORM para banco de dados
- **Zod** - Validação de dados
- **Vercel** - Deploy e hospedagem

## 📋 **Como Usar**

### Interface Web
1. Acesse [https://nextreport.vercel.app](https://nextreport.vercel.app)
2. Digite seu template HTML na área esquerda
3. Adicione dados JSON
4. Veja o preview em tempo real
5. Clique em **PDF**, **XLSX** ou **XLS** para gerar

### API Externa
```bash
curl -X POST https://nextreport.vercel.app/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nxr_demo_key_123456789" \
  -d '{
    "title": "Meu Relatório",
    "format": "pdf",
    "data": {"nome": "João", "idade": 30},
    "template": "<h1>Olá {{nome}}, você tem {{idade}} anos!</h1>",
    "styles": "h1 { color: blue; }"
  }'
```

## 🔧 **Instalação Local**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nextreport.git
cd nextreport

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute o projeto
npm run dev
```

## 📚 **Documentação**

- **[Documentação Completa](https://nextreport.vercel.app/docs)** - Guia completo de uso
- **[Swagger UI](https://nextreport.vercel.app/swagger)** - Interface interativa da API

## 🔐 **Autenticação**

Para usar a API, você precisa de uma API Key:

```bash
# Chave de demonstração
X-API-Key: nxr_demo_key_123456789

# Ou via Authorization header
Authorization: Bearer nxr_demo_key_123456789
```

## 📄 **Sintaxe de Templates**

```html
<!-- Variáveis simples -->
<h1>{{titulo}}</h1>
<p>{{descricao}}</p>

<!-- Loops -->
{{#each itens}}
  <div>{{nome}} - {{valor}}</div>
{{/each}}

<!-- Condicionais -->
{{#if mostrarSecao}}
  <div>Esta seção é condicional</div>
{{/if}}

<!-- Índice em loops -->
{{#each produtos}}
  <p>{{@index}}. {{nome}}</p>
{{/each}}
```

## 🎨 **Exemplos de Uso**

### Relatório de Vendas
```json
{
  "titulo": "Relatório de Vendas",
  "data": "2024-01-15",
  "vendas": [
    {"produto": "Notebook", "quantidade": 2, "valor": 2500.00},
    {"produto": "Mouse", "quantidade": 10, "valor": 25.00}
  ],
  "total": 2750.00
}
```

### Certificado
```html
<div class="certificado">
  <h1>Certificado de Conclusão</h1>
  <p>Certificamos que <strong>{{nome}}</strong> concluiu o curso de <strong>{{curso}}</strong>.</p>
  <p>Data: {{data}}</p>
  <p>Carga Horária: {{cargaHoraria}} horas</p>
</div>
```

## 🌟 **Recursos Avançados**

- **Formatação Automática**: Planilhas Excel com formatação profissional
- **Múltiplas Planilhas**: Dados organizados automaticamente
- **Totais Automáticos**: Cálculos automáticos em campos numéricos
- **Validação Completa**: Validação de dados com Zod
- **Tratamento de Erros**: Mensagens de erro detalhadas

## 🤝 **Contribuindo**

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 **Licença**

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 **Suporte**

- **Documentação**: [https://nextreport.vercel.app/docs](https://nextreport.vercel.app/docs)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/nextreport/issues)
- **API Reference**: [https://nextreport.vercel.app/swagger](https://nextreport.vercel.app/swagger)

---

**Feito com ❤️ usando Next.js e TypeScript**
