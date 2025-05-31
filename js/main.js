console.log("Tembiu main.js loaded.");

// Client-side Restaurant Configuration (Placeholders)
const restaurantConfig = {
    name: "Tembiu Lanchonete Virtual",
    phone: "5511999999999", // Used as PIX key (telefone). Consider adding a dedicated 'pixKey' if different.
    cidade: "Porto Velho", // Placeholder city, configure as needed
};

let cart = []; // Initialize cart
let allMenuItems = []; // Store all menu items globally

// Global variables for views and steps
let menuView, checkoutView, orderHistoryView;
let orderSummaryStep, addressStep, paymentStep;
let currentView = 'menu-view'; // To keep track of the current visible view, default to menu

function showView(viewIdToShow, checkoutStepIdToShow = null) {
    // Hide all main views first
    if (menuView) menuView.style.display = 'none';
    if (checkoutView) checkoutView.style.display = 'none';
    if (orderHistoryView) orderHistoryView.style.display = 'none';

    // Manage checkout steps visibility - hide all initially
    if (orderSummaryStep) orderSummaryStep.style.display = 'none';
    if (addressStep) addressStep.style.display = 'none';
    if (paymentStep) paymentStep.style.display = 'none';

    let viewToDisplay = null;
    switch (viewIdToShow) {
        case 'menu-view':
            viewToDisplay = menuView;
            break;
        case 'checkout-view':
            viewToDisplay = checkoutView;
            if (checkoutView) { // Ensure checkoutView itself is valid
                // Determine which step to show within checkout
                switch (checkoutStepIdToShow) {
                    case 'order-summary-step':
                        if (orderSummaryStep) orderSummaryStep.style.display = 'block';
                        break;
                    case 'address-step':
                        if (addressStep) addressStep.style.display = 'block';
                        break;
                    case 'payment-step':
                        if (paymentStep) paymentStep.style.display = 'block';
                        break;
                    default: // Default to order summary if no specific/valid step
                        if (orderSummaryStep) orderSummaryStep.style.display = 'block';
                        checkoutStepIdToShow = 'order-summary-step'; // Update for logging
                        break;
                }
            }
            break;
        case 'order-history-view':
            viewToDisplay = orderHistoryView;
            break;
        default:
            console.error(`View with ID '${viewIdToShow}' not recognized.`);
            if (menuView) menuView.style.display = 'block'; // Fallback to menu view
            currentView = 'menu-view';
            const navItemsDefault = document.querySelectorAll('#bottom-nav .nav-item');
            navItemsDefault.forEach(navItem => {
                navItem.classList.remove('active');
                if (navItem.getAttribute('href').substring(1) === currentView) {
                    navItem.classList.add('active');
                }
            });
            return;
    }

    if (viewToDisplay) {
        viewToDisplay.style.display = 'block';
        currentView = viewIdToShow;
        console.log(`Switched to view: ${viewIdToShow}${checkoutStepIdToShow ? ', step: ' + checkoutStepIdToShow : ''}`);
        const bottomNavItems = document.querySelectorAll('#bottom-nav .nav-item');
        bottomNavItems.forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.getAttribute('href').substring(1) === viewIdToShow) {
                navItem.classList.add('active');
            }
        });
    } else {
        console.error(`Element for view ID '${viewIdToShow}' not found in DOM.`);
        if (menuView) menuView.style.display = 'block';
        currentView = 'menu-view';
        const navItemsFallback = document.querySelectorAll('#bottom-nav .nav-item');
        navItemsFallback.forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.getAttribute('href').substring(1) === currentView) {
                navItem.classList.add('active');
            }
        });
    }
}

