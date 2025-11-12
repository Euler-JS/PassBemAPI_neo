const fs = require('fs');
const path = require('path');

// Diretórios para processar
const directories = [
    path.resolve(__dirname, '..', 'uploads'),
    path.resolve(__dirname, '..', 'public', 'uploads')
];

console.log('🔄 Iniciando migração de nomes de arquivos...');
console.log('📝 Objetivo: Remover timestamps adicionados pelo servidor\n');

let totalRenamed = 0;
let totalSkipped = 0;
let totalErrors = 0;

directories.forEach(dir => {
    console.log(`\n📁 Processando: ${dir}`);
    console.log('─'.repeat(60));
    
    if (!fs.existsSync(dir)) {
        console.log(`   ⚠️  Diretório não existe, pulando...\n`);
        return;
    }

    const files = fs.readdirSync(dir);
    let renamed = 0;
    let skipped = 0;
    let errors = 0;

    console.log(`   📊 Total de arquivos encontrados: ${files.length}\n`);

    files.forEach(filename => {
        const filePath = path.join(dir, filename);
        
        // Verificar se é arquivo
        if (!fs.statSync(filePath).isFile()) {
            return;
        }

        // Padrão: QUALQUER_NOME-TIMESTAMP_ADICIONADO.ext
        // Exemplo: 1-1628000656704-1762938988055.PNG
        //          └── original ──┘└─ adicionado ─┘
        const match = filename.match(/^(.+)-(\d{13})(\.\w+)$/);
        
        if (match) {
            const [fullMatch, nameWithoutLastTimestamp, lastTimestamp, ext] = match;
            
            // O nome sem o último timestamp
            const potentialOriginalName = `${nameWithoutLastTimestamp}${ext}`;
            const newFilePath = path.join(dir, potentialOriginalName);
            
            // Verificar se o novo nome já existe
            if (fs.existsSync(newFilePath) && newFilePath !== filePath) {
                console.log(`   ⚠️  ${filename}`);
                console.log(`      → Destino já existe: ${potentialOriginalName}`);
                skipped++;
            } else if (newFilePath === filePath) {
                // Arquivo já está com nome correto
                skipped++;
            } else {
                try {
                    fs.renameSync(filePath, newFilePath);
                    console.log(`   ✅ ${filename}`);
                    console.log(`      → ${potentialOriginalName}`);
                    renamed++;
                } catch (error) {
                    console.log(`   ❌ Erro: ${filename}`);
                    console.log(`      → ${error.message}`);
                    errors++;
                }
            }
        } else {
            // Arquivo não corresponde ao padrão, não precisa renomear
            skipped++;
        }
    });

    console.log(`\n   📊 Resumo do diretório:`);
    console.log(`      ✅ Renomeados: ${renamed}`);
    console.log(`      ⏭️  Mantidos: ${skipped}`);
    console.log(`      ❌ Erros: ${errors}`);
    console.log(`      📁 Total: ${files.length}`);

    totalRenamed += renamed;
    totalSkipped += skipped;
    totalErrors += errors;
});

console.log('\n' + '═'.repeat(60));
console.log('📊 RESUMO GERAL DA MIGRAÇÃO:');
console.log('═'.repeat(60));
console.log(`   ✅ Total renomeados: ${totalRenamed}`);
console.log(`   ⏭️  Total mantidos: ${totalSkipped}`);
console.log(`   ❌ Total erros: ${totalErrors}`);
console.log('═'.repeat(60) + '\n');

if (totalErrors > 0) {
    console.log('⚠️  Alguns arquivos não puderam ser renomeados.');
    console.log('   Verifique as permissões e espaço em disco.\n');
    process.exit(1);
} else if (totalRenamed === 0) {
    console.log('ℹ️  Nenhum arquivo precisou ser renomeado.');
    console.log('   Todos os arquivos já estão com nomes corretos.\n');
    process.exit(0);
} else {
    console.log('✅ Migração concluída com sucesso!');
    console.log(`   ${totalRenamed} arquivo(s) agora têm o nome original.\n`);
    process.exit(0);
}
