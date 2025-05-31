console.log("Tembiu main.js loaded.");

// Client-side Restaurant Configuration (Placeholders)
const restaurantConfig = {
    name: "Tembiu Lanchonete Virtual", // Placeholder restaurant name
    phone: "5511999999999",           // Placeholder phone number (for wa.me link) // Used as PIX key (telefone). Consider adding a dedicated 'pixKey' if different.
    cidade: "Porto Velho",            // Placeholder city, configure as needed
    // Future items: currency, deliveryFee, etc.
    // Example for PIX Tel field (if different from WhatsApp or needs specific format)
    // pixTel: "11999999999" 
};

let cart = []; // Initialize cart

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
    // Display Restaurant Name in Header
    try {
        const headerTitle = document.querySelector('header h1');
        if (headerTitle && restaurantConfig && restaurantConfig.name) {
            headerTitle.textContent = restaurantConfig.name;
        } else {
            console.warn("Header title element or restaurant name in config not found.");
        }
    } catch (e) {
        console.error("Error setting restaurant name in header:", e);
    }

    // Register Service Worker (existing code)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }

    loadMenu(); 
    loadOrderHistory(); 

    // Button Event Listeners (existing code)
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

    const saveAddressButton = document.getElementById('save-address-button');
    if (saveAddressButton) {
        saveAddressButton.addEventListener('click', handleSaveAddress);
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
            // Ensure item.disponivel is a string from CSV before toLowerCase()
            const isAvailable = typeof item.disponivel === 'string' && item.disponivel.toLowerCase() === 'true';
            if (isAvailable) { 
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.emoji || '🍽️'} ${item.nome} (${item.categoria}) - R$ ${item.preco.toFixed(2)}</span>
                    <button class="add-to-cart-btn">Adicionar</button>
                `;
                li.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                    addItemToCart(item); // item here is the original from menuItems
                });
                ul.appendChild(li);
            }
        });
        menuContainer.appendChild(ul);
    } else {
        menuContainer.innerHTML = '<p>Nenhum item disponível no cardápio.</p>';
    }
}

function addItemToCart(itemFromMenu) { // itemFromMenu is an object from the menu.csv
    const existingItem = cart.find(cartItem => cartItem.nome === itemFromMenu.nome);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Add new item to cart with quantity 1
        // Create a copy to avoid modifying the original menu item object if it was passed directly
        cart.push({ ...itemFromMenu, quantity: 1 });
    }
    console.log(`${itemFromMenu.nome} processed for cart:`, cart);
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

    cart.forEach(item => { // item is from cart array, has quantity
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
        removeButton.addEventListener('click', () => handleRemoveItemFromCart(item.nome)); // Attach event listener
        div.appendChild(removeButton);
        
        cartItemsContainer.appendChild(div);
        total += itemSubtotal;
    });

    cartTotalElement.textContent = total.toFixed(2);
    checkoutButton.style.display = 'block';
}

function handleRemoveItemFromCart(itemName) {
    console.log("Attempting to remove/decrement:", itemName);
    const itemIndex = cart.findIndex(cartItem => cartItem.nome === itemName);

    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            // If quantity is 1, remove the item from cart array
            cart.splice(itemIndex, 1);
        }
    } else {
        console.warn("Item to remove not found in cart:", itemName);
    }
    
    updateCartDisplay(); // Refresh the cart display
}

function handleSaveAddress(event) {
    if (event) event.preventDefault(); // Prevent default if it were a form submit button

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

    const address = {
        street,
        number,
        complement,
        neighborhood,
        city,
        cep
    };

    try {
        const jsonAddress = JSON.stringify(address);
        localStorage.setItem('customerAddress', jsonAddress);
        console.log("Address saved to localStorage:", address);
        alert('Endereço salvo com sucesso! Você pode prosseguir para finalizar o pedido.');
    } catch (e) {
        console.error("Error saving address to localStorage:", e);
        alert('Houve um erro ao salvar o endereço. Por favor, tente novamente.');
    }
    // For now, we might store it in a global variable or pass it to the checkout process.
}

// New function to send order data to the backend
async function sendOrderToBackend(orderData) {
    const backendUrl = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"; // Placeholder
    console.log("Attempting to send order to backend:", orderData);

    // Reminder: The actual GAS backend (doPost function) will need to be deployed
    // and this URL replaced with the correct script web app URL.
    if (backendUrl === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        console.warn("Placeholder backend URL is being used. Order will not be sent to a live backend.");
        // For demonstration, log what would be sent:
        // alert(`Simulating send to backend: ${JSON.stringify(orderData)}`); 
        // To prevent actual fetch errors with placeholder, we can return early or mock success for now.
        // Let's simulate a successful log for now for client-side flow.
        return Promise.resolve({ 
            status: "simulated_success", 
            message: "Order logged for backend (simulation).",
            receivedData: orderData 
        });
    }

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            // GAS doPost typically expects 'application/x-www-form-urlencoded' by default from forms,
            // but can handle 'application/json' if parsed correctly from e.postData.contents.
            // Or, mode 'no-cors' might be needed if GAS is not set up for CORS, but then response is opaque.
            // For a JSON payload, text/plain is often easier with e.postData.contents.
            headers: {
                'Content-Type': 'text/plain', // Sending as text/plain to be parsed from e.postData.contents
            },
            body: JSON.stringify(orderData) 
        });

        if (!response.ok) {
            // For opaque responses (mode: 'no-cors'), response.ok might not be accurate.
            // However, with 'Content-Type': 'text/plain', we expect a normal response.
            throw new Error(`Backend responded with status: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json(); // Assuming GAS returns JSON
        console.log("Response from backend:", responseData);
        // alert(`Order sent to backend: ${responseData.message}`); // Optional user feedback
        return responseData;

    } catch (error) {
        console.error("Error sending order to backend:", error);
        // alert(`Error sending order to backend: ${error.message}`); // Optional user feedback
        return Promise.reject(error);
    }
}