function gerarPixCopiaECola({ chave, nome, cidade, valor = null, descricao = '', txid = '***' }) {
  function formatTag(tag, value) {
    const len = String(value.length).padStart(2, '0');
    return `${tag}${len}${value}`;
  }
  function crc16(payload) {
    let polinomio = 0x1021;
    let resultado = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      resultado ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        resultado = (resultado << 1) ^ ((resultado & 0x8000) ? polinomio : 0);
        resultado &= 0xFFFF;
      }
    }
    return resultado.toString(16).toUpperCase().padStart(4, '0');
  }
  const gui = formatTag('00', 'BR.GOV.BCB.PIX');
  const chavePix = formatTag('01', chave);
  const infoAdicional = descricao ? formatTag('02', descricao) : '';
  const merchantAccountInfo = formatTag('26', gui + chavePix + infoAdicional);
  const payloadSemCRC =
    formatTag('00', '01') +
    formatTag('01', '12') +
    merchantAccountInfo +
    formatTag('52', '0000') +
    formatTag('53', '986') +
    (valor ? formatTag('54', String(valor)) : '') +
    formatTag('58', 'BR') +
    formatTag('59', nome.substring(0, 25)) +
    formatTag('60', cidade.substring(0, 15)) +
    formatTag('62', formatTag('05', txid)) +
    '6304';
  const crc = crc16(payloadSemCRC);
  return payloadSemCRC + crc;
}

document.addEventListener('DOMContentLoaded', () => {
    menuView = document.getElementById('menu-view');
    checkoutView = document.getElementById('checkout-view');
    orderHistoryView = document.getElementById('order-history-view');
    orderSummaryStep = document.getElementById('order-summary-step');
    addressStep = document.getElementById('address-step');
    paymentStep = document.getElementById('payment-step');

    showView('menu-view');

    const bottomNav = document.getElementById('bottom-nav');
    const navItems = bottomNav ? bottomNav.querySelectorAll('.nav-item') : [];
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const targetViewId = item.getAttribute('href').substring(1);
            if (targetViewId === 'checkout-view') {
                showView('checkout-view', 'order-summary-step');
            } else {
                showView(targetViewId);
            }
        });
    });

    try {
        const headerTitle = document.querySelector('#logo-container h1');
        if (headerTitle && restaurantConfig.name) headerTitle.textContent = restaurantConfig.name;
        else console.warn("Header title or config name not found.");
    } catch (e) { console.error("Error setting restaurant name:", e); }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered:', reg.scope))
            .catch(err => console.error('SW registration failed:', err));
    }

    loadMenu(); 
    loadOrderHistory(); 
    updateCartDisplay();

    const confirmPaymentButton = document.getElementById('confirm-payment-button');
    if (confirmPaymentButton) confirmPaymentButton.addEventListener('click', handleConfirmPayment);
    const whatsappShareButton = document.getElementById('whatsapp-share-button');
    if (whatsappShareButton) whatsappShareButton.addEventListener('click', handleWhatsAppShare);
    const saveAddressButton = document.getElementById('save-address-button');
    if (saveAddressButton) saveAddressButton.addEventListener('click', handleSaveAddress);

    const menuSearchInput = document.getElementById('menu-search');
    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', () => { // Removed event param as it's not used for now
            applyFiltersAndRender(); // Call the new filter function
        });
    }
    const categoryFilterButtons = document.querySelectorAll('.category-filter');
    if (categoryFilterButtons) {
        categoryFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryFilterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                applyFiltersAndRender(); // Call the new filter function
            });
        });
    }
});

async function loadMenu() {
    const menuItemsListContainer = document.getElementById('menu-items-list');
    try {
        const response = await fetch('menu.csv');
        if (!response.ok) {
            console.error('Failed to load menu.csv:', response.statusText);
            if(menuItemsListContainer) menuItemsListContainer.innerHTML = '<p class="empty-menu-message">Erro ao carregar o cardápio. Tente novamente mais tarde.</p>';
            return;
        }
        const csvData = await response.text();
        const parsedItems = parseCSV(csvData);
        allMenuItems = parsedItems;
        console.log("All Menu Items Loaded:", allMenuItems);
        applyFiltersAndRender(); // Initial render after loading all items and applying default filters
    } catch (error) {
        console.error('Error fetching or parsing menu.csv:', error);
        if(menuItemsListContainer) menuItemsListContainer.innerHTML = '<p class="empty-menu-message">Ocorreu um erro inesperado ao carregar o cardápio.</p>';
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',');
    const items = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const item = {};
            headers.forEach((header, index) => item[header.trim()] = values[index].trim());
            item.preco = parseFloat(item.preco); 
            items.push(item);
        } else {
            console.warn(`Skipping malformed CSV line: ${lines[i]}`);
        }
    }
    return items;
}

