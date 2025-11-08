# 🔧 Guia de Configuração - NeuroSpeed Extension

## 📋 Pré-requisitos

1. Conta no GitHub
2. Navegador Chrome ou Edge
3. Acesso ao modo desenvolvedor do navegador

## 🚀 Passo a Passo

### 1. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome sugerido: `neurospeed-extension`
4. Marque como **Público** (para acesso via Raw GitHub)
5. Não inicialize com README (vamos fazer upload manual)
6. Clique em "Create repository"

### 2. Upload dos Arquivos para o GitHub

#### Opção A: Via Interface Web

1. No repositório criado, clique em "Add file" > "Upload files"
2. Arraste o arquivo `script.txt`
3. Adicione uma mensagem de commit: "Initial commit: Video controller script"
4. Clique em "Commit changes"

#### Opção B: Via Git (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/neurospeed-extension.git
cd neurospeed-extension

# Copie o script.txt para a pasta
# (já deve estar na pasta extensao/)

# Adicione e faça commit
git add script.txt
git commit -m "Initial commit: Video controller script"
git push origin main
```

### 3. Obter URL do Arquivo no GitHub

1. Acesse seu repositório no GitHub
2. Clique no arquivo `script.txt`
3. Clique no botão "Raw" (canto superior direito)
4. Copie a URL completa (ex: `https://raw.githubusercontent.com/SEU-USUARIO/neurospeed-extension/main/script.txt`)

### 4. Configurar a Extensão

1. Abra o arquivo `background.js`
2. Encontre a linha 58:
   ```javascript
   const response = await fetch('https://raw.githubusercontent.com/ELLoki/iframe_change-For-Course-/main/script.txt');
   ```
3. Substitua pela URL do seu repositório:
   ```javascript
   const response = await fetch('https://raw.githubusercontent.com/SEU-USUARIO/neurospeed-extension/main/script.txt');
   ```

### 5. Atualizar manifest.json (Opcional)

Edite o `manifest.json` se necessário:

```json
{
  "manifest_version": 3,
  "name": "NeuroSpeed - Video Controller",
  "version": "1.0.0",
  "description": "Controle avançado de vídeos para plataformas de ensino",
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "*://plugadosead.fiqueligadonews.com.br/*",
    "https://raw.githubusercontent.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_title": "NeuroSpeed - Clique para ativar"
  }
}
```

### 6. Instalar a Extensão

1. Abra o Chrome/Edge
2. Vá para:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Ative o **"Modo do desenvolvedor"** (toggle no canto superior direito)
4. Clique em **"Carregar sem compactação"**
5. Selecione a pasta `extensao`
6. A extensão será instalada!

### 7. Testar a Extensão

1. Acesse uma página de aula (ex: `https://plugadosead.fiqueligadonews.com.br/...`)
2. Clique no ícone da extensão na barra de ferramentas
3. O painel de controle deve aparecer no canto inferior direito
4. Teste as funcionalidades:
   - Selecionar vídeo
   - Alterar velocidade
   - Baixar vídeo
   - Extrair áudio

## 🔄 Atualizar o Código

### Para Desenvolvedores

1. Edite o arquivo `script.txt` localmente
2. Teste localmente (recarregue a extensão)
3. Quando estiver satisfeito, faça commit e push:

```bash
git add script.txt
git commit -m "Atualização: [descreva a mudança]"
git push origin main
```

### Para Usuários

Os usuários receberão automaticamente a atualização na próxima vez que:
1. Clicarem no ícone da extensão
2. A extensão fará fetch da versão mais recente do GitHub

## 🎯 Estrutura Recomendada do Repositório

```
neurospeed-extension/
├── script.txt                    # Script principal (obrigatório)
├── README.md                     # Documentação
├── CHANGELOG.md                  # Histórico de mudanças
└── .github/
    └── workflows/
        └── update-check.yml      # (Opcional) Verificar atualizações
```

## 🔐 Segurança

### Boas Práticas

1. **Nunca commite chaves de API** no código
2. **Use variáveis de ambiente** para dados sensíveis
3. **Valide sempre** os dados do GitHub antes de executar
4. **Mantenha o repositório atualizado** com as últimas correções

### Verificação de Integridade

Adicione verificação de hash (opcional):

```javascript
// No background.js, após baixar o código
const expectedHash = 'sha256-hash-do-arquivo';
// Verificar hash antes de executar
```

## 📝 Checklist de Configuração

- [ ] Repositório criado no GitHub
- [ ] Arquivo `script.txt` enviado para o GitHub
- [ ] URL do GitHub atualizada no `background.js`
- [ ] `manifest.json` configurado corretamente
- [ ] Extensão instalada no navegador
- [ ] Testes realizados com sucesso
- [ ] README.md criado
- [ ] Documentação atualizada

## 🐛 Problemas Comuns

### "Erro ao carregar script do GitHub"

**Solução:**
1. Verifique se a URL está correta
2. Verifique se o arquivo existe no repositório
3. Verifique se o repositório é público
4. Teste a URL no navegador (deve mostrar o código)

### "Painel não aparece"

**Solução:**
1. Verifique o console do navegador (F12)
2. Verifique se está na URL correta
3. Verifique se há erros de JavaScript
4. Recarregue a página e tente novamente

### "Erro de CORS"

**Solução:**
1. Use a URL Raw do GitHub (não a URL da página)
2. Verifique se o repositório é público
3. Certifique-se de que o `host_permissions` inclui o GitHub

## 🎓 Próximos Passos

1. Personalizar o estilo do painel
2. Adicionar novas funcionalidades
3. Implementar sistema de transcrição
4. Publicar na Chrome Web Store

---

**Última atualização:** 2025-01-08

