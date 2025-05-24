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
    loadMenu();
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
        renderMenuItems(menuItems); // Changed to a new rendering function

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
            // Ensure price is a number for calculations
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
        menuContainer.innerHTML = ''; // Clear "Carregando..." or old items
        const ul = document.createElement('ul');
        menuItems.forEach(item => {
            if (item.disponivel && item.disponivel.toLowerCase() === 'true') { // Check availability
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
    // For simplicity, we add items directly. For quantity, we'd check if item exists and increment.
    // This simple version just adds a new entry for each click.
    const cartItem = { ...item, cartItemId: Date.now() }; // Add a unique ID for cart management if needed later
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

    cartItemsContainer.innerHTML = ''; // Clear previous items
    let total = 0;

    cart.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        // Note: item.preco should be a number here due to parseFloat in parseCSV
        div.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`; 
        cartItemsContainer.appendChild(div);
        total += item.preco;
    });

    cartTotalElement.textContent = total.toFixed(2);
    checkoutButton.style.display = 'block';
}

// Add some styling for the "Add to Cart" button if not already present
// This can also go into style.css
const styleSheet = document.styleSheets[0];
try {
    styleSheet.insertRule(`
        .add-to-cart-btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-left: 10px;
        }
    `, styleSheet.cssRules.length);
    styleSheet.insertRule(`
        .add-to-cart-btn:hover {
            background-color: #0056b3;
        }
    `, styleSheet.cssRules.length);
} catch (e) {
    console.warn("Could not insert CSS rules for .add-to-cart-btn dynamically: ", e);
    // Fallback: Or ensure these styles are in your style.css
}