function applyFiltersAndRender() {
    const searchInput = document.getElementById('menu-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const activeCategoryFilter = document.querySelector('.category-filter.active');
    const activeCategory = activeCategoryFilter ? activeCategoryFilter.textContent.trim() : 'Todos';

    let filteredItems = [...allMenuItems];

    // Filter by Availability first
    filteredItems = filteredItems.filter(item =>
        typeof item.disponivel === 'string' && item.disponivel.toLowerCase() === 'true'
    );

    // Filter by Category
    if (activeCategory && activeCategory !== 'Todos') {
        filteredItems = filteredItems.filter(item => item.categoria.toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter by Search Term (name or description)
    if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
            (item.nome && item.nome.toLowerCase().includes(searchTerm)) ||
            (item.descricao && item.descricao.toLowerCase().includes(searchTerm))
        );
    }

    renderMenuItems(filteredItems);
}

function renderMenuItems(itemsToRender) { // itemsToRender should be pre-filtered (including by availability)
    const menuItemsListContainer = document.getElementById('menu-items-list');
    if (!menuItemsListContainer) {
        console.error("Menu items list container ('menu-items-list') not found.");
        return;
    }
    menuItemsListContainer.innerHTML = ''; // Clear previous items

    if (!itemsToRender || itemsToRender.length === 0) {
        menuItemsListContainer.innerHTML = '<p class="empty-menu-message">Nenhum item encontrado com os critérios selecionados.</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.classList.add('menu-items-grid');

    itemsToRender.forEach(item => {
        // The 'disponivel' check is now primarily handled in applyFiltersAndRender
        const li = document.createElement('li');
        li.classList.add('menu-item-card');

        const itemDetails = document.createElement('div');
        itemDetails.classList.add('menu-item-details');
        itemDetails.innerHTML = `
            <h3 class="menu-item-name">${item.emoji || '🍽️'} ${item.nome}</h3>
            <p class="menu-item-description">${item.descricao || ''}</p>
            <p class="menu-item-category">Categoria: ${item.categoria}</p>
            <p class="menu-item-price">R$ ${item.preco.toFixed(2)}</p>
        `;
        li.appendChild(itemDetails);

        const itemActions = document.createElement('div');
        itemActions.classList.add('menu-item-actions');
        const addButton = document.createElement('button');
        addButton.classList.add('btn', 'btn-primary', 'add-to-cart-btn');
        addButton.textContent = 'Adicionar';
        addButton.addEventListener('click', () => addItemToCart(item));
        itemActions.appendChild(addButton);
        li.appendChild(itemActions);

        ul.appendChild(li);
    });
    menuItemsListContainer.appendChild(ul);
}


function addItemToCart(itemFromMenu) {
    const existingItem = cart.find(cartItem => cartItem.nome === itemFromMenu.nome);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...itemFromMenu, quantity: 1 });
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const toAddressStepButton = document.getElementById('to-address-step-button');
    const headerCartBadge = document.querySelector('#header-cart-icon .cart-badge');
    const navCartBadge = document.querySelector('#bottom-nav .cart-badge-nav');

    if (!cartItemsContainer || !cartTotalElement) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (headerCartBadge) {
        headerCartBadge.textContent = totalItems;
        headerCartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
    if (navCartBadge) {
        navCartBadge.textContent = totalItems;
        navCartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Sua sacola está vazia. Que tal adicionar algo delicioso do cardápio?</p>';
        cartTotalElement.textContent = '0.00';
        if (toAddressStepButton) toAddressStepButton.style.display = 'none';
    } else {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `<span>${item.quantity}x ${item.nome} - R$ ${(item.preco * item.quantity).toFixed(2)}</span>`;
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-from-cart-btn');
            removeButton.textContent = 'Remover';
            removeButton.setAttribute('data-item-name', item.nome);
            removeButton.addEventListener('click', () => handleRemoveItemFromCart(item.nome));
            div.appendChild(removeButton);
            cartItemsContainer.appendChild(div);
            total += item.preco * item.quantity;
        });
        cartTotalElement.textContent = total.toFixed(2);
        if (toAddressStepButton) toAddressStepButton.style.display = 'block';
    }
}

function handleRemoveItemFromCart(itemName) {
    const itemIndex = cart.findIndex(cartItem => cartItem.nome === itemName);
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) cart[itemIndex].quantity -= 1;
        else cart.splice(itemIndex, 1);
    }
    updateCartDisplay();
}

