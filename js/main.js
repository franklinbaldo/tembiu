console.log("Tembiu main.js loaded.");

let cart = []; // Initialize cart

document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
    loadMenu(); // Call loadMenu to render items
    loadOrderHistory(); // Load order history on page load

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }

    const confirmPaymentButton = document.getElementById('confirm-payment-button');
    if (confirmPaymentButton) {
        confirmPaymentButton.addEventListener('click', handleConfirmPayment);
    }

    const whatsappShareButton = document.getElementById('whatsapp-share-button');
    if (whatsappShareButton) {
        whatsappShareButton.addEventListener('click', handleWhatsAppShare);
    }
});

async function loadMenu() {
    try {
        const response = await fetch('menu.csv');
        if (!response.ok) {
            console.error('Failed to load menu.csv:', response.statusText);
            document.getElementById('menu-container').innerHTML = '<p>Erro ao carregar o cardápio. Tente novamente mais tarde.</p>';
            return;
        }
        const csvData = await response.text();
        const menuItems = parseCSV(csvData);
        
        console.log("Menu Items Loaded:", menuItems);
        renderMenuItems(menuItems);

    } catch (error) {
        console.error('Error fetching or parsing menu.csv:', error);
        document.getElementById('menu-container').innerHTML = '<p>Ocorreu um erro inesperado ao carregar o cardápio.</p>';
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        console.warn("CSV has no data rows.");
        return [];
    }
    
    const headers = lines[0].split(',');
    const items = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const item = {};
            headers.forEach((header, index) => {
                item[header.trim()] = values[index].trim();
            });
            item.preco = parseFloat(item.preco); 
            items.push(item);
        } else {
            console.warn(`Skipping malformed CSV line: ${lines[i]}`);
        }
    }
    return items;
}

function renderMenuItems(menuItems) {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    if (menuItems.length > 0) {
        menuContainer.innerHTML = ''; 
        const ul = document.createElement('ul');
        menuItems.forEach(item => {
            if (item.disponivel && item.disponivel.toLowerCase() === 'true') { 
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.emoji || '🍽️'} ${item.nome} (${item.categoria}) - R$ ${item.preco.toFixed(2)}</span>
                    <button class="add-to-cart-btn">Adicionar</button>
                `;
                li.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                    addItemToCart(item);
                });
                ul.appendChild(li);
            }
        });
        menuContainer.appendChild(ul);
    } else {
        menuContainer.innerHTML = '<p>Nenhum item disponível no cardápio.</p>';
    }
}

function addItemToCart(item) {
    const cartItem = { ...item, cartItemId: Date.now() }; 
    cart.push(cartItem);
    console.log(`${item.nome} added to cart:`, cart);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    if (!cartItemsContainer || !cartTotalElement || !checkoutButton) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        cartTotalElement.textContent = '0.00';
        checkoutButton.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = ''; 
    let total = 0;

    cart.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`; 
        cartItemsContainer.appendChild(div);
        total += item.preco;
    });

    cartTotalElement.textContent = total.toFixed(2);
    checkoutButton.style.display = 'block';
}

function handleCheckout() {
    console.log("Checkout initiated. Cart contents:", cart);

    if (cart.length === 0) {
        alert("Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.");
        return;
    }

    const orderId = "TEMBIU-" + Date.now();
    const totalAmount = cart.reduce((sum, item) => sum + item.preco, 0);
    const placeholderPixQRCode = `QRCODE_PLACEHOLDER_FOR_ORDER_${orderId}_AMOUNT_${totalAmount.toFixed(2)}`;
    const placeholderPixCopyPaste = `PIX_COPIA_COLA_PLACEHOLDER_FOR_ORDER_${orderId}_AMOUNT_${totalAmount.toFixed(2)}`;

    const pixQrCodeElement = document.getElementById('pix-qr-code');
    const pixCopyPasteElement = document.getElementById('pix-copy-paste-code');
    if (pixQrCodeElement) pixQrCodeElement.textContent = placeholderPixQRCode;
    if (pixCopyPasteElement) pixCopyPasteElement.textContent = placeholderPixCopyPaste;

    const pixDisplayContainer = document.getElementById('pix-display-container');
    const cartContainer = document.getElementById('cart-container');

    if (pixDisplayContainer) pixDisplayContainer.style.display = 'block';
    if (cartContainer) cartContainer.style.display = 'none'; 
    
    console.log("Displaying placeholder PIX information for order:", orderId);
}

function formatCartForWhatsApp(cartArray) {
    if (!cartArray || cartArray.length === 0) {
        return "Seu carrinho está vazio!";
    }

    let message = "Olá! Gostaria de fazer o seguinte pedido:\n";
    let total = 0;

    cartArray.forEach(item => {
        message += `- ${item.nome} (R$ ${item.preco.toFixed(2)})\n`;
        total += item.preco;
    });

    message += `\nTotal do Pedido: R$ ${total.toFixed(2)}`;
    return message;
}

function handleWhatsAppShare() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio. Adicione itens antes de compartilhar.");
        return;
    }

    const orderMessage = formatCartForWhatsApp(cart);
    console.log("Formatted WhatsApp Message:", orderMessage);
    
    alert("Simulando compartilhamento no WhatsApp:\n\n" + orderMessage);
}

