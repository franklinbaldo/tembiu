console.log("Tembiu main.js loaded.");

// Client-side Restaurant Configuration (Placeholders)
const restaurantConfig = {
    name: "Tembiu Lanchonete Virtual",
    phone: "5511999999999", // Used as PIX key (telefone). Consider adding a dedicated 'pixKey' if different.
    cidade: "Porto Velho", // Placeholder city, configure as needed
};

let cart = []; // Initialize cart

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
            // Update nav for fallback
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

        // Update active state in bottom navigation
        const bottomNavItems = document.querySelectorAll('#bottom-nav .nav-item');
        bottomNavItems.forEach(navItem => {
            navItem.classList.remove('active');
            // Check against viewIdToShow because checkout steps are all under 'checkout-view' for nav purposes
            if (navItem.getAttribute('href').substring(1) === viewIdToShow) {
                navItem.classList.add('active');
            }
        });

    } else {
        console.error(`Element for view ID '${viewIdToShow}' not found in DOM.`);
        if (menuView) menuView.style.display = 'block'; // Fallback safely
        currentView = 'menu-view';
         // Update nav for fallback
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
    formatTag('01', '12') + // Point of Initiation Method: 12 for static QR
    merchantAccountInfo +
    formatTag('52', '0000') + // Merchant Category Code
    formatTag('53', '986') +  // Currency Code (BRL)
    (valor ? formatTag('54', String(valor)) : '') + // Transaction Amount - ensure string
    formatTag('58', 'BR') + // Country Code
    formatTag('59', nome.substring(0, 25)) + // Merchant Name (max 25 chars)
    formatTag('60', cidade.substring(0, 15)) + // Merchant City (max 15 chars)
    formatTag('62', formatTag('05', txid)) + // Transaction ID (txid)
    '6304'; // CRC16 tag and length placeholder

  const crc = crc16(payloadSemCRC);
  return payloadSemCRC + crc;
}

document.addEventListener('DOMContentLoaded', () => {
    // Assign view and step elements
    menuView = document.getElementById('menu-view');
    checkoutView = document.getElementById('checkout-view');
    orderHistoryView = document.getElementById('order-history-view');

    orderSummaryStep = document.getElementById('order-summary-step');
    addressStep = document.getElementById('address-step');
    paymentStep = document.getElementById('payment-step');

    // Set initial view
    showView('menu-view');

    // Bottom Navigation Logic
    const bottomNav = document.getElementById('bottom-nav');
    const navItems = bottomNav ? bottomNav.querySelectorAll('.nav-item') : [];

    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            const targetViewId = item.getAttribute('href').substring(1);

            if (targetViewId === 'checkout-view') {
                showView('checkout-view', 'order-summary-step');
            } else {
                showView(targetViewId);
            }
            // Active class is handled by showView now
        });
    });

    // Display Restaurant Name in Header
    try {
        const headerTitle = document.querySelector('#logo-container h1');
        if (headerTitle && restaurantConfig && restaurantConfig.name) {
            headerTitle.textContent = restaurantConfig.name;
        } else {
            console.warn("Header title element (#logo-container h1) or restaurant name in config not found.");
        }
    } catch (e) {
        console.error("Error setting restaurant name in header:", e);
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('Service Worker registered with scope:', registration.scope))
            .catch(error => console.error('Service Worker registration failed:', error));
    }

    loadMenu(); 
    loadOrderHistory(); 
    updateCartDisplay(); // Initial cart display update for badges

    const confirmPaymentButton = document.getElementById('confirm-payment-button');
    if (confirmPaymentButton) confirmPaymentButton.addEventListener('click', handleConfirmPayment);

    const whatsappShareButton = document.getElementById('whatsapp-share-button');
    if (whatsappShareButton) whatsappShareButton.addEventListener('click', handleWhatsAppShare);

    const saveAddressButton = document.getElementById('save-address-button');
    if (saveAddressButton) saveAddressButton.addEventListener('click', handleSaveAddress);

    // Placeholder Event Listener for Menu Search
    const menuSearchInput = document.getElementById('menu-search');
    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', (event) => {
            console.log(`Search term: ${event.target.value}`);
            // Future: Call a function to filter menu items based on event.target.value
        });
    }

    // Placeholder Event Listeners for Category Filters
    const categoryFilterButtons = document.querySelectorAll('.category-filter');
    if (categoryFilterButtons) {
        categoryFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryFilterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                console.log(`Category filter selected: ${button.textContent}`);
                // Future: Call a function to filter menu items based on button.textContent or a data-attribute
            });
        });
    }

    // Ensure initial view is set after all essential listeners are potentially set up, though showView itself is robust.
    // showView('menu-view'); // This is already called earlier, which is fine.
});