function handleSaveAddress(event) {
    if (event) event.preventDefault();
    const street = document.getElementById('street').value.trim();
    const number = document.getElementById('number').value.trim();
    const complement = document.getElementById('complement').value.trim();
    const neighborhood = document.getElementById('neighborhood').value.trim();
    const city = document.getElementById('city').value.trim();
    const cep = document.getElementById('cep').value.trim();

    if (!street || !number || !neighborhood || !city || !cep) {
        alert('Por favor, preencha todos os campos obrigatórios do endereço.');
        return;
    }
    const address = { street, number, complement, neighborhood, city, cep };
    try {
        localStorage.setItem('customerAddress', JSON.stringify(address));
        console.log("Address saved:", address);
        handleCheckout();
    } catch (e) {
        console.error("Error saving address:", e);
        alert('Houve um erro ao salvar o endereço.');
    }
}

async function sendOrderToBackend(orderData) {
    const backendUrl = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
    if (backendUrl === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        console.warn("Placeholder backend URL.");
        return { status: "simulated_success", message: "Order logged (simulated)." };
    }
    try {
        const response = await fetch(backendUrl, {
            method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(orderData)
        });
        if (!response.ok) throw new Error(`Backend error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error sending to backend:", error);
        throw error;
    }
}

function handleConfirmPayment() {
    if (cart.length === 0) { alert("Nenhum item no carrinho."); return; }
    const confirmedOrderItems = cart.map(item => ({ ...item })); 
    saveOrderToHistory(confirmedOrderItems);
    let deliveryAddress = null;
    const storedAddressJson = localStorage.getItem('customerAddress');
    if (storedAddressJson) {
        try { deliveryAddress = JSON.parse(storedAddressJson); }
        catch (e) { console.error("Error parsing address for backend:", e); }
    }
    const orderPayload = {
        orderId: "TEMBIU-WEB-" + Date.now(), items: confirmedOrderItems,
        customerName: "", customerPhone: "", deliveryAddress: deliveryAddress
    };
    sendOrderToBackend(orderPayload)
        .then(res => console.log("Backend response:", res.message))
        .catch(err => console.error("Backend send failed:", err.message));
    alert("Pagamento confirmado (simulação)! Obrigado pelo seu pedido.");
    showView('menu-view');
    cart = [];
    updateCartDisplay(); 
    loadOrderHistory(); 
}

function saveOrderToHistory(currentCartItems) {
    const MAX_HISTORY_ITEMS = 5; 
    let history = JSON.parse(localStorage.getItem('tembiuOrderHistory')) || [];
    const newOrder = {
        id: "ORD-" + Date.now(), timestamp: new Date().toLocaleString('pt-BR'),
        items: currentCartItems.map(item => ({ ...item }))
    };
    history.unshift(newOrder); 
    if (history.length > MAX_HISTORY_ITEMS) history = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem('tembiuOrderHistory', JSON.stringify(history));
}

function loadOrderHistory() {
    const history = JSON.parse(localStorage.getItem('tembiuOrderHistory')) || [];
    const pastOrdersList = document.getElementById('past-orders-list');
    if (!pastOrdersList) return;
    if (history.length === 0) {
        pastOrdersList.innerHTML = '<p>Você ainda não tem pedidos no seu histórico. Faça seu primeiro pedido!</p>';
        return;
    }
    pastOrdersList.innerHTML = ''; 
    history.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('past-order');
        const title = document.createElement('h3');
        title.textContent = `Pedido de ${order.timestamp} (ID: ${order.id})`;
        orderDiv.appendChild(title);
        const ul = document.createElement('ul');
        let orderTotal = 0;
        order.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.quantity}x ${item.nome} - R$ ${(item.preco * item.quantity).toFixed(2)}`;
            ul.appendChild(li);
            orderTotal += item.preco * item.quantity;
        });
        orderDiv.appendChild(ul);
        const totalP = document.createElement('p');
        totalP.innerHTML = `<strong>Total do Pedido: R$ ${orderTotal.toFixed(2)}</strong>`;
        orderDiv.appendChild(totalP);
        const orderAgainButton = document.createElement('button');
        orderAgainButton.classList.add('btn', 'btn-secondary', 'order-again-btn');
        orderAgainButton.textContent = 'Pedir Novamente';
        orderAgainButton.addEventListener('click', () => handleOrderAgain(order.items)); 
        orderDiv.appendChild(orderAgainButton);
        pastOrdersList.appendChild(orderDiv);
    });
}

