# 🚀 Deploy na Vercel - NextReport

## 📋 Pré-requisitos

1. **Conta GitHub**: Seu código deve estar em um repositório no GitHub
2. **Conta Vercel**: Crie uma conta em [vercel.com](https://vercel.com) (pode usar login do GitHub)

## 🛠️ Passo 1: Preparar o Projeto

### 1.1 Commit e Push para GitHub
```bash
# Adicionar todas as mudanças
git add .

# Fazer commit
git commit -m "Preparar para deploy na Vercel"

# Enviar para GitHub
git push origin main
```

### 1.2 Verificar se o Build Funciona Localmente
```bash
# Testar build local
npm run build

# Se der erro, corrigir antes de continuar
```

## 🌐 Passo 2: Deploy na Vercel

### 2.1 Acessar Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"New Project"**

### 2.2 Importar Repositório
1. Selecione seu repositório **NextReport** da lista
2. Clique em **"Import"**

### 2.3 Configurar o Projeto
**Framework Preset**: Next.js (detectado automaticamente)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 2.4 Configurar Variáveis de Ambiente
Na seção **Environment Variables**, adicione:

```
NODE_ENV=production
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

### 2.5 Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. ✅ Seu projeto estará no ar!

## 🔧 Configurações Específicas

### Arquivo `vercel.json` (já configurado)
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/v1/reports/generate/route.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "env": {
    "NODE_ENV": "production",
    "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD": "true",
    "PUPPETEER_EXECUTABLE_PATH": "/usr/bin/google-chrome-stable"
  }
}
```

## 🧪 Testar Após Deploy

### 1. Acessar a Aplicação
```
https://seu-projeto.vercel.app
```

### 2. Testar API de Validação
```bash
curl -X POST https://seu-projeto.vercel.app/api/v1/auth/validate \
  -H "X-API-Key: nxr_demo_key_123456789"
```

### 3. Testar Geração de PDF
```bash
curl -X POST https://seu-projeto.vercel.app/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nxr_demo_key_123456789" \
  -d '{
    "title": "Teste Deploy",
    "format": "pdf",
    "data": {"nome": "João", "empresa": "Teste Ltda"},
    "template": {
      "html": "<h1>{{nome}} - {{empresa}}</h1>",
      "css": "h1 { color: blue; text-align: center; }"
    }
  }' \
  --output teste-deploy.pdf
```

## 🚨 Solução de Problemas

### Build Falha
**Erro comum**: Dependências ou sintaxe
```bash
# Testar localmente primeiro
npm install
npm run build

# Verificar erros de TypeScript
npx tsc --noEmit
```

### PDF não Gera
**Causa**: Puppeteer não configurado
- ✅ Verificar variáveis de ambiente na Vercel
- ✅ Verificar timeout (máximo 30s)

### Timeout na API
**Causa**: Função demora muito
- ✅ Otimizar templates
- ✅ Reduzir dados enviados
- ✅ Verificar logs na Vercel

## 📊 Monitoramento

### Acessar Logs
1. Vá para o Dashboard da Vercel
2. Selecione seu projeto
3. Clique em **"Functions"**
4. Visualize logs em tempo real

### Métricas Importantes
- **Invocações**: Quantas vezes a API foi chamada
- **Duração**: Tempo de execução
- **Erros**: Taxa de falha
- **Memória**: Uso de RAM

## 🔄 Atualizações Automáticas

### Deploy Contínuo
- ✅ Cada push para `main` → deploy automático
- ✅ Pull requests → preview automático
- ✅ Rollback fácil se necessário

### Configurar Branch
1. Vá em **Settings** do projeto
2. Configure **Production Branch**: `main`
3. Ative **Automatic Deployments**

## 🎯 URLs Importantes

Após o deploy, você terá:

```
# Aplicação principal
https://seu-projeto.vercel.app

# Documentação da API
https://seu-projeto.vercel.app/docs

# Endpoint principal
https://seu-projeto.vercel.app/api/v1/reports/generate

# Validação de API Key
https://seu-projeto.vercel.app/api/v1/auth/validate
```

## ✅ Checklist Final

- [ ] Código commitado no GitHub
- [ ] Build local funcionando
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Testes de API funcionando
- [ ] Logs monitorados

## 🆘 Ajuda Adicional

### Documentação Oficial
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deploy](https://nextjs.org/docs/deployment)

### Suporte
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Next.js GitHub](https://github.com/vercel/next.js)

---

**🎉 Parabéns! Seu NextReport está no ar na Vercel!**

Agora você tem uma API profissional de geração de relatórios rodando em produção! 🚀 