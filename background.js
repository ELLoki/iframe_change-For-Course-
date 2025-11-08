// background.js - Service Worker para Manifest V3

// Quando a extensão é clicada, alterna o painel (abre/fecha)
chrome.action.onClicked.addListener(async (tab) => {
  try {
    console.log('🚀 NeuroSpeed: Toggle do painel na aba:', tab.url);
    
    // Verifica se é a URL correta
    if (!tab.url || !tab.url.includes('plugadosead.fiqueligadonews.com.br')) {
      // Tenta mostrar um alert na página (se possível)
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert('⚠️ Por favor, abra uma página do site de aulas primeiro!')
        });
      } catch (e) {
        console.warn('Não foi possível mostrar alert:', e);
      }
      return;
    }
    
    // Primeiro, verifica se o painel já existe
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: false },
      world: 'MAIN',
      func: togglePanel
    });
    
    const panelExists = result[0]?.result?.exists;
    const wasVisible = result[0]?.result?.wasVisible;
    
    if (panelExists) {
      // Painel já existe, apenas alterna visibilidade
      console.log('✅ NeuroSpeed: Painel encontrado! Alternando visibilidade...');
      const newState = wasVisible ? 'fechado' : 'aberto';
      
      // Se está abrindo, aplica estilo glass
      if (!wasVisible) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: false },
          world: 'MAIN',
          func: applyGlassStyle
        });
      }
      
      // Atualiza ícone/badge
      chrome.action.setBadgeText({
        tabId: tab.id,
        text: newState === 'aberto' ? 'ON' : ''
      });
      chrome.action.setBadgeBackgroundColor({ color: newState === 'aberto' ? '#00ff00' : '#888888' });
      
    } else {
      // Painel não existe, precisa injetar o código
      console.log('📥 Painel não encontrado. Baixando código do GitHub...');
      
      // Baixa o código do GitHub
      const response = await fetch('https://raw.githubusercontent.com/ELLoki/iframe_change-For-Course-/main/script.txt');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const code = await response.text();
      console.log('✅ NeuroSpeed: Código baixado do GitHub!', code.length, 'caracteres');
      
      // Injeta o código
      await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: false },
        world: 'MAIN',
        func: executeCode,
        args: [code]
      });
      
      console.log('✅ NeuroSpeed: Script injetado com sucesso!');
      
      // Aplica estilo glass após injeção
      setTimeout(async () => {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: false },
          world: 'MAIN',
          func: applyGlassStyle
        });
        
        chrome.action.setBadgeText({
          tabId: tab.id,
          text: 'ON'
        });
        chrome.action.setBadgeBackgroundColor({ color: '#00ff00' });
      }, 1500);
    }
    
  } catch (error) {
    console.error('❌ NeuroSpeed: Erro:', error);
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => alert('❌ Erro ao carregar NeuroSpeed: ' + error.message)
      });
    } catch (e) {
      console.error('Erro ao mostrar alert:', e);
    }
  }
});

// Verifica se o painel existe e retorna seu estado (procura dentro do iframe também)
function togglePanel() {
  // Primeiro tenta encontrar na página principal
  let panel = document.getElementById('neuroSpeedPanel');
  let innerDoc = document;
  
  // Se não encontrou, procura dentro do iframe
  if (!panel) {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      try {
        innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        panel = innerDoc.getElementById('neuroSpeedPanel');
      } catch (e) {
        console.warn('Não foi possível acessar o iframe:', e);
      }
    }
  }
  
  if (!panel) {
    return { exists: false, wasVisible: false };
  }
  
  // Verifica se está visível de forma mais robusta
  // Usa o window do documento correto (iframe ou página principal)
  const docWindow = innerDoc.defaultView || innerDoc.parentWindow || window;
  const computedStyle = docWindow.getComputedStyle(panel);
  const isVisible = computedStyle.display !== 'none' && 
                    computedStyle.visibility !== 'hidden' &&
                    parseFloat(computedStyle.opacity) > 0 &&
                    !panel.hasAttribute('hidden') &&
                    panel.offsetParent !== null;
  
  // Alterna visibilidade
  if (isVisible) {
    // Fecha com animação suave
    panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      panel.style.display = 'none';
      panel.style.visibility = 'hidden';
      panel.setAttribute('hidden', 'true');
    }, 300);
    
    console.log('🔒 NeuroSpeed: Painel fechado');
  } else {
    // Abre com animação suave
    panel.removeAttribute('hidden');
    panel.style.display = '';
    panel.style.visibility = 'visible';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-10px)';
    
    // Força reflow
    panel.offsetHeight;
    
    // Anima para visível
    requestAnimationFrame(() => {
      panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
    });
    
    console.log('🔓 NeuroSpeed: Painel aberto');
  }
  
  return { exists: true, wasVisible: isVisible };
}

