# 🚀 Deploy no EasyPanel

## ✅ Quick Start

1. **Clone o repositório no EasyPanel:**
```bash
git clone https://github.com/sxsevenxperts/appjacyaramobile.git
cd appjacyaramobile
```

2. **Configure as variáveis de ambiente:**
   - Crie arquivo `.env` baseado em `.env.example`
   - Atualize as credenciais Supabase se necessário

3. **Deploy via Docker:**
```bash
docker-compose up -d
```

4. **Acesse:**
   - URL: `http://seu-dominio:3000` ou `https://seu-dominio`
   - Health check: `http://seu-dominio:3000/health`

---

## 📋 Configuração do EasyPanel

### 1. Criar Aplicação

1. Vá em **Applications** → **New Application**
2. Selecione **Docker**
3. Cole o repositório:
   ```
   https://github.com/sxsevenxperts/appjacyaramobile.git
   ```

### 2. Configurar Build

- **Dockerfile path:** `./Dockerfile`
- **Build context:** `.`
- **Port:** `3000`

### 3. Variáveis de Ambiente

Clique em **Environment Variables** e adicione:

```
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=https://gzkwtiihltahvnmtrgfv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=https://seu-dominio
```

### 4. Storage (Opcional)

Se precisar persistir dados:

```
/app/data → /data
```

### 5. Network

- **Internal Port:** `3000`
- **External Port:** `80` (ou `443` com SSL)
- **Health check:** `GET /health`

---

## 🔄 Deploy Automático

### Via GitHub Actions

1. Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to EasyPanel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.EASYPANEL_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{
              "action": "redeploy",
              "applicationId": "${{ secrets.EASYPANEL_APP_ID }}"
            }' \
            https://easypanel.io/api/v1/applications/redeploy
```

2. Configure secrets no GitHub:
   - `EASYPANEL_TOKEN` - Token de autenticação
   - `EASYPANEL_APP_ID` - ID da aplicação

---

## 📊 Monitoramento

### Logs

```bash
docker logs jacyara-clinica-app -f
```

### Saúde

```bash
curl http://localhost:3000/health
```

### Métricas

EasyPanel fornece:
- CPU usage
- Memory usage
- Network I/O
- Container status

---

## 🔐 SSL/HTTPS

1. **Ativar HTTPS:**
   - EasyPanel → Application → Settings
   - Toggle: **Enable SSL/HTTPS**

2. **Certificado:**
   - Auto: Let's Encrypt (recomendado)
   - Manual: Upload seu certificado

---

## 📱 Domínio Customizado

1. **Aponte seu domínio:**
   ```
   CNAME → seu-easypanel-domain.com
   ```

2. **Configure no EasyPanel:**
   - Application → Settings → Domains
   - Adicione seu domínio

---

## 🐛 Troubleshooting

### App não inicia

```bash
# Ver logs
docker logs jacyara-clinica-app

# Verificar saúde
curl http://localhost:3000/health

# Reiniciar
docker-compose restart app
```

### Porta em uso

```bash
docker-compose down
docker-compose up -d
```

### Permissões

```bash
# Dar permissão a volumes
chmod -R 777 ./public
chmod -R 777 ./src
```

---

## 📈 Performance Tips

1. **Cache:** Ativar cache de static files
2. **Compression:** Gzip habilitado
3. **CDN:** Usar CDN para assets estáticos
4. **Replicas:** Escalar para múltiplas instâncias se necessário

---

## 🚀 URLs

| Ambiente | URL |
|----------|-----|
| Development | `http://localhost:3000` |
| EasyPanel | `https://seu-dominio.easypanel.io` |
| Custom Domain | `https://seu-dominio.com` |
| Health Check | `https://seu-dominio/health` |
| GitHub | `https://github.com/sxsevenxperts/appjacyaramobile` |

---

## ✨ Próximos Passos

1. Configurar domínio customizado
2. Ativar SSL/HTTPS
3. Configurar backups automáticos
4. Monitorar logs e performance
5. Implementar CI/CD com GitHub Actions

---

**App pronto para produção! 🎉**

Desenvolvido com ❤️ para Clínica Estética Jacyara Ponte