function handleConfirmPayment() {
    if (cart.length === 0) {
        alert("Nenhum item no carrinho para confirmar o pagamento.");
        // Though checkout button should ideally not be visible if cart is empty
        return;
    }
    console.log("Payment confirmed (simulated). Order details:", cart);
    
    // Save order to history
    saveOrderToHistory(cart);

    alert("Pagamento confirmado (simulação)! Obrigado pelo seu pedido.");

    const pixDisplayContainer = document.getElementById('pix-display-container');
    if (pixDisplayContainer) pixDisplayContainer.style.display = 'none';
    
    // Clear the current cart
    cart = [];
    updateCartDisplay(); // Update UI to show empty cart
    loadOrderHistory(); // Refresh the displayed order history

    // Show menu and cart container again
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) cartContainer.style.display = 'block';
    // const menuContainer = document.getElementById('menu-container'); // if it was hidden
    // if (menuContainer) menuContainer.style.display = 'block';
}

function saveOrderToHistory(orderItems) {
    const MAX_HISTORY_ITEMS = 5; // Keep only the last 5 orders, for example
    let history = JSON.parse(localStorage.getItem('tembiuOrderHistory')) || [];
    
    // Add new order with a timestamp/ID
    const newOrder = {
        id: "ORD-" + Date.now(),
        timestamp: new Date().toLocaleString('pt-BR'),
        items: [...orderItems] // Create a copy of items
    };
    history.unshift(newOrder); // Add to the beginning

    // Trim history if it exceeds max items
    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem('tembiuOrderHistory', JSON.stringify(history));
    console.log("Order saved to history:", newOrder);
}

function loadOrderHistory() {
    const history = JSON.parse(localStorage.getItem('tembiuOrderHistory')) || [];
    const pastOrdersList = document.getElementById('past-orders-list');

    if (!pastOrdersList) return;

    if (history.length === 0) {
        pastOrdersList.innerHTML = '<p>Nenhum pedido encontrado no seu histórico.</p>';
        return;
    }

    pastOrdersList.innerHTML = ''; // Clear existing content
    history.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('past-order');

        const title = document.createElement('h3');
        title.textContent = `Pedido de ${order.timestamp} (ID: ${order.id})`;
        orderDiv.appendChild(title);

        const ul = document.createElement('ul');
        order.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
            ul.appendChild(li);
        });
        orderDiv.appendChild(ul);

        const orderAgainButton = document.createElement('button');
        orderAgainButton.classList.add('order-again-btn');
        orderAgainButton.textContent = 'Pedir Novamente';
        orderAgainButton.addEventListener('click', () => handleOrderAgain(order.items));
        orderDiv.appendChild(orderAgainButton);
        
        pastOrdersList.appendChild(orderDiv);
    });
}

function handleOrderAgain(orderItems) {
    console.log("Order Again clicked. Items to re-order:", orderItems);
    // For now, just log. Future implementation could repopulate the cart:
    // cart = [...orderItems]; // Or merge/add based on desired logic
    // updateCartDisplay();
    // alert("Itens do pedido anterior foram adicionados ao seu carrinho!");
    alert("Funcionalidade 'Pedir Novamente' ainda em desenvolvimento. Detalhes do pedido no console.");
}
