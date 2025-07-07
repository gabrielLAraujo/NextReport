# Configuração de Ambiente - NextReport

## Variáveis de Ambiente

### BROWSERLESS_TOKEN (Opcional)

Para gerar PDFs e screenshots reais, você pode configurar um token do Browserless.

#### ✅ Desenvolvimento sem Token
- A aplicação funciona **sem** o token configurado
- Relatórios XLSX/XLS funcionam normalmente
- PDFs requerem o token (retornam erro claro se não configurado)
- Screenshots usam implementação alternativa se disponível

#### 🚀 Produção com Token
- Para PDFs e screenshots reais, configure o token
- Melhor qualidade e mais opções de customização

```bash
BROWSERLESS_TOKEN="seu_token_aqui"
```

### Database (SQLite por padrão)
```bash
# Opcional - por padrão usa SQLite local
DATABASE_URL="file:./dev.db"
```

## Como obter o token do Browserless

1. Acesse [browserless.io](https://browserless.io)
2. Crie uma conta gratuita (6 horas gratuitas por mês)
3. No dashboard, copie seu token de API
4. Adicione ao arquivo `.env.local`

**Importante:** O Browserless atualizou suas URLs. A aplicação agora usa:
- WebSocket: `wss://production-sfo.browserless.io`
- API REST: `https://production-sfo.browserless.io`

```bash
BROWSERLESS_TOKEN="seu_token_aqui"
```

## Funcionalidades por Modo

### Modo Desenvolvimento (sem token)
- ✅ Geração de relatórios XLSX/XLS
- ❌ PDFs requerem token (erro claro se não configurado)
- ✅ Screenshots básicos (se suportado)
- ✅ Todas as outras funcionalidades

### Modo Produção (com token)
- ✅ Geração de relatórios XLSX/XLS
- ✅ PDFs reais com renderização completa
- ✅ Screenshots de alta qualidade
- ✅ Suporte a páginas web externas
- ✅ Múltiplos formatos de imagem

## Configuração para Desenvolvimento (Opcional)

```bash
# Para usar implementação local alternativa
USE_LOCAL_PUPPETEER="false"

# Next.js (opcional)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Arquivo .env.local de exemplo

```bash
# Browserless (opcional)
BROWSERLESS_TOKEN="your-browserless-token-here"

# Database (opcional - usa SQLite por padrão)
DATABASE_URL="file:./dev.db"

# Development (opcional)
USE_LOCAL_PUPPETEER="false"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## Deploy na Vercel

1. Configure a variável `BROWSERLESS_TOKEN` no dashboard da Vercel (opcional)
2. Faça o deploy normalmente
3. A aplicação funcionará com ou sem o token

## Troubleshooting

### PDFs não estão sendo gerados
1. **Erro: "Para gerar PDFs, configure a variável BROWSERLESS_TOKEN"**
   - Configure o token seguindo as instruções acima
   - Crie o arquivo `.env.local` com o token
   - Reinicie o servidor de desenvolvimento

2. **Token configurado mas ainda não funciona**
   - Verifique se o token está correto
   - Teste o token no site do Browserless
   - Verifique os logs do console para erros específicos

### Screenshots não funcionam
1. Verifique se o token está configurado
2. Teste com URLs públicas primeiro
3. Verifique se o HTML customizado está bem formado

### Erros de Build
1. Certifique-se que todas as dependências estão instaladas: `npm install`
2. Limpe o cache: `rm -rf .next node_modules && npm install`
3. Verifique se não há conflitos de versão 