function handleConfirmPayment() {
    if (cart.length === 0) {
        alert("Nenhum item no carrinho para confirmar o pagamento.");
        return;
    }
    console.log("Payment confirmed (simulated). Order details:", cart);
    
    // Create a copy of the cart at this moment for saving and sending
    const confirmedOrderItems = cart.map(item => ({ ...item })); 

    saveOrderToHistory(confirmedOrderItems); // Save the confirmed order (with quantities)

    // Retrieve address for the backend payload
    const storedAddressJson = localStorage.getItem('customerAddress');
    let deliveryAddress = null;
    if (storedAddressJson) {
        try {
            deliveryAddress = JSON.parse(storedAddressJson);
        } catch (e) {
            console.error("Error parsing stored address for backend payload:", e);
            // Optional: alert user or proceed with null address if that's acceptable by backend
        }
    }

    // Create the payload for the backend
    const orderPayload = {
        orderId: "TEMBIU-WEB-" + Date.now(),
        items: confirmedOrderItems, // This is already a copy of cart items with quantities
        customerName: "", // Placeholder as customer name is not collected yet
        customerPhone: "", // Placeholder as customer phone is not collected yet
        deliveryAddress: deliveryAddress // Add the retrieved address here
    };

    // After saving, attempt to send to backend
    sendOrderToBackend(orderPayload)
        .then(backendResponse => {
            console.log("sendOrderToBackend success:", backendResponse.message);
            // Potentially show a more specific success message to user based on backendResponse
        })
        .catch(error => {
            console.error("sendOrderToBackend failed:", error.message);
            // Potentially inform user that backend sync might have failed but order is saved locally
        });

    alert("Pagamento confirmado (simulação)! Obrigado pelo seu pedido. Seu pedido foi salvo localmente.");

    const pixDisplayContainer = document.getElementById('pix-display-container');
    if (pixDisplayContainer) pixDisplayContainer.style.display = 'none';
    
    cart = []; // Clear the current cart
    updateCartDisplay(); 
    loadOrderHistory(); 

    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) cartContainer.style.display = 'block';
}

function saveOrderToHistory(currentCartItems) { // currentCartItems have quantity
    const MAX_HISTORY_ITEMS = 5; 
    let history = JSON.parse(localStorage.getItem('tembiuOrderHistory')) || [];
    
    const newOrder = {
        id: "ORD-" + Date.now(),
        timestamp: new Date().toLocaleString('pt-BR'),
        items: currentCartItems.map(item => ({ ...item })) // Store copies with quantity
    };
    history.unshift(newOrder); 

    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem('tembiuOrderHistory', JSON.stringify(history));
    console.log("Order saved to history (with quantities):", newOrder);
}

function loadOrderHistory() {
    const history = JSON.parse(localStorage.getItem('tembiuOrderHistory')) || [];
    const pastOrdersList = document.getElementById('past-orders-list');

    if (!pastOrdersList) return;

    if (history.length === 0) {
        pastOrdersList.innerHTML = '<p>Nenhum pedido encontrado no seu histórico.</p>';
        return;
    }

    pastOrdersList.innerHTML = ''; 
    history.forEach(order => { // order.items here have quantity
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('past-order');

        const title = document.createElement('h3');
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
        
        const totalP = document.createElement('p');
        totalP.innerHTML = `<strong>Total do Pedido: R$ ${orderTotal.toFixed(2)}</strong>`;
        orderDiv.appendChild(totalP);

        const orderAgainButton = document.createElement('button');
        orderAgainButton.classList.add('order-again-btn');
        orderAgainButton.textContent = 'Pedir Novamente';
        orderAgainButton.addEventListener('click', () => handleOrderAgain(order.items)); 
        orderDiv.appendChild(orderAgainButton);
        
        pastOrdersList.appendChild(orderDiv);
    });
}

