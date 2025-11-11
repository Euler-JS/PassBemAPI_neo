#!/bin/bash

# Script de inicialização para Coolify
# Este script é executado após o container iniciar

echo "🚀 Iniciando PassBem API..."

# Aguardar MongoDB estar pronto
echo "⏳ Aguardando conexão com MongoDB..."
sleep 10

# Verificar se o Super Admin já existe
echo "👤 Verificando Super Admin..."
node -e "
const mongoose = require('mongoose');
const { acess } = require('./src/database/Mongo');

mongoose.connect(acess, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const Admin = require('./src/models/Admin');
  const adminExists = await Admin.findOne({ email: 'superadmin@passbem.com' });
  if (!adminExists) {
    console.log('🎉 Criando Super Admin...');
    require('./src/scripts/createSuperAdmin');
  } else {
    console.log('✅ Super Admin já existe');
  }
  process.exit(0);
}).catch(err => {
  console.error('❌ Erro ao conectar MongoDB:', err);
  process.exit(1);
});
"

# Verificar health check
echo "🏥 Verificando health check..."
curl -f http://localhost:3333/health || exit 1

echo "✅ PassBem API iniciada com sucesso!"
echo "🌐 API disponível em: http://localhost:3333"
echo "📊 Health check: http://localhost:3333/health"