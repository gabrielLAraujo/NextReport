# 🚀 Guia de Deploy na Vercel - NextReport

## ✅ Verificações Pré-Deploy

Execute o script de verificação:
```bash
npm run verify-deploy
```

## 📋 Passo a Passo para Deploy

### 1. Preparar Repositório
```bash
# Commit todas as mudanças
git add .
git commit -m "Preparar para deploy na Vercel"
git push origin main
```

### 2. Configurar na Vercel

1. **Acesse**: [vercel.com](https://vercel.com)
2. **Login**: Com sua conta GitHub
3. **New Project**: Clique em "New Project"
4. **Import**: Selecione o repositório NextReport

### 3. Configurações do Projeto

**Build & Development Settings:**
- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 4. Variáveis de Ambiente

Adicione estas variáveis na seção "Environment Variables":

```bash
NODE_ENV=production
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

### 5. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. ✅ Projeto no ar!

## 🔧 Configurações Técnicas Aplicadas

### Next.js Config
- ✅ Runtime: Node.js
- ✅ Webpack configurado para Handlebars
- ✅ Puppeteer otimizado
- ✅ Headers CORS configurados

### Vercel Config
- ✅ Timeouts configurados (30s para relatórios)
- ✅ Memória otimizada (1GB para geração)
- ✅ Regions: Brasil (gru1)
- ✅ Rewrites para API v1

### Dependências
- ✅ Puppeteer configurado para Chrome do sistema
- ✅ Handlebars com importação compatível
- ✅ XLSX para planilhas
- ✅ Zod para validação

## 🧪 Testar Após Deploy

### 1. Documentação
```
https://seu-projeto.vercel.app/docs
```

### 2. API Health Check
```bash
curl -X POST https://seu-projeto.vercel.app/api/v1/auth/validate \
  -H "X-API-Key: nxr_demo_key_123456789"
```

### 3. Gerar PDF de Teste
```bash
curl -X POST https://seu-projeto.vercel.app/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nxr_demo_key_123456789" \
  -d '{
    "title": "Teste",
    "format": "pdf",
    "data": {"nome": "João"},
    "template": {
      "html": "<h1>Olá {{nome}}!</h1>",
      "css": "h1 { color: blue; }"
    }
  }' \
  --output teste.pdf
```

## 🚨 Solução de Problemas

### Build Falha
- ✅ Verificar TypeScript: `npm run build`
- ✅ Verificar ESLint: `npm run lint`
- ✅ Verificar dependências: `npm install`

### PDF não Gera
- ✅ Verificar variáveis de ambiente
- ✅ Verificar timeout (30s máximo)
- ✅ Verificar logs na Vercel

### Excel não Funciona
- ✅ Verificar dados JSON válidos
- ✅ Verificar formato (xlsx/xls)
- ✅ Verificar tamanho dos dados

## 📊 Monitoramento

### Logs
- Acesse: Vercel Dashboard > Projeto > Functions
- Visualize logs em tempo real
- Monitore performance

### Métricas
- Tempo de resposta
- Uso de memória
- Taxa de erro
- Invocações por minuto

## 🔒 Segurança

### API Keys
- ✅ Chave demo: `nxr_demo_key_123456789`
- ✅ Validação obrigatória
- ✅ Headers seguros

### CORS
- ✅ Configurado para todas as origens
- ✅ Headers permitidos
- ✅ Métodos permitidos

## 🎯 Performance

### Otimizações Aplicadas
- ✅ Standalone output
- ✅ Webpack otimizado
- ✅ Dependências externas
- ✅ Timeout configurado
- ✅ Memória alocada

### Limites Vercel
- ✅ Função: 30s timeout
- ✅ Memória: 1GB
- ✅ Payload: 10MB
- ✅ Response: 4.5MB

---

## ✅ Checklist Final

- [ ] Código commitado no GitHub
- [ ] Projeto conectado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Testes funcionais realizados
- [ ] Documentação acessível
- [ ] Logs monitorados

**🎉 Parabéns! Seu NextReport está no ar na Vercel!** 