function handleOrderAgain(orderItemsFromHistory) { 
    cart = []; 
    orderItemsFromHistory.forEach(itemFromHistory => {
        const quantity = itemFromHistory.quantity || 1; 
        for (let i = 0; i < quantity; i++) {
            const baseItem = { ...itemFromHistory };
            delete baseItem.quantity; 
            addItemToCart(baseItem);
        }
    });
    updateCartDisplay(); 
    alert("Itens do seu pedido anterior foram adicionados ao seu carrinho!");
    showView('checkout-view', 'order-summary-step');
}

function formatCartForWhatsApp(cartArray) {
    let addressString = "Endereço de entrega não informado.";
    const storedAddressJson = localStorage.getItem('customerAddress');
    if (storedAddressJson) {
        try {
            const ca = JSON.parse(storedAddressJson);
            addressString = `Logradouro: ${ca.street}, Número: ${ca.number}`;
            if (ca.complement) addressString += `, Complemento: ${ca.complement}`;
            addressString += `\nBairro: ${ca.neighborhood}\nCidade: ${ca.city}, CEP: ${ca.cep}`;
        } catch (e) { addressString = "Erro ao ler endereço salvo."; }
    }
    if (!cartArray || cartArray.length === 0) return "Seu carrinho está vazio!";
    let message = `Olá ${restaurantConfig.name}! Gostaria de fazer o seguinte pedido:\n\n`;
    let total = 0;
    cartArray.forEach(item => { 
        message += `- ${item.quantity}x ${item.nome} (R$ ${(item.preco * item.quantity).toFixed(2)})\n`;
        total += item.preco * item.quantity;
    });
    message += `\nTotal do Pedido: R$ ${total.toFixed(2)}\n\nEndereço de Entrega:\n${addressString}`;
    return message;
}

function handleWhatsAppShare() {
    if (cart.length === 0) { alert("Seu carrinho está vazio."); return; }
    const orderMessage = formatCartForWhatsApp(cart); 
    window.open(`https://wa.me/${restaurantConfig.phone}?text=${encodeURIComponent(orderMessage)}`, '_blank');
}

function generateAndDisplayPix(orderId, totalAmount) {
    const pixParams = {
        chave: restaurantConfig.phone,
        nome: restaurantConfig.name,
        cidade: restaurantConfig.cidade,
        valor: totalAmount.toFixed(2),
        txid: orderId,
        descricao: `Pedido ${orderId}`
    };
    const pixDataString = gerarPixCopiaECola(pixParams);
    const pixQrCodeElement = document.getElementById('pix-qr-code');
    const pixCopyPasteElement = document.getElementById('pix-copy-paste-code');
    if (pixQrCodeElement) {
        pixQrCodeElement.innerHTML = ''; 
        try {
            new QRCode(pixQrCodeElement, { text: pixDataString, width: 200, height: 200, colorDark : "#000000", colorLight : "#ffffff", correctLevel : QRCode.CorrectLevel.H });
            pixQrCodeElement.title = pixDataString; 
        } catch (e) {
            pixQrCodeElement.textContent = "[Erro ao gerar QR Code]";
            console.error("Error generating QR Code:", e);
        }
    }
    if (pixCopyPasteElement) pixCopyPasteElement.textContent = pixDataString;
    console.log("PIX Data String for Order:", orderId, "PIX String:", pixDataString);
}

function handleCheckout() {
    const storedAddressJson = localStorage.getItem('customerAddress');
    if (!storedAddressJson) {
        alert("Por favor, salve seu endereço de entrega antes de prosseguir para o pagamento.");
        showView('checkout-view', 'address-step');
        return;
    }

    if (cart.length === 0) {
        alert("Sua sacola está vazia. Adicione itens antes de finalizar o pedido.");
        showView('menu-view');
        return;
    }
    const orderId = "TEMBIU-WEB-" + Date.now();
    let totalAmount = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);

    console.log("Proceeding to PIX generation for Order ID:", orderId, "Total:", totalAmount.toFixed(2));
    generateAndDisplayPix(orderId, totalAmount);
    showView('checkout-view', 'payment-step');
}