// Aplica estilo glass/blur elegante no painel (procura dentro do iframe também)
function applyGlassStyle() {
  // Primeiro tenta encontrar na página principal
  let panel = document.getElementById('neuroSpeedPanel');
  let innerDoc = document;
  
  // Se não encontrou, procura dentro do iframe
  if (!panel) {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      try {
        innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        panel = innerDoc.getElementById('neuroSpeedPanel');
      } catch (e) {
        console.warn('Não foi possível acessar o iframe:', e);
      }
    }
  }
  
  if (!panel) {
    console.warn('⚠️ Painel não encontrado para aplicar estilo');
    return;
  }
  
  // Cria ou atualiza o estilo glass no documento correto (iframe ou página principal)
  let styleId = 'neuroSpeedGlassStyle';
  let styleEl = innerDoc.getElementById(styleId);
  
  if (!styleEl) {
    styleEl = innerDoc.createElement('style');
    styleEl.id = styleId;
    innerDoc.head.appendChild(styleEl);
  }
  
  // CSS com efeito glass/blur moderno e elegante
  styleEl.textContent = `
    #neuroSpeedPanel {
      /* Glass effect - efeito de vidro fosco com fundo preto */
      background: rgba(0, 0, 0, 0.3) !important;
      backdrop-filter: blur(25px) saturate(200%) !important;
      -webkit-backdrop-filter: blur(25px) saturate(200%) !important;
      
      /* Borda elegante com gradiente sutil */
      border: 1px solid rgba(255, 255, 255, 0.25) !important;
      border-radius: 20px !important;
      
      /* Sombra multicamada para profundidade */
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.15) inset,
        0 0 100px rgba(0, 255, 0, 0.3),
        0 4px 16px rgba(0, 0, 0, 0.2) !important;
      
      /* Transições suaves para todas as propriedades */
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
      
      /* Garante visibilidade */
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      
      /* Melhora a legibilidade do texto */
      color: rgba(255, 255, 255, 0.95) !important;
    }
    
    /* Efeito hover mais pronunciado */
    #neuroSpeedPanel:hover {
      background: rgba(0, 0, 0, 0.4) !important;
      box-shadow: 
        0 12px 48px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.25) inset,
        0 0 120px rgba(0, 255, 0, 0.5),
        0 6px 20px rgba(0, 0, 0, 0.3) !important;
      transform: translateY(-3px) scale(1.01) !important;
      border-color: rgba(255, 255, 255, 0.35) !important;
    }
    
    /* Texto dentro do painel com sombra para legibilidade */
    #neuroSpeedPanel * {
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
      color: rgba(255, 255, 255, 0.95) !important;
    }
    
    /* Títulos e labels com mais destaque */
    #neuroSpeedPanel h1,
    #neuroSpeedPanel h2,
    #neuroSpeedPanel h3,
    #neuroSpeedPanel label {
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
      color: rgba(255, 255, 255, 1) !important;
    }
    
    /* Botões com glass effect refinado */
    #neuroSpeedPanel button,
    #neuroSpeedPanel input[type="button"],
    #neuroSpeedPanel input[type="submit"],
    #neuroSpeedPanel input[type="range"] {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.25) 0%, 
        rgba(255, 255, 255, 0.15) 100%) !important;
      backdrop-filter: blur(15px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(15px) saturate(180%) !important;
      border: 1px solid rgba(255, 255, 255, 0.35) !important;
      border-radius: 10px !important;
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      color: rgba(255, 255, 255, 0.95) !important;
    }
    
    /* Hover nos botões */
    #neuroSpeedPanel button:hover,
    #neuroSpeedPanel input[type="button"]:hover,
    #neuroSpeedPanel input[type="submit"]:hover {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.35) 0%, 
        rgba(255, 255, 255, 0.25) 100%) !important;
      transform: scale(1.08) translateY(-2px) !important;
      box-shadow: 
        0 6px 16px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset,
        0 0 20px rgba(0, 255, 0, 0.4) !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
    }
    
    /* Inputs e selects também com glass effect */
    #neuroSpeedPanel input[type="text"],
    #neuroSpeedPanel input[type="number"],
    #neuroSpeedPanel select,
    #neuroSpeedPanel textarea {
      background: rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: blur(10px) !important;
      -webkit-backdrop-filter: blur(10px) !important;
      border: 1px solid rgba(255, 255, 255, 0.25) !important;
      border-radius: 8px !important;
      color: rgba(255, 255, 255, 0.95) !important;
    }
    
    #neuroSpeedPanel input:focus,
    #neuroSpeedPanel select:focus,
    #neuroSpeedPanel textarea:focus {
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(0, 255, 0, 0.5) !important;
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.3) !important;
      outline: none !important;
    }
    
    /* Scrollbar customizada com glass effect */
    #neuroSpeedPanel::-webkit-scrollbar {
      width: 8px;
    }
    
    #neuroSpeedPanel::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }
    
    #neuroSpeedPanel::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      backdrop-filter: blur(10px);
    }
    
    #neuroSpeedPanel::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `;
  
  console.log('✅ Estilo glass aplicado no painel!');
}