function handleOrderAgain(orderItemsFromHistory) { 
    console.log("Order Again clicked. Items to re-populate:", orderItemsFromHistory);
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
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        cartContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function formatCartForWhatsApp(cartArray) {
    // Retrieve and format address from localStorage
    const storedAddressJson = localStorage.getItem('customerAddress');
    let customerAddress = null;
    let addressString = "Endereço de entrega não informado."; // Default message

    if (storedAddressJson) {
        try {
            customerAddress = JSON.parse(storedAddressJson);
            // Format the address into a multi-line string
            addressString = `Logradouro: ${customerAddress.street}, Número: ${customerAddress.number}`;
            if (customerAddress.complement) {
                addressString += `, Complemento: ${customerAddress.complement}`;
            }
            addressString += `\nBairro: ${customerAddress.neighborhood}`;
            addressString += `\nCidade: ${customerAddress.city}, CEP: ${customerAddress.cep}`;
        } catch (e) {
            console.error("Error parsing stored address for WhatsApp:", e);
            addressString = "Erro ao ler endereço salvo.";
        }
    }

    if (!cartArray || cartArray.length === 0) {
        return "Seu carrinho está vazio!";
    }

    // Prepend restaurant name to the message
    let message = `Olá ${restaurantConfig.name}! Gostaria de fazer o seguinte pedido:\n\n`; // Added extra newline
    let total = 0;
    cartArray.forEach(item => { 
        const itemSubtotal = item.preco * item.quantity;
        message += `- ${item.quantity}x ${item.nome} (R$ ${itemSubtotal.toFixed(2)})\n`;
        total += itemSubtotal;
    });
    message += `\nTotal do Pedido: R$ ${total.toFixed(2)}\n`;
    message += `\nEndereço de Entrega:\n${addressString}`; // Append formatted address
    return message;
}

function handleWhatsAppShare() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio. Adicione itens antes de compartilhar.");
        return;
    }

    const orderMessage = formatCartForWhatsApp(cart); 
    console.log("Formatted WhatsApp Message:", orderMessage);
    
    // Construct the WhatsApp Web Intent URL using configured phone number
    const whatsappUrl = `https://wa.me/${restaurantConfig.phone}?text=${encodeURIComponent(orderMessage)}`;

    window.open(whatsappUrl, '_blank');
}

function handleCheckout() {
    // Attempt to retrieve and parse address from localStorage
    const storedAddressJson = localStorage.getItem('customerAddress');
    let customerAddress = null;
    if (storedAddressJson) {
        try {
            customerAddress = JSON.parse(storedAddressJson);
        } catch (e) {
            console.error("Error parsing stored address:", e);
            alert("Erro ao ler o endereço salvo. Por favor, salve-o novamente na tela do carrinho.");
            return; // Stop checkout if address is corrupted
        }
    }

    // Check if address is available
    if (!customerAddress) {
        alert("Por favor, confirme seu endereço de entrega na tela do carrinho antes de finalizar o pedido.");
        return; // Stop checkout if no address is found
    }

    console.log("Customer address for checkout:", customerAddress); // Log retrieved address
    console.log("Checkout initiated. Cart contents (with quantities):", cart);

    if (cart.length === 0) {
        alert("Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.");
        return;
    }

    const orderId = "TEMBIU-" + Date.now(); 

    // Calculate totalAmount from the cart
    let totalAmount = 0;
    cart.forEach(item => {
        totalAmount += item.preco * item.quantity;
    });

    // Define pixParams
    const pixParams = {
        chave: restaurantConfig.phone, // Assuming this is a valid PIX key
        nome: restaurantConfig.name,
        cidade: restaurantConfig.cidade, // CORRECTED: Always use merchant's city for PIX
        valor: totalAmount.toFixed(2), // Format to two decimal places as a string
        txid: orderId,
        descricao: "Pedido " + orderId // Simple description
    };

    // Call gerarPixCopiaECola to get the PIX string
    const pixDataString = gerarPixCopiaECola(pixParams);

    const pixQrCodeElement = document.getElementById('pix-qr-code');
    const pixCopyPasteElement = document.getElementById('pix-copy-paste-code');
    
    if (pixQrCodeElement) {
        pixQrCodeElement.innerHTML = ''; 
        try {
            new QRCode(pixQrCodeElement, {
                text: pixDataString,
                width: 200,
                height: 200,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            pixQrCodeElement.title = pixDataString; 
        } catch (e) {
            console.error("Error generating QR Code:", e);
            pixQrCodeElement.textContent = "[Erro ao gerar QR Code]";
        }
    }
    
    if (pixCopyPasteElement) {
        pixCopyPasteElement.textContent = pixDataString;
    }

    const pixDisplayContainer = document.getElementById('pix-display-container');
    const cartContainer = document.getElementById('cart-container');
    if (pixDisplayContainer) pixDisplayContainer.style.display = 'block';
    if (cartContainer) cartContainer.style.display = 'none'; 
    
    console.log("Displaying PIX information for order:", orderId);
    console.log("PIX Data String (Copia e Cola):", pixDataString);
}
