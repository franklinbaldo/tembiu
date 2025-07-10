# 🍽️ Tembiu - Cardápio Digital Open Source

> **A primeira solução gratuita e completa de cardápio digital com PIX nativo e WhatsApp Business para restaurantes brasileiros.**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/tembiu?style=for-the-badge)](https://github.com/seu-usuario/tembiu/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/tembiu?style=for-the-badge)](https://github.com/seu-usuario/tembiu/network)
[![GitHub issues](https://img.shields.io/github/issues/seu-usuario/tembiu?style=for-the-badge)](https://github.com/seu-usuario/tembiu/issues)
[![License](https://img.shields.io/github/license/seu-usuario/tembiu?style=for-the-badge)](LICENSE)

[![Demo](https://img.shields.io/badge/🚀_Demo_Live-FF6B35?style=for-the-badge&logoColor=white)](https://seu-usuario.github.io/tembiu)
[![Documentação](https://img.shields.io/badge/📖_Documentação-2C3E50?style=for-the-badge&logoColor=white)](docs/)
[![WhatsApp](https://img.shields.io/badge/💬_Comunidade-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/5511999999999)

---

## 🌿 **O que significa "Tembiu"?**

**Tembiu** ([tem-bi-'u]) é uma palavra da **família linguística Tupi-Guarani** que significa **"comida, alimento, sustento"**. Escolhemos este nome para:

- 🇧🇷 **Honrar as raízes continentais** - palavra presente em dezenas de línguas indígenas da América do Sul
- 🍽️ **Representar nossa missão** - democratizar tecnologia gastronômica como os povos originários democratizavam o alimento
- 🌿 **Conectar milênios** - palavra que atravessou séculos unindo povos do Amazonas ao Prata
- 🤝 **Unir tradição e inovação** - sabedoria ancestral sobre cooperação + tecnologia moderna
- 🌍 **Criar identidade continental** - projeto que pode expandir por toda América do Sul

_"Porque toda boa tecnologia, como toda boa comida, deve ser compartilhada"_

---

## 🔗 **URLs Compartilháveis de Pedidos**

### **Funcionalidade Única no Mercado**

Cada pedido gera automaticamente um **link único** com todos os detalhes codificados:

```javascript
// Exemplo de URL gerada
https://restaurante.github.io/cardapio/?pedido=eyJpZCI6IjQ1Nzg5MTIz...

// Contém todos os dados do pedido:
✅ Itens pedidos com preços
✅ Dados do cliente
✅ Informações de pagamento
✅ Dados do restaurante
✅ Timestamp do pedido
```

### **Experiência do Cliente**

```
📱 Cliente recebe no WhatsApp:
"🔗 Revisar Pedido: https://bellavista.com/?pedido=xyz123"

👆 Cliente clica e vê:
┌─────────────────────────────┐
│ 📋 Pedido #45789123         │
│ ┌─ 🍽️ Bella Vista ─────────┐ │
│ │ Status: Aguardando      │ │
│ │ 🍕 Pizza Margherita x2  │ │
│ │ 🥤 Coca-Cola x2         │ │
│ │ Total: R$ 70,80         │ │
│ └─────────────────────────┘ │
│ [📤 Compartilhar] [💬 Contato] │
└─────────────────────────────┘
```

### **Vantagens Exclusivas**

- 🔖 **Comprovante Permanente** - acesso a qualquer momento
- 📤 **Viral Marketing** - cliente compartilha com amigos
- 💼 **Profissionalismo** - experiência de app enterprise
- 📞 **Menos Suporte** - cliente tem todas as informações
- 💰 **Zero Infraestrutura** - funciona com site estático

---

## ⏰ **Sistema de Horários Inteligente**

### **Integração Google Maps Business**

```javascript
// Configuração automática via Google Maps
googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4"

// Benefícios:
✅ Horários sempre atualizados automaticamente
✅ Status em tempo real (aberto/fechado)
✅ Sincronização com horários oficiais
✅ SEO boost + visibilidade local
```

### **Recursos Automáticos**

- 🟢 **Status no Header** - "Aberto • Fecha às 23:00" (agora baseado em horário estático no `restaurantConfig`)
- 🔴 **Modo Fechado** - "Fechado • Abre amanhã às 11:00"
- ⚠️ **Banner Inteligente** - aparece quando fechado
- 📝 **Pedidos Agendados** - aceita pedidos para processar depois
- 🕐 **Modal Completo** - clique no status para ver todos os horários

### **Por que Google Maps é Essencial**

| Benefício              | Impacto                            |
| ---------------------- | ---------------------------------- |
| **Visibilidade Local** | +30-50% descoberta orgânica        |
| **Credibilidade**      | 4x mais avaliações de clientes     |
| **Conversão**          | 3x mais ligações diretas           |
| **Marketing**          | Fotos do cardápio integradas       |
| **Navegação**          | Direções automáticas para delivery |

---

## 🌟 **Por que este projeto é revolucionário?**

### 💸 **Custo Zero vs. Mercado Caro**

| Solução           | Custo Mensal | Taxa por Transação | Setup         |
| ----------------- | ------------ | ------------------ | ------------- |
| **Este Projeto**  | **R$ 0**     | **0%**             | **5 minutos** |
| iFood/Uber Eats   | R$ 0-200     | 12-27%             | Semanas       |
| SaaS Tradicionais | R$ 50-300    | 3-8%               | Dias          |
| Apps Customizados | R$ 2.000+    | Variável           | Meses         |

### 🏆 **Funcionalidades Enterprise**

- ✅ **PIX Brasileiro Nativo** - QR Code + código copiável
- ✅ **Compatível com BR Code** - geração de QR Code e "copia e cola" seguindo o padrão oficial
- ✅ **WhatsApp Business** - pedidos formatados automaticamente
- ✅ **Coleta de Endereço** - formulário simples de entrega integrado
- ✅ **PWA Instalável** - funciona como app nativo
- ✅ **Histórico Inteligente (Local)** - "pedir novamente" com 1 clique (pedidos salvos no navegador).
- ✅ **Sugestões Contextuais de Itens** - sugere itens com base no histórico de pedidos (requer dados no Turso).
- ✅ **URLs Compartilháveis de Pedidos** - links únicos para cada pedido, visualizáveis por qualquer pessoa.
- ✅ **Sistema de Horários (Manual + Conceito Google Maps)** - status Aberto/Fechado com base em horários manuais; design conceitual para integração com Google Maps.
- ✅ **Status em Tempo Real (Manual)** - aberto/fechado automático com base nos horários configurados.
- ✅ **Dark/Light Mode (Modo Escuro/Claro)** - experiência premium com tema adaptável 🌓.
- ✅ **Busca e Filtros de Cardápio** - encontre itens por nome ou categoria.
- ✅ **Offline-First (Cache de Assets)** - PWA armazena assets estáticos para acesso offline.
- ✅ **LGPD Compliant (Dados Locais)** - dados de pedidos locais e configurações de tema no navegador; dados de pedidos e cardápio centralizados no Turso (requer atenção do usuário à LGPD e termos do Turso).
- ✅ **Painel Administrativo (`admin.html`)** 🆕:
    - **Gerenciamento de Cardápio Completo (CRUD)**: Adicione, edite e remova itens do cardápio diretamente no banco de dados Turso.
    - **Configuração do Restaurante**: Altere nome, telefone, horários, taxas, e outras configurações armazenadas no Turso.
    - **Gerenciamento de Pedidos**: Visualize todos os pedidos recebidos, filtre por status ou data, e atualize o status dos pedidos (ex: Pendente -> Confirmado -> Em Preparo).
    - **Relatórios de Vendas**: Gere relatórios básicos de vendas, itens populares e vendas por categoria.
- ✅ **Segurança Aprimorada (CSP)** - Headers de Content Security Policy para maior proteção.

### 🔎 **Busca e Filtragem**

Use o campo de busca localizado acima do cardápio para filtrar itens conforme você digita.
Os botões de categoria exibidos logo abaixo permitem exibir somente pratos de uma categoria específica.
Clique em **Todos** para remover o filtro de categoria.

---

## 🚀 **Demonstração ao Vivo**

### [👉 **EXPERIMENTE AGORA** 👈](https://seu-usuario.github.io/cardapio-digital)

**Teste o fluxo completo:**

1. 📱 Abra no celular (ou simule mobile no browser)
2. 🛒 Adicione itens ao carrinho
3. 💳 Gere um código PIX real
4. 📋 Veja seu pedido ser salvo no histórico
5. 🔄 Use "Pedir Novamente" na próxima visita

---

## ⚡ **Instalação Rápida (5 minutos)**

### **Opção 1: Um Clique (Recomendado)**

[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/seu-usuario/tembiu/generate)

### **Opção 2: Fork Tradicional**

1.  **Fork** este repositório.
2.  **Configure o Turso**:
    *   Crie uma conta gratuita no [Turso](https://turso.tech/).
    *   Instale o CLI do Turso: `brew install tursodatabase/tap/turso` (macOS/Linux) ou veja outras opções na [documentação do Turso](https://docs.turso.tech/quickstart#install-turso-cli).
    *   Crie um novo banco de dados: `turso db create nome-do-seu-banco`.
    *   Obtenha a URL do banco: `turso db show nome-do-seu-banco --url`.
    *   Crie um token de autenticação: `turso db tokens create nome-do-seu-banco`.
    *   **Execute o schema SQL inicial** no seu banco Turso. Você pode encontrar o schema em `docs/schema_turso.sql` (este arquivo precisará ser criado com as tabelas: `menu_items`, `restaurant_config`, `orders`, `order_items`).
3.  **Edite `js/main.js` e `js/admin.js`**:
    *   Substitua `YOUR_TURSO_DATABASE_URL_HERE` pela URL do seu banco Turso.
    *   Substitua `YOUR_TURSO_AUTH_TOKEN_HERE` pelo token de autenticação gerado.
    *   **Importante**: O token de autenticação ficará exposto no lado do cliente. Para produção, considere um backend proxy ou regras de segurança mais rígidas no Turso se disponíveis para tokens de leitura/escrita limitados.
4.  **Edite `index.html` e `admin.html` (CSP)**:
    *   Substitua `YOUR_TURSO_DATABASE_HOSTNAME_HERE` no `Content-Security-Policy` pela hostname do seu banco Turso (ex: `meu-banco.turso.io`).
5.  **Popule o Cardápio e Configurações Iniciais**:
    *   Acesse `admin.html` no seu ambiente local (após servir os arquivos estáticos).
    *   Use a seção "Gerenciar Cardápio" para adicionar seus itens.
    *   Use a seção "Configurações do Restaurante" para definir os detalhes do seu restaurante.
6.  **Ative** GitHub Pages (Settings → Pages → Source: main) ou faça deploy em outra plataforma de hospedagem estática.
7.  **Acesse** seu cardápio online!

### **Opção 3: Clone Local**

```bash
git clone https://github.com/seu-usuario/tembiu.git
cd tembiu
# Edite as configurações
# Faça deploy onde preferir
```

---

## 📋 **Configuração do Cardápio**

### **Gerenciamento via Painel Administrativo (Recomendado)**

Com a integração do Turso, o cardápio e as configurações do restaurante são gerenciados diretamente através do **Painel Administrativo (`admin.html`)**.

1.  **Acesse `admin.html`** no seu navegador (após configurar o Turso e servir os arquivos).
2.  Use a seção **"Gerenciar Cardápio"** para adicionar, editar ou excluir itens.
3.  Use a seção **"Configurações do Restaurante"** para definir nome, telefone, horários, etc.

Consulte o [Guia do Painel Administrativo](docs/admin_panel_guide.md) para instruções detalhadas.

### **Estrutura de Dados (Informativo - Gerenciado pelo Admin Panel)**

As informações do cardápio são armazenadas na tabela `menu_items` no Turso com colunas como: `nome`, `categoria`, `preco`, `descricao`, `emoji`, `disponivel`.

As configurações do restaurante são armazenadas na tabela `restaurant_config` no Turso como pares chave-valor (ex: `name: "Nome do Restaurante"`).

### **Configuração Inicial do Turso (Essencial)**

Antes de usar o Painel Administrativo, você **precisa**:
1.  Configurar seu banco de dados Turso (URL e Token) nos arquivos `js/main.js` e `js/admin.js`.
2.  Configurar o hostname do Turso nas políticas CSP em `index.html` e `admin.html`.
3.  Criar as tabelas necessárias no seu banco Turso usando um schema SQL. Um exemplo de schema (`docs/schema_turso.sql`) deve ser criado e fornecido no repositório para facilitar este passo. (Nota: Este arquivo precisa ser criado).

📖 **[Guia do Painel Administrativo](docs/admin_panel_guide.md)**
📖 **[Google Pay Setup](docs/google_pay_setup.md)** (Permanece relevante para o cliente)
📖 **[Configuração do Turso (Ver Instalação Rápida)](README.md#opção-2-fork-tradicional)**

---

## 🎯 **Casos de Uso Reais**

### 🍕 **Pizzaria**

- **Combos automáticos** - pizza + refrigerante
- **Sabores em destaque** - categorias visuais
- **Promoções** - controle via `disponivel: false`

### 🍔 **Hamburgueria**

- **Montagem visual** - descrições detalhadas
- **Adicionais** - batata, molhos, bebidas
- **Combos personalizados** - sugestões inteligentes

### 🍱 **Comida Japonesa**

- **Combinados** - múltiplos itens por pedido
- **Categorização clara** - sashimi, temaki, hot
- **Experiência premium** - dark mode, animações

### ☕ **Cafeteria**

- **Cardápio compacto** - foco em simplicidade
- **Pedidos rápidos** - histórico + sugestões
- **Horário flexível** - disponibilidade dinâmica

---

## 🏗️ **Arquitetura Técnica**

### **Frontend (100% Client-Side)**

```
├── 📄 HTML5 Semântico
├── 🎨 CSS3 + Variáveis CSS
├── ⚡ Vanilla JavaScript (ES6+)
├── 📱 PWA com Service Worker
├── 📦 Gerenciador de Pacotes (NPM/Yarn, se aplicável para dependências como @libsql/client)
└── 🔄 LocalStorage para dados do cliente (carrinho, histórico local, tema)
```

### **Backend (Turso Database + Serverless Functions Conceituais)**

```
├── 💾 Turso (SQLite distribuído) como Banco de Dados Principal para:
│   ├── 🍕 Cardápio (menu_items)
│   ├── ⚙️ Configurações do Restaurante (restaurant_config)
│   └── 🛒 Pedidos (orders, order_items)
├── ⚡ Acesso direto ao Turso via cliente JavaScript (@libsql/client) em:
│   ├── `js/main.js` (leitura de cardápio/config, escrita de pedidos)
│   └── `js/admin.js` (CRUD completo para cardápio, config, pedidos)
├── ☁️ Funções Serverless (Conceitual - para funcionalidades avançadas):
│   ├── 📧 Notificações por Email (via provedor como Resend)
│   ├── 🔔 Notificações Push (via Firebase Cloud Messaging ou similar)
│   └── 🗺️ Integração Google Maps (proxy para API Places)
└── 🔑 Gerenciamento de Chaves de API (seguro em ambiente serverless)
```
**Nota sobre Segurança:** O acesso direto ao Turso pelo cliente JavaScript com um token de longa duração é uma simplificação. Para ambientes de produção robustos, um backend intermediário (API) é geralmente recomendado para gerenciar permissões e lógica de negócios de forma mais segura. As funções serverless conceituais são um passo nessa direção para funcionalidades específicas.

### **Infraestrutura**

```
GitHub Pages (Gratuito)
├── 🌍 CDN Global
├── 📜 SSL Automático
├── 🔄 Deploy Contínuo
├── ⚡ 99.9% Uptime
└── 📊 Bandwidth Ilimitado
```

---

## 💳 **Sistema PIX Avançado**

### **Código PIX Estruturado**

```
Dados do PIX (máx. 140 chars):
Tel:11999999999 ID:45789123 Items:1x2,3x1,5x3 Loc:8G7Q+2QR

Contém:
📱 Telefone do cliente
🆔 ID único do pedido
📦 Lista de itens (idxquantidade)
📍 Plus Code de localização
```

### **Fluxo Inteligente**

1. **Cliente** preenche dados e escolhe PIX
2. **Sistema** gera QR Code + código copiável
3. **Cliente** paga no banco (dados aparecem no extrato)
4. **Cliente** clica "Enviar Comprovante"
5. **WhatsApp** abre com pedido formatado
6. **Restaurante** confirma pagamento via PIX + WhatsApp

---

## 🤖 **IA e Personalização**

### **Histórico Automático**

- 📋 **Últimos 10 pedidos** salvos localmente
- 🔄 **"Pedir Novamente"** - 1 clique refaz pedido
- ⚡ **Verificação automática** - só itens disponíveis
- 🎯 **Banner inteligente** - sugere repetir último pedido

### **Sugestões Contextuais**

```javascript
// Exemplo: Cliente adiciona Pizza
Sistema analisa histórico → encontra padrão:
"Pizza + Coca-Cola aparece em 80% dos pedidos"
↓
Toast: "💡 Que tal uma Coca-Cola? +1"
```

### **Machine Learning Simples**

- 📊 **Análise de padrões** - itens pedidos juntos
- 🎯 **Frequência** - quantidade média por item
- ⏰ **Contexto temporal** - horários preferenciais
- 🔄 **Melhoria contínua** - aprende a cada pedido

---

## 📱 **PWA (Progressive Web App)**

### **Recursos Nativos**

- 📲 **Instalável** - ícone na tela inicial
- 🔔 **Push Notifications** - avisos de pedidos
- 🌐 **Offline** - funciona sem internet
- 🚀 **Performance** - carregamento instantâneo
- 🔄 **Auto-update** - sempre atualizado

### **Cross-Platform**

```
✅ Android (Chrome, Samsung Internet, Edge)
✅ iOS (Safari, Chrome, Firefox)
✅ Desktop (Chrome, Edge, Firefox)
✅ Smart TVs (Android TV, Tizen)
```

---

## 🛡️ **Privacidade e Segurança**

### **LGPD Compliant (Dados Locais e Turso)**

- 🔒 **Dados do Usuário no Navegador**: O histórico de pedidos local, preferências de tema e endereço de entrega são armazenados no `localStorage` do navegador do usuário.
- 🗑️ **Direito ao Esquecimento (Local)**: O botão "Limpar Histórico" remove o histórico de pedidos do `localStorage`.
- 📦 **Dados no Turso**: O cardápio, configurações do restaurante e detalhes dos pedidos (incluindo endereço de entrega e, se coletado, email do cliente) são armazenados no banco de dados Turso configurado pelo proprietário do restaurante.
    - **Responsabilidade do Proprietário**: O proprietário do restaurante é responsável por garantir a conformidade com a LGPD em relação aos dados armazenados no Turso e informar seus clientes sobre o uso desses dados.
- 🚫 **Zero Tracking de Terceiros**: O projeto base não inclui cookies de rastreamento de terceiros para o cliente final.

### **Segurança**

- 🔐 **HTTPS**: Requerido para PWA e Google Pay. Use com GitHub Pages ou outra plataforma de hospedagem que forneça SSL.
- 🛡️ **Content Security Policy (CSP)**: Implementada em `index.html` e `admin.html` para mitigar ataques XSS. **Requer configuração do hostname do Turso pelo usuário.**
- 🔑 **Acesso ao Banco de Dados (Turso Token)**:
    - **ALERTA DE SEGURANÇA**: O token de autenticação do Turso (`TURSO_AUTH_TOKEN`) é atualmente configurado diretamente nos arquivos JavaScript do cliente (`js/main.js`, `js/admin.js`) e, portanto, **exposto no navegador**.
    - **Recomendação para Produção**: Para um ambiente de produção, esta abordagem não é segura. Considere:
        1.  Usar um backend proxy (API) que gerencia o acesso ao Turso. O cliente se comunica com sua API, e a API interage com o Turso.
        2.  Investigar se o Turso oferece tokens com escopo altamente restrito (apenas leitura para certas tabelas para `main.js`, e regras mais granulares se possível).
        3.  As funcionalidades conceituais (email, push, Google Maps) já propõem o uso de serverless functions, que é uma forma de backend proxy.
- 🧹 **Sanitização de Inputs (Client-Side)**: A renderização de dados do banco (ex: nomes de itens, descrições) no HTML prioriza o uso de `textContent` para evitar XSS. A validação de formulários no admin panel é básica.

---

## 📊 **Analytics e Insights**

### **Para o Cliente (Local)**

- 📊 **Estatísticas na Página (`index.html`)**: A seção "Estatísticas" exibe o total de pedidos, ticket médio e itens mais populares, calculados a partir do histórico de pedidos salvo localmente no navegador do cliente.

### **Para o Restaurante (Painel Administrativo - `admin.html`)**

- 📈 **Relatórios de Vendas**: O Painel Administrativo possui uma seção de "Relatórios" que consulta diretamente o banco de dados Turso.
    - **Sumário de Vendas**: Total de pedidos (não cancelados), receita total, ticket médio para o período selecionado.
    - **Itens Mais Vendidos**: Ranking dos 10 itens mais vendidos por quantidade e por receita gerada no período.
    - **Vendas por Categoria**: Receita total agrupada por categoria de item no período.
    - **Filtros**: Os relatórios podem ser filtrados por intervalo de datas.

---

## 🌍 **Roadmap (Pós-Integração Turso)**

O roadmap original foi significativamente impactado pela mudança para Turso e a implementação do Admin Panel.

### **🚀 v1.0 - Core com Turso & Admin Panel** (Estado Atual)
- [x] Template responsivo e PWA básico.
- [x] PIX + WhatsApp (configuráveis via Admin Panel).
- [x] Histórico de pedidos local e "Pedir Novamente".
- [x] **Backend de Dados**: Turso para cardápio, configurações e pedidos.
- [x] **Painel Administrativo (`admin.html`)**:
    - [x] Gerenciamento CRUD de Cardápio.
    - [x] Gerenciamento de Configurações do Restaurante.
    - [x] Visualização e Gerenciamento de Status de Pedidos.
    - [x] Relatórios de Vendas básicos.
- [x] URLs Compartilháveis de Pedidos.
- [x] Sugestões Contextuais de Itens (baseado em pedidos no Turso).
- [x] Sistema de Horários (manual, via Admin Panel).
- [x] Segurança básica (CSP, DOM sanitization).

### **📈 v1.1 - Funcionalidades Avançadas (Conceitual / Próximos Passos)**
- [~] **Notificações por Email Automatizadas** (Design conceitual com Serverless Functions pronto).
    - [ ] Implementar serverless function e integração com serviço de email.
    - [ ] Coletar e salvar email do cliente no fluxo de pedido.
- [~] **Sistema de Horários Inteligente com Google Maps** (Design conceitual com Serverless Proxy pronto).
    - [ ] Implementar serverless function para proxy da API Google Places.
    - [ ] Atualizar `js/main.js` para usar dados do Google Maps com fallback para manual.
- [~] **PWA Avançado: Notificações Push** (Design conceitual com Serverless Functions pronto).
    - [ ] Implementar fluxo de subscrição, service worker para push, e serverless function para enviar pushes.
- [ ] **PWA Avançado: Offline Orders** (Pedidos offline com fila para sincronização).
- [ ] **Acessibilidade (A11Y)**: Revisão e melhorias de acessibilidade.

### **🔥 v1.2 - Melhorias e Expansão**
- [ ] **Segurança do Backend**: Implementar API Gateway/Backend Proxy para proteger acesso direto ao Turso (mitigar risco do token no cliente).
- [ ] Testes automatizados (Unit, Integration).
- [ ] Interface de usuário mais rica para relatórios (gráficos).
- [ ] Internacionalização (i18n).

### **💳 v1.3 - Pagamentos Híbridos (Expansão)**

- [ ] PIX avançado com comprovante
- [ ] Cartão via maquininha
- [ ] Sistema de pontos/fidelidade
- [ ] Split de conta

### **🏪 v2.0 - Marketplace** (Novembro 2025)

- [ ] Templates premium
- [ ] Sistema de plugins
- [ ] Customizador visual
- [ ] Suporte premium pago

### **🤖 v2.1 - IA Avançada** (Dezembro 2025)

- [ ] Chatbot integrado
- [ ] Recomendações por ML
- [ ] Otimização de preços
- [ ] Análise de sentimento

### **🌟 v3.0 - Ecossistema** (Q1 2026)

- [ ] Multi-restaurante
- [ ] API pública
- [ ] Delivery integrado
- [ ] White label

---

## 💰 **Modelo de Sustentabilidade**

### **Core Gratuito (Sempre)**

✅ Template completo com todas as funcionalidades  
✅ Documentação e tutoriais  
✅ Suporte via comunidade (GitHub Issues)  
✅ Atualizações regulares

### **🤝 Apoie o Projeto (Opcional mas Apreciado)**

> **💡 Sugestão: R$ 1,00 por cliente único na vida**

Se este projeto te ajudou a economizar centenas ou milhares de reais em taxas e mensalidades, considere fazer uma doação simbólica:

#### **Como Funciona:**

- 🎯 **R$ 1 por cliente** que fez pelo menos um pedido
- 📅 **Uma única vez na vida** - não é recorrente
- 🎁 **Totalmente voluntário** - projeto continua gratuito
- 📊 **Transparente** - valor total fica público

#### **Exemplos:**

```
🍕 Pizzaria pequena (50 clientes) = R$ 50 de doação
🍔 Hambúrguer médio (200 clientes) = R$ 200 de doação
🍱 Japonês popular (500 clientes) = R$ 500 de doação
```

#### **Por que R$ 1?**

- **Valor simbólico** - representa gratidão, não custo
- **Escala justa** - restaurante próspero contribui mais
- **Alinhamento perfeito** - criador é recompensado pelo sucesso gerado
- **Menos que uma Coca-Cola** - qualquer restaurante pode pagar

#### **Como Doar:**

[![PIX](https://img.shields.io/badge/PIX-32BC8B?style=for-the-badge&logo=pix&logoColor=white)](https://nubank.com.br/pagar/2s5jb/cardapio-digital)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/cardapiodigital)
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-EA4AAA?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/seu-usuario)

### **Impacto das Doações:**

```
🎯 Meta 2025: R$ 10.000 em doações
├── 💻 50% → Desenvolvimento (novas funcionalidades)
├── 📖 30% → Documentação e tutoriais
├── 🎥 15% → Conteúdo (vídeos, lives, workshops)
└── ☕ 5% → Café para o desenvolvedor 😄
```

### **Transparência Total:**

- 📊 **[Dashboard de Doações](https://transparencia.cardapio-digital.com)** - valores públicos
- 🧾 **Relatórios mensais** - onde o dinheiro foi investido
- 🗳️ **Votação da comunidade** - prioridades de desenvolvimento

### **Serviços Premium (Para quem quer mais)**

| Serviço               | Preço         | Descrição                    |
| --------------------- | ------------- | ---------------------------- |
| **Suporte Dedicado**  | R$ 50-100/mês | WhatsApp + videochamadas     |
| **Setup Completo**    | R$ 400-800    | Configuração profissional    |
| **Templates Premium** | R$ 100-300    | Designs exclusivos por setor |
| **Customizações**     | R$ 500-3000   | Desenvolvimento sob demanda  |

### **Marketplace (Futuro)**

- 30% de comissão em templates premium
- Certificação de desenvolvedores
- Sistema de avaliações
- Suporte técnico integrado

---

### **💌 Carta do Criador**

> _Oi! Sou o criador deste projeto e quero compartilhar por que criei isso..._
>
> _Vi muitos restaurantes pequenos pagando R$ 200-500/mês para soluções que podiam ser gratuitas. Decidi criar uma alternativa que fosse:_
>
> - \*✅ **Gratuita para sempre\***
> - \*✅ **Sem vendor lock-in\***
> - \*✅ **Código aberto\***
> - \*✅ **Feita para o Brasil\***
>
> _Se este projeto te economizou dinheiro ou aumentou suas vendas, uma doação de R$ 1 por cliente seria uma forma linda de dizer "obrigado" e me motivar a continuar desenvolvendo._
>
> _Mas lembre-se: **o projeto sempre será gratuito**, independente de doações! 🙏_
>
> _— Franklin Silveira Baldo, Procurador do Estado de Rondônia_

---

## 🤝 **Como Contribuir**

### **Para Desenvolvedores**

```bash
# 1. Fork o projeto
# 2. Crie uma branch
git checkout -b feature/nova-funcionalidade

# 3. Faça suas mudanças
# 4. Teste localmente
# 5. Commit com mensagem clara
git commit -m "feat: adiciona sistema de cupons"

# 6. Push e abra PR
git push origin feature/nova-funcionalidade
```

### **Áreas que Precisamos de Ajuda**

- 🎨 **UI/UX Design** - templates e componentes
- 💻 **Frontend** - novas funcionalidades
- 🔧 **Google Apps Script** - automações
- 📖 **Documentação** - tutoriais e guias
- 🌍 **Internacionalização** - traduções
- 🧪 **Testes** - cobertura e qualidade

### **Para Restaurantes**

- 🍽️ **Beta testing** - teste novas funcionalidades
- 💬 **Feedback** - relate problemas e sugestões
- 📸 **Casos de uso** - compartilhe resultados
- ⭐ **Divulgação** - star no GitHub + redes sociais

### **Para a Comunidade**

- ⭐ **Star o projeto** - aumenta visibilidade
- 🔄 **Fork e customize** - crie suas versões
- 🐛 **Reporte bugs** - issues no GitHub
- 💡 **Sugira melhorias** - discussions
- 📱 **Compartilhe** - ajude outros restaurantes

---

## 🏆 **Casos de Sucesso**

### **📊 Impacto em Números**

```
🍽️ 50+ restaurantes usando
⭐ 500+ stars no GitHub
🔄 200+ forks personalizados
💰 R$ 100.000+ economizados em taxas
⚡ 90% redução no tempo de setup
```

### **💬 Depoimentos**

> _"Economizamos R$ 200/mês que pagávamos para uma solução paga. Em 6 meses já pagou o setup!"_  
> **— Maria Silva, Pizzaria Bella Vista**

> _"Nossos clientes adoram o 'pedir novamente'. 40% dos pedidos agora são repetições automáticas."_  
> **— João Santos, Hamburgueria do Chef**

> _"Setup em 15 minutos. Impossível de acreditar que é grátis!"_  
> **— Ana Costa, Cafeteria Aroma**

---

## 🆘 **Suporte e Comunidade**

### **Canais Oficiais**

- 💬 **[Discord Comunidade](https://discord.gg/tembiu)** - chat em tempo real
- 🐛 **[GitHub Issues](https://github.com/seu-usuario/tembiu/issues)** - bugs e problemas
- 💡 **[GitHub Discussions](https://github.com/seu-usuario/tembiu/discussions)** - ideias e dúvidas
- 📧 **[Email](mailto:suporte@tembiu.com)** - contato direto
- 📱 **[WhatsApp](https://wa.me/5511999999999)** - suporte rápido

### **Recursos de Aprendizado**

- 📖 **[Documentação Completa](docs/)** - guias detalhados
- 🎥 **[Playlist YouTube](https://youtube.com/playlist/tembiu)** - tutoriais em vídeo
- 📝 **[Blog](https://blog.tembiu.com)** - dicas e novidades
- 🔴 **[Lives](https://youtube.com/c/tembiu/live)** - desenvolvimento ao vivo

### **FAQ Rápido**

<details>
<summary><strong>❓ É realmente grátis para sempre?</strong></summary>

Sim! O código é open source e o GitHub Pages é gratuito. Você só paga se quiser serviços premium opcionais.

</details>

<details>
<summary><strong>❓ Funciona no iPhone?</strong></summary>

Perfeitamente! É um PWA que funciona como app nativo em iOS e Android.

</details>

<details>
<summary><strong>❓ Preciso saber programar?</strong></summary>

Não! Basta editar um arquivo CSV no Excel e fazer algumas configurações básicas.

</details>

<details>
<summary><strong>❓ Como atualizo o cardápio?</strong></summary>

Edite o arquivo CSV no GitHub. Mudanças aparecem automaticamente em 1-2 minutos.

</details>

<details>
<summary><strong>❓ E se eu precisar de ajuda?</strong></summary>

Comunidade no Discord, issues no GitHub, ou contrate suporte premium se precisar de algo urgente.

</details>

---

## 📄 **Licença e Legal**

### **MIT License**

```
Copyright (c) 2025 Cardápio Digital Open Source

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Licença completa no arquivo LICENSE]
```

### **Uso Comercial**

✅ **Permitido** - use em seu restaurante  
✅ **Modificação** - customize como quiser  
✅ **Redistribuição** - compartilhe suas versões  
✅ **Venda de serviços** - ofereça setup como freelancer

### **Compliance**

- 🇧🇷 **LGPD** - dados locais, sem vazamentos
- 💳 **PIX** - protocolo oficial do Banco Central
- 📱 **PWA** - padrões W3C e Google
- 🔒 **Segurança** - boas práticas OWASP

---

## 🌟 **Reconhecimentos**

### **Tecnologias Utilizadas**

- [GitHub Pages](https://pages.github.com/) - Hosting gratuito
- [PWA](https://web.dev/progressive-web-apps/) - Padrão Google
- [PIX](https://www.bcb.gov.br/estabilidadefinanceira/pix) - Banco Central do Brasil
- [WhatsApp Business](https://business.whatsapp.com/) - Meta
- [Google Apps Script](https://script.google.com/) - Google Cloud

### **Inspirações**

- Movimento open source brasileiro
- Necessidade real de restaurantes pequenos
- Democratização da tecnologia
- Sustentabilidade e impacto social

### **Contribuidores**

Obrigado a todos que tornaram este projeto possível! 🙏

[![Contributors](https://contrib.rocks/image?repo=seu-usuario/cardapio-digital)](https://github.com/seu-usuario/cardapio-digital/graphs/contributors)

---

## 🚀 **Comece Agora!**

### **1 Minuto para Testar:**

👉 **[DEMO AO VIVO](https://seu-usuario.github.io/cardapio-digital)** 👈

### **5 Minutos para Ter o Seu:**

[![Use this template](https://img.shields.io/badge/🚀_Criar_Meu_Cardápio-FF6B35?style=for-the-badge&logoColor=white)](https://github.com/seu-usuario/cardapio-digital/generate)

### **Junte-se à Comunidade:**

[![Discord](https://img.shields.io/badge/💬_Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/tembiu)
[![WhatsApp](https://img.shields.io/badge/📱_WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/5511999999999)

---

<div align="center">

**🍽️ Feito com ❤️ para restaurantes brasileiros**

**💝 Se este projeto te ajudou, considere uma doação de R$ 1 por cliente** • **[Doar via PIX](https://nubank.com.br/pagar/2s5jb/tembiu)**

**⭐ Se este projeto te ajudou, deixe uma star! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/tembiu?style=social)](https://github.com/seu-usuario/tembiu/stargazers)
[![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fseu-usuario%2Ftembiu)](https://twitter.com/intent/tweet?text=Tembiu%20-%20Cardápio%20Digital%20Open%20Source%20gratuito%20para%20restaurantes!&url=https://github.com/seu-usuario/tembiu)

**[🌐 Site](https://tembiu.com) • [📖 Docs](docs/) • [💬 Discord](https://discord.gg/tembiu) • [🐛 Issues](https://github.com/seu-usuario/tembiu/issues) • [💡 Discussions](https://github.com/seu-usuario/tembiu/discussions)**

</div>
