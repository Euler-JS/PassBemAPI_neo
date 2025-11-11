# 🚀 Deploy PassBem API no Coolify

Este guia explica como fazer deploy da PassBem API usando os arquivos Docker preparados para Coolify.

## 📋 Arquivos Preparados

- `Dockerfile.coolify` - Dockerfile otimizado para produção
- `docker-compose.coolify.yml` - Compose específico para Coolify
- `.coolify.env.example` - Exemplo de variáveis de ambiente

## 🐳 Pré-requisitos

1. **Servidor Coolify** instalado e configurado
2. **Domínio** apontando para seu servidor Coolify
3. **Acesso SSH** ao servidor
4. **Repositório Git** (GitHub/GitLab) com o código

## 🚀 Passo a Passo do Deploy

### 1. Preparar o Repositório

```bash
# Adicionar arquivos ao Git
git add Dockerfile.coolify docker-compose.coolify.yml .coolify.env.example
git commit -m "Add Coolify deployment files"
git push origin main
```

### 2. Criar Projeto no Coolify

1. Acesse seu painel Coolify (`https://coolify.seu-dominio.com`)
2. Clique em **"Projects"** → **"Add Project"**
3. Nomeie como `passbem-api`
4. Selecione seu servidor

### 3. Adicionar Aplicação

1. No projeto, clique **"Add Resource"** → **"Application"**
2. Configure:
   - **Name**: `passbem-api`
   - **Repository**: URL do seu repositório Git
   - **Branch**: `main` (ou sua branch principal)
   - **Build Pack**: `docker`
   - **Docker Compose Path**: `docker-compose.coolify.yml`
   - **Dockerfile Path**: `Dockerfile.coolify`

### 4. Configurar Environment Variables

No Coolify, adicione estas variáveis em **"Environment Variables"**:

```
NODE_ENV=production
PORT=3333
MONGODB_URL=mongodb://delcciodev:delcciodev@paulinasource-shard-00-00.x1op8.mongodb.net:27017,paulinasource-shard-00-01.x1op8.mongodb.net:27017,paulinasource-shard-00-02.x1op8.mongodb.net:27017/PassBemAPP?authSource=admin&replicaSet=atlas-gzdwl6-shard-0&retryWrites=true&w=majority&ssl=true
FRONTEND_URL=https://seu-frontend.com
COOLIFY_URL=https://passbem-api.seu-dominio.com
```

### 5. Configurar Domínio

1. Em **"Domains"**, adicione seu domínio personalizado
2. Ative **"SSL"** (Let's Encrypt será configurado automaticamente)

### 6. Configurar Volumes (Opcional)

Para persistir uploads, configure volumes no Coolify:
- **Source**: `uploads_data`
- **Target**: `/app/uploads`
- **Type**: `volume`

### 7. Deploy

1. Clique em **"Deploy"** na aplicação
2. Acompanhe o progresso nos logs
3. Aguarde a conclusão do build e deploy

## 🧪 Testes Pós-Deploy

### Health Check
```bash
curl https://passbem-api.seu-dominio.com/health
```

### Criar Super Admin
```bash
# Via terminal do Coolify ou SSH
docker exec -it passbem-api npm run create-admin
```

### Testar Endpoints
```bash
# Dashboard
curl -H "Authorization: SEU_ADMIN_ID" https://passbem-api.seu-dominio.com/dasboard

# Login admin
curl -H "email: superadmin@passbem.com" -H "senha: SuperAdmin@2025!" \
  https://passbem-api.seu-dominio.com/usersdata
```

## 🔧 Configurações Avançadas

### WebSocket Support

Para WebSocket funcionar corretamente, certifique-se que:
1. A porta 3333 está exposta
2. O proxy reverso do Coolify suporta WebSocket upgrade

### CORS para Frontend

O CORS já está configurado para aceitar origens dinâmicas baseadas em variáveis de ambiente.

### Backup e Monitoramento

- **Health Checks**: Automáticos via `/health`
- **Logs**: Disponíveis no painel Coolify
- **Backups**: Configure backups automáticos para volumes

## 🐛 Troubleshooting

### Build Falhando
- Verifique se todas as dependências estão no `package.json`
- Confirme que o `Dockerfile.coolify` está correto

### WebSocket Não Funciona
- Verifique configuração de proxy no Coolify
- Teste com `ws://` ao invés de `wss://`

### MongoDB Connection
- Certifique-se que o IP do servidor está na whitelist do Atlas
- Verifique string de conexão

### Uploads Não Funcionam
- Verifique permissões dos volumes
- Confirme que diretórios existem no container

## 📊 Monitoramento

### Métricas Disponíveis
- **Health Check**: `/health` - Status da aplicação e MongoDB
- **Uptime**: Tempo de atividade da aplicação
- **Logs**: Logs em tempo real no Coolify

### Alertas Recomendados
- Health check falhando
- Uso alto de CPU/Memória
- Erros 5xx frequentes

## 🔄 Atualizações

Para atualizar a aplicação:
1. Faça push das mudanças para o repositório
2. No Coolify, clique em **"Redeploy"**
3. Acompanhe o deploy nos logs

## 📞 Suporte

Para problemas específicos do Coolify, consulte:
- [Documentação Coolify](https://coolify.io/docs)
- [GitHub Coolify](https://github.com/coolifyio/coolify)

---

**Status**: ✅ Pronto para deploy no Coolify