async function loadMenu() {
    const menuItemsListContainer = document.getElementById('menu-items-list');
    try {
        const response = await fetch('menu.csv');
        if (!response.ok) {
            console.error('Failed to load menu.csv:', response.statusText);
            if(menuItemsListContainer) menuItemsListContainer.innerHTML = '<p>Erro ao carregar o cardápio. Tente novamente mais tarde.</p>';
            return;
        }
        const csvData = await response.text();
        const menuItems = parseCSV(csvData);
        renderMenuItems(menuItems);
    } catch (error) {
        console.error('Error fetching or parsing menu.csv:', error);
        if(menuItemsListContainer) menuItemsListContainer.innerHTML = '<p>Ocorreu um erro inesperado ao carregar o cardápio.</p>';
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

function renderMenuItems(menuItems) {
    const menuItemsListContainer = document.getElementById('menu-items-list');
    if (!menuItemsListContainer) {
        console.error("Menu items list container ('menu-items-list') not found.");
        return;
    }
    if (menuItems.length > 0) {
        menuItemsListContainer.innerHTML = '';
        const ul = document.createElement('ul');
        ul.classList.add('menu-items-grid'); // Optional: for grid styling if ul is the container

        menuItems.forEach(item => {
            const isAvailable = typeof item.disponivel === 'string' && item.disponivel.toLowerCase() === 'true';
            if (isAvailable) { 
                const li = document.createElement('li');
                li.classList.add('menu-item-card');

                // Optional Image/Emoji Container
                // const itemImageContainer = document.createElement('div');
                // itemImageContainer.classList.add('menu-item-image-container');
                // itemImageContainer.innerHTML = `<span class="menu-item-emoji">${item.emoji || '🍽️'}</span>`;
                // li.appendChild(itemImageContainer);

                const itemDetails = document.createElement('div');
                itemDetails.classList.add('menu-item-details');
                itemDetails.innerHTML = `
                    <h3 class="menu-item-name">${item.emoji || ''} ${item.nome}</h3>
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
                addButton.addEventListener('click', () => {
                    addItemToCart(item);
                });
                itemActions.appendChild(addButton);
                li.appendChild(itemActions);

                ul.appendChild(li);
            }
        });
        menuItemsListContainer.appendChild(ul);
    } else {
        menuItemsListContainer.innerHTML = '<p>Nenhum item disponível no cardápio.</p>';
    }
}

function addItemToCart(itemFromMenu) {
    const existingItem = cart.find(cartItem => cartItem.nome === itemFromMenu.nome);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...itemFromMenu, quantity: 1 });
    console.log(`${itemFromMenu.nome} processed for cart:`, cart);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const toAddressStepButton = document.getElementById('to-address-step-button');
    const headerCartBadge = document.querySelector('#header-cart-icon .cart-badge');
    const navCartBadge = document.querySelector('#bottom-nav .cart-badge-nav');

    if (!cartItemsContainer || !cartTotalElement) {
        console.error("Cart items container or cart total element not found.");
        return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (headerCartBadge) {
        headerCartBadge.textContent = totalItems;
        headerCartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none'; // Use inline-block for better layout
    }
    if (navCartBadge) {
        navCartBadge.textContent = totalItems;
        navCartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none'; // Use inline-block
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
            const itemDetails = document.createElement('span');
            const itemSubtotal = item.preco * item.quantity;
            itemDetails.textContent = `${item.quantity}x ${item.nome} - R$ ${itemSubtotal.toFixed(2)}`;
            div.appendChild(itemDetails);
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-from-cart-btn');
            removeButton.textContent = 'Remover';
            removeButton.setAttribute('data-item-name', item.nome);
            removeButton.addEventListener('click', () => handleRemoveItemFromCart(item.nome));
            div.appendChild(removeButton);
            cartItemsContainer.appendChild(div);
            total += itemSubtotal;
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
    } else console.warn("Item to remove not found in cart:", itemName);
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
        alert('Por favor, preencha todos os campos obrigatórios do endereço (Logradouro, Número, Bairro, Cidade, CEP).');
        return;
    }
    const address = { street, number, complement, neighborhood, city, cep };
    try {
        localStorage.setItem('customerAddress', JSON.stringify(address));
        console.log("Address saved to localStorage:", address);
        alert('Endereço salvo com sucesso! Você pode prosseguir para finalizar o pedido.');
        // Navigation to payment step will be handled by the "Continuar para Pagamento" button's own listener
    } catch (e) {
        console.error("Error saving address to localStorage:", e);
        alert('Houve um erro ao salvar o endereço. Por favor, tente novamente.');
    }
}

async function sendOrderToBackend(orderData) {
    const backendUrl = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
    if (backendUrl === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        console.warn("Placeholder backend URL. Order not sent.");
        return Promise.resolve({ status: "simulated_success", message: "Order logged (simulated)." });
    }
    try {
        const response = await fetch(backendUrl, {
            method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(orderData)
        });
        if (!response.ok) throw new Error(`Backend error: ${response.status} ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Error sending to backend:", error);
        throw error; // Re-throw for caller to handle
    }
}

function handleConfirmPayment() {
    if (cart.length === 0) {
        alert("Nenhum item no carrinho para confirmar o pagamento.");
        return;
    }
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
    alert("Pagamento confirmado (simulação)! Obrigado pelo seu pedido. Seu pedido foi salvo localmente.");
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
        const title = document.createElement('h3'); // Changed from direct innerHTML
        title.textContent = `Pedido de ${order.timestamp} (ID: ${order.id})`;
        orderDiv.appendChild(title);

        const ul = document.createElement('ul');
        let orderTotal = 0;
        order.items.forEach(item => {
            const li = document.createElement('li');
            const itemSubtotal = item.preco * item.quantity;
            li.textContent = `${item.quantity}x ${item.nome} - R$ ${itemSubtotal.toFixed(2)}`;
            ul.appendChild(li);
            orderTotal += itemSubtotal;
        });
        orderDiv.appendChild(ul);
        
        const totalP = document.createElement('p'); // Changed from direct innerHTML
        totalP.innerHTML = `<strong>Total do Pedido: R$ ${orderTotal.toFixed(2)}</strong>`;
        orderDiv.appendChild(totalP);

        const orderAgainButton = document.createElement('button');
        orderAgainButton.classList.add('btn', 'btn-secondary', 'order-again-btn'); // Already has new classes
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
    if (cart.length === 0) {
        alert("Seu carrinho está vazio. Adicione itens antes de compartilhar."); return;
    }
    const orderMessage = formatCartForWhatsApp(cart); 
    window.open(`https://wa.me/${restaurantConfig.phone}?text=${encodeURIComponent(orderMessage)}`, '_blank');
}

function handleCheckout() {
    const storedAddressJson = localStorage.getItem('customerAddress');
    let customerAddress = null;
    if (storedAddressJson) {
        try { customerAddress = JSON.parse(storedAddressJson); }
        catch (e) {
            alert("Erro ao ler o endereço salvo. Por favor, salve-o novamente.");
            showView('checkout-view', 'address-step'); return;
        }
    }
    if (!customerAddress) {
        alert("Por favor, confirme seu endereço de entrega antes de finalizar o pedido.");
        showView('checkout-view', 'address-step'); return;
    }
    if (cart.length === 0) {
        alert("Sua sacola está vazia. Adicione itens antes de finalizar o pedido.");
        showView('menu-view'); return;
    }
    const orderId = "TEMBIU-WEB-" + Date.now();
    let totalAmount = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
    const pixParams = {
        chave: restaurantConfig.phone, nome: restaurantConfig.name, cidade: restaurantConfig.cidade,
        valor: totalAmount.toFixed(2), txid: orderId, descricao: "Pedido " + orderId
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
    showView('checkout-view', 'payment-step');
    console.log("Displaying PIX info for order:", orderId, "PIX String:", pixDataString);
}