// Esta função executa no contexto da PÁGINA (world: 'MAIN'), não da extensão
// Por isso pode executar qualquer código sem restrições de CSP
function executeCode(code) {
  try {
    console.log('🚀 NeuroSpeed: Executando código na página...');
    
    // Cria um script element e injeta
    // Como estamos no contexto da página (world: 'MAIN'), isso funciona
    const script = document.createElement('script');
    script.textContent = code;
    
    // Injeta no head
    (document.head || document.documentElement).appendChild(script);
    
    // Remove após injetar (opcional, mas limpa o DOM)
    script.remove();
    
    console.log('✅ NeuroSpeed: Código injetado!');
    
    // Aguarda um pouco e verifica se funcionou
    setTimeout(() => {
      const panel = document.getElementById('neuroSpeedPanel');
      if (panel) {
        console.log('✅ NeuroSpeed: Painel encontrado e ativado!');
        
        // Notificação visual elegante
        showNotification('✅ NeuroSpeed ATIVADO!', 'success');
      } else {
        console.warn('⚠️ NeuroSpeed: Código executado, mas painel não encontrado após 1s');
        
        // Tenta novamente após mais tempo
        setTimeout(() => {
          const panel2 = document.getElementById('neuroSpeedPanel');
          if (panel2) {
            console.log('✅ NeuroSpeed: Painel encontrado após 3s!');
            showNotification('✅ NeuroSpeed ATIVADO!', 'success');
          } else {
            console.error('❌ NeuroSpeed: Painel não encontrado. O script do GitHub pode não ter criado o painel.');
            showNotification('⚠️ Painel não encontrado', 'warning');
          }
        }, 2000);
      }
    }, 1000);
    
  } catch (error) {
    console.error('❌ Erro ao executar código:', error);
    showNotification('❌ Erro: ' + error.message, 'error');
  }
}

// Função para mostrar notificações elegantes
function showNotification(message, type = 'success') {
  // Remove notificação anterior se existir
  const existing = document.getElementById('neuroSpeedNotification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.id = 'neuroSpeedNotification';
  notification.textContent = message;
  
  const colors = {
    success: { bg: 'rgba(0, 255, 0, 0.2)', border: 'rgba(0, 255, 0, 0.5)', text: '#00ff00' },
    warning: { bg: 'rgba(255, 165, 0, 0.2)', border: 'rgba(255, 165, 0, 0.5)', text: '#ffa500' },
    error: { bg: 'rgba(255, 0, 0, 0.2)', border: 'rgba(255, 0, 0, 0.5)', text: '#ff0000' }
  };
  
  const color = colors[type] || colors.success;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color.bg};
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid ${color.border};
    color: ${color.text};
    padding: 15px 20px;
    z-index: 999999;
    border-radius: 12px;
    font-weight: bold;
    font-size: 14px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease-out;
  `;
  
  // Adiciona animação CSS
  if (!document.getElementById('neuroSpeedNotificationStyle')) {
    const style = document.createElement('style');
    style.id = 'neuroSpeedNotificationStyle';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

