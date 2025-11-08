# 🎥 NeuroSpeed - Extensão de Controle de Vídeo

Extensão para Chrome/Edge que adiciona controles avançados de vídeo em plataformas de ensino online.

## 🚀 Funcionalidades

- ⚡ Controle de velocidade de reprodução (1x, 1.5x, 2x)
- 📥 Download de vídeos (MP4)
- 🎵 Extração de áudio (MP3/WAV)
- 🎨 Interface moderna com efeito glass
- 📊 Informações do vídeo em tempo real
- 🔄 Suporte a múltiplos vídeos na mesma página

## 📁 Estrutura do Projeto

```
extensao/
├── manifest.json          # Manifest da extensão (Manifest V3)
├── background.js          # Service Worker que gerencia a extensão
├── script.txt            # Script principal (será hospedado no GitHub)
├── README.md             # Este arquivo
└── PLANEJAMENTO_TRANSCRICAO.md  # Planejamento do sistema de transcrição
```

## 🔧 Como Funciona

A extensão funciona buscando o código do script diretamente do GitHub:

1. **Usuário clica no ícone da extensão**
2. **Background.js verifica se o painel já existe**
3. **Se não existir, faz fetch do script.txt do GitHub**
4. **Injeta o script na página (world: 'MAIN')**
5. **O script cria o painel de controle dentro do iframe**

## 📦 Instalação

### Opção 1: Instalação Manual (Desenvolvimento)

1. Clone ou baixe este repositório
2. Abra o Chrome/Edge
3. Vá para `chrome://extensions/` ou `edge://extensions/`
4. Ative o "Modo do desenvolvedor"
5. Clique em "Carregar sem compactação"
6. Selecione a pasta `extensao`

### Opção 2: Publicação na Chrome Web Store (Produção)

1. Compacte a pasta `extensao` em um arquivo `.zip`
2. Acesse [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Faça upload do arquivo `.zip`
4. Preencha as informações da extensão
5. Submeta para revisão

## ⚙️ Configuração do GitHub

### 1. Criar Repositório no GitHub

```bash
# Criar repositório no GitHub
# Exemplo: https://github.com/seu-usuario/neurospeed-extension
```

### 2. Configurar URL no background.js

Edite o arquivo `background.js` e altere a URL do GitHub:

```javascript
// Linha 58 - Altere para seu repositório
const response = await fetch('https://raw.githubusercontent.com/SEU-USUARIO/SEU-REPO/main/script.txt');
```

### 3. Upload dos Arquivos

1. Faça upload do `script.txt` para a branch `main`
2. Certifique-se de que o arquivo está acessível via Raw GitHub

## 🔐 Permissões

A extensão requer as seguintes permissões:

- `activeTab`: Para injetar scripts na aba ativa
- `scripting`: Para executar código na página
- `host_permissions`: Para acessar o site de aulas e o GitHub

## 🎨 Personalização

### Alterar Estilo do Painel

Edite o arquivo `script.txt` e modifique os estilos CSS do painel:

```javascript
// Linha ~33 - Background do painel
background: rgba(0, 0, 0, 0.3);  // Fundo preto com 30% de opacidade
```

### Alterar URL do Site

Edite o `manifest.json`:

```json
"host_permissions": [
  "*://seu-site.com/*",
  "https://raw.githubusercontent.com/*"
]
```

## 🐛 Troubleshooting

### O painel não aparece

1. Verifique se está na URL correta
2. Verifique o console do navegador (F12)
3. Verifique se o script.txt está acessível no GitHub
4. Verifique se há erros de CORS

### Erro ao baixar do GitHub

1. Verifique se a URL do GitHub está correta
2. Verifique se o arquivo `script.txt` existe no repositório
3. Verifique se o arquivo está na branch correta (`main`)

### Erro de CORS

1. Certifique-se de que o GitHub permite acesso via Raw
2. Verifique se não há bloqueadores de CORS instalados
3. Tente usar uma URL alternativa (GitHub Pages, etc.)

## 📝 Desenvolvimento

### Estrutura do Código

- **manifest.json**: Configuração da extensão
- **background.js**: Service Worker (gerencia a extensão)
- **script.txt**: Código principal (injeta na página)

### Fluxo de Atualização

1. Edite o `script.txt` localmente
2. Faça commit e push para o GitHub
3. Os usuários receberão a atualização automaticamente na próxima vez que clicarem na extensão

### Testes

1. Carregue a extensão em modo desenvolvedor
2. Acesse uma página de aula
3. Clique no ícone da extensão
4. Verifique se o painel aparece
5. Teste todas as funcionalidades

## 🔄 Atualizações

Para atualizar a extensão:

1. Edite o `script.txt`
2. Faça commit e push para o GitHub
3. Aumente a versão no `manifest.json`
4. Os usuários receberão a atualização automaticamente

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📧 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato.

---

**Versão:** 1.0.2  
**Última atualização:** 2025-01-08

