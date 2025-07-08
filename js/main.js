console.log("Tembiu main.js loaded.");

// --- Turso Configuration (WARNING: EXPOSES API KEY CLIENT-SIDE) ---
// Replace with your actual Turso database URL and API token.
// This is NOT recommended for production due to security risks.
const TURSO_DATABASE_URL = "YOUR_TURSO_DATABASE_URL_HERE";
const TURSO_AUTH_TOKEN = "YOUR_TURSO_AUTH_TOKEN_HERE";

let db;

// Initialize Turso client
try {
  db = libsql.createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });
  console.log("Turso client initialized.");
} catch (e) {
  console.error("Failed to initialize Turso client:", e);
  alert("Erro ao conectar com o banco de dados. Verifique o console.");
}
// --- End Turso Configuration ---

let restaurantConfig = {}; // Will be loaded from Turso

async function loadRestaurantConfig() {
  if (!db) {
    console.error("Turso client not initialized. Cannot load restaurant config.");
    return;
  }
  try {
    const rs = await db.execute("SELECT key, value FROM restaurant_config");
    rs.rows.forEach(row => {
      restaurantConfig[row.key] = row.value;
    });
    console.log("Restaurant config loaded from Turso:", restaurantConfig);
  } catch (e) {
    console.error("Error loading restaurant config from Turso:", e);
  }
}

let cart = []; // Initialize cart
let allMenuItems = []; // Store all menu items for filtering

document.addEventListener("DOMContentLoaded", async () => {
  await loadRestaurantConfig(); // Load config before using it

  // Display Restaurant Name in Header
  try {
    const headerTitle = document.querySelector("header h1");
    if (headerTitle && restaurantConfig && restaurantConfig.name) {
      headerTitle.textContent = restaurantConfig.name;
    } else {
      console.warn(
        "Header title element or restaurant name in config not found.",
      );
    }
  } catch (e) {
    console.error("Error setting restaurant name in header:", e);
  }

  // Register Service Worker (existing code)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }

  loadMenu();
  loadOrderHistory();

  const searchInput = document.getElementById("menu-search");
  if (searchInput) {
    searchInput.addEventListener("input", applyFiltersAndRender);
  }

  // Button Event Listeners (existing code)
  const checkoutButton = document.getElementById("checkout-button");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", handleCheckout);
  }

  const confirmPaymentButton = document.getElementById(
    "confirm-payment-button",
  );
  if (confirmPaymentButton) {
    confirmPaymentButton.addEventListener("click", handleConfirmPayment);
  }

  const whatsappShareButton = document.getElementById("whatsapp-share-button");
  if (whatsappShareButton) {
    whatsappShareButton.addEventListener("click", handleWhatsAppShare);
  }

  const saveAddressButton = document.getElementById("save-address-button");
  if (saveAddressButton) {
    saveAddressButton.addEventListener("click", handleSaveAddress);
  }

  const clearHistoryButton = document.getElementById("clear-history-button");
  if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", handleClearHistory);
  }

  // Theme Toggle Logic
  const themeToggleButton = document.getElementById("theme-toggle-button");
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      // Save preference to localStorage
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggleButton.textContent = "Tema Claro"; // Update button text
      } else {
        localStorage.setItem("theme", "light");
        themeToggleButton.textContent = "Tema Escuro"; // Update button text
      }
    });
  }

  // Apply saved theme on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggleButton) themeToggleButton.textContent = "Tema Claro";
  } else {
    // Default to light theme if no preference or preference is 'light'
    document.body.classList.remove("dark-mode"); // Ensure it's not there if 'light' or null
    if (themeToggleButton) themeToggleButton.textContent = "Tema Escuro";
  }

  initOpenStatus();
});

function initOpenStatus() {
    const statusElem = document.getElementById("open-status");
    if (!statusElem || !restaurantConfig.openTime || !restaurantConfig.closeTime) {
        return;
    }

    function updateStatus() {
        const localeTime = new Date().toLocaleTimeString("pt-BR", {
            timeZone: restaurantConfig.timezone || "UTC",
            hour12: false,
        });
        const [curH, curM] = localeTime.split(":").map(Number);
        const [openH, openM] = restaurantConfig.openTime.split(":").map(Number);
        const [closeH, closeM] = restaurantConfig.closeTime.split(":").map(Number);

        const curMinutes = curH * 60 + curM;
        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;

        // Handle closing time crossing midnight
        let isCurrentlyOpen = false;
        if (openMinutes < closeMinutes) {
            // Normal hours (e.g., 11:00 to 23:00)
            isCurrentlyOpen = curMinutes >= openMinutes && curMinutes < closeMinutes;
        } else {
            // Hours cross midnight (e.g., 22:00 to 02:00)
            isCurrentlyOpen = curMinutes >= openMinutes || curMinutes < closeMinutes;
        }

        if (isCurrentlyOpen) {
            statusElem.textContent = `Aberto • Fecha às ${restaurantConfig.closeTime}`;
            statusElem.classList.add("open");
            statusElem.classList.remove("closed");
        } else {
            statusElem.textContent = `Fechado • Abre às ${restaurantConfig.openTime}`;
            statusElem.classList.add("closed");
            statusElem.classList.remove("open");
        }
    }

    updateStatus();
    setInterval(updateStatus, 60000);
}

async function loadMenu() {
  if (!db) {
    console.error("Turso client not initialized. Cannot load menu.");
    document.getElementById("menu-container").innerHTML =
      "<p>Erro ao carregar o cardápio: Conexão com o banco de dados falhou.</p>";
    return;
  }

  try {
    const rs = await db.execute("SELECT nome, categoria, preco, descricao, emoji, disponivel FROM menu_items WHERE disponivel = TRUE");
    allMenuItems = rs.rows.map(row => ({
      nome: row.nome,
      categoria: row.categoria,
      preco: row.preco,
      descricao: row.descricao,
      emoji: row.emoji,
      disponivel: row.disponivel === 1 // SQLite boolean is 0 or 1
    }));
    console.log("Menu Items Loaded from Turso:", allMenuItems);
    initializeCategories(allMenuItems);
    applyFiltersAndRender();
  } catch (e) {
    console.error("Error loading menu from Turso:", e);
    document.getElementById("menu-container").innerHTML =
      "<p>Erro ao carregar o cardápio do banco de dados. Tente novamente mais tarde.</p>";
  }
}

// parseCSV function is no longer needed as data comes from Turso
// function parseCSV(csvText) { ... }

// parseCSV function is no longer needed as data comes from Turso
// function parseCSV(csvText) { ... }

function initializeCategories(items) {
  const container = document.getElementById("category-filters");
  if (!container) return;
  const categories = ["Todos", ...new Set(items.map((i) => i.categoria))];
  container.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.classList.add("category-filter");
    if (cat === "Todos") btn.classList.add("active");
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".category-filter")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFiltersAndRender();
    });
    container.appendChild(btn);
  });
}

function applyFiltersAndRender() {
  if (!Array.isArray(allMenuItems)) return;

  const searchInput = document.getElementById("menu-search");
  const term = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const activeBtn = document.querySelector(".category-filter.active");
  const category = activeBtn ? activeBtn.textContent.trim() : "Todos";

  const filtered = allMenuItems.filter((item) => {
    if (
      typeof item.disponivel === "string" &&
      item.disponivel.toLowerCase() !== "true"
    )
      return false;
    if (
      category !== "Todos" &&
      item.categoria &&
      item.categoria.toLowerCase() !== category.toLowerCase()
    )
      return false;
    if (
      term &&
      !(
        item.nome.toLowerCase().includes(term) ||
        (item.descricao && item.descricao.toLowerCase().includes(term))
      )
    )
      return false;
    return true;
  });

  renderMenuItems(filtered);
}

function renderMenuItems(menuItems) {
  const menuContainer = document.getElementById("menu-container");
  if (!menuContainer) {
    console.error("Menu container not found!");
    return;
  }

  if (menuItems && menuItems.length > 0) {
    menuContainer.innerHTML = "";
    const ul = document.createElement("ul");
    menuItems.forEach((item) => {
      // item.disponivel is now expected to be a boolean
      if (item.disponivel) {
        const li = document.createElement("li");
        // Ensure item.preco is a number before calling toFixed
        const price =
          typeof item.preco === "number" ? item.preco.toFixed(2) : "N/A";
        li.innerHTML = `
                    <span>${item.emoji || "🍽️"} ${item.nome} (${item.categoria}) - R$ ${price}</span>
                    <button class="add-to-cart-btn">Adicionar</button>
                `;
        li.querySelector(".add-to-cart-btn").addEventListener("click", () => {
          addItemToCart(item); // item here is the original from menuItems
        });
        ul.appendChild(li);
      }
    });
    menuContainer.appendChild(ul);
  } else {
    menuContainer.innerHTML = "<p>Nenhum item encontrado.</p>";
  }
}

function addItemToCart(itemFromMenu) {
  // itemFromMenu is an object from the menu.csv
  const existingItem = cart.find(
    (cartItem) => cartItem.nome === itemFromMenu.nome,
  );

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
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");

  if (!cartItemsContainer || !cartTotalElement || !checkoutButton) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    cartTotalElement.textContent = "0.00";
    checkoutButton.style.display = "none";
    return;
  }

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    // item is from cart array, has quantity
    const div = document.createElement("div");
    div.classList.add("cart-item");

    const itemDetails = document.createElement("span");
    const itemSubtotal = item.preco * item.quantity;
    itemDetails.textContent = `${item.quantity}x ${item.nome} - R$ ${itemSubtotal.toFixed(2)}`;
    div.appendChild(itemDetails);

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-from-cart-btn");
    removeButton.textContent = "Remover";
    removeButton.setAttribute("data-item-name", item.nome);
    removeButton.addEventListener("click", () =>
      handleRemoveItemFromCart(item.nome),
    ); // Attach event listener
    div.appendChild(removeButton);

    cartItemsContainer.appendChild(div);
    total += itemSubtotal;
  });

  cartTotalElement.textContent = total.toFixed(2);
  checkoutButton.style.display = "block";
}

function handleRemoveItemFromCart(itemName) {
  console.log("Attempting to remove/decrement:", itemName);
  const itemIndex = cart.findIndex((cartItem) => cartItem.nome === itemName);

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

// New function to send order data to the backend
async function sendOrderToBackend(orderData) {
  if (!db) {
    console.error("Turso client not initialized. Cannot send order.");
    alert("Erro ao enviar pedido: Conexão com o banco de dados falhou.");
    return Promise.reject("DB not initialized");
  }

  console.log("Attempting to send order to Turso:", orderData);

  try {
    const orderId = orderData.orderId;
    const totalAmount = orderData.items.reduce((sum, item) => sum + item.preco * item.quantity, 0);
    const timestamp = new Date().toISOString(); // Use ISO string for consistent storage

    // Start a transaction
    await db.transaction(async tx => {
      // Insert into orders table
      await tx.execute({
        sql: "INSERT INTO orders (order_id, timestamp, customer_name, customer_phone, total_amount) VALUES (?, ?, ?, ?, ?)",
        args: [orderId, timestamp, orderData.customerName || null, orderData.customerPhone || null, totalAmount]
      });

      // Insert into order_items table for each item
      for (const item of orderData.items) {
        await tx.execute({
          sql: "INSERT INTO order_items (order_id, item_name, quantity, price_at_order) VALUES (?, ?, ?, ?)",
          args: [orderId, item.nome, item.quantity, item.preco]
        });
      }
    });

    console.log("Order successfully saved to Turso:", orderId);
    return { status: "success", message: "Order saved to Turso." };
  } catch (error) {
    console.error("Error saving order to Turso:", error);
    alert("Erro ao salvar o pedido no banco de dados. Tente novamente.");
    return Promise.reject(error);
  }
}

function handleConfirmPayment() {
  if (cart.length === 0) {
    alert("Nenhum item no carrinho para confirmar o pagamento.");
    return;
  }
  console.log("Payment confirmed (simulated). Order details:", cart);

  const confirmedOrderItems = cart.map((item) => ({ ...item }));
  const orderPayload = {
    orderId: "TEMBIU-WEB-" + Date.now(),
    items: confirmedOrderItems,
    customerName: "",
    customerPhone: "",
  };

  sendOrderToBackend(orderPayload)
    .then((backendResponse) => {
      console.log("sendOrderToBackend success:", backendResponse.message);
      saveOrderToHistory(confirmedOrderItems); // Save to local history only after successful DB save
      alert(
        "Pagamento confirmado! Obrigado pelo seu pedido. Seu pedido foi salvo no banco de dados e localmente.",
      );
    })
    .catch((error) => {
      console.error("sendOrderToBackend failed:", error.message);
      alert(
        "Erro ao confirmar pagamento. O pedido pode não ter sido salvo no banco de dados, mas foi salvo localmente.",
      );
      saveOrderToHistory(confirmedOrderItems); // Still save to local history if DB fails
    })
    .finally(() => {
      const pixDisplayContainer = document.getElementById("pix-display-container");
      const addressContainer = document.getElementById("address-container");
      const googlePayContainer = document.getElementById("google-pay-container");
      if (pixDisplayContainer) pixDisplayContainer.style.display = "none";
      if (addressContainer) addressContainer.style.display = "none";
      if (googlePayContainer) googlePayContainer.style.display = "none";

      cart = [];
      updateCartDisplay();
      loadOrderHistory();

      const cartContainer = document.getElementById("cart-container");
      if (cartContainer) cartContainer.style.display = "block";
    });
}

function saveOrderToHistory(currentCartItems) {
  // currentCartItems have quantity
  const MAX_HISTORY_ITEMS = 5;
  let history = JSON.parse(localStorage.getItem("tembiuOrderHistory")) || [];

  const newOrder = {
    id: "ORD-" + Date.now(),
    timestamp: new Date().toLocaleString("pt-BR"),
    items: currentCartItems.map((item) => ({ ...item })), // Store copies with quantity
  };
  history.unshift(newOrder);

  if (history.length > MAX_HISTORY_ITEMS) {
    history = history.slice(0, MAX_HISTORY_ITEMS);
  }

  localStorage.setItem("tembiuOrderHistory", JSON.stringify(history));
  console.log("Order saved to history (with quantities):", newOrder);
}

function loadOrderHistory() {
  const history = JSON.parse(localStorage.getItem("tembiuOrderHistory")) || [];
  const pastOrdersList = document.getElementById("past-orders-list");

  if (!pastOrdersList) return;

  if (history.length === 0) {
    pastOrdersList.innerHTML =
      "<p>Nenhum pedido encontrado no seu histórico.</p>";
    return;
  }

  pastOrdersList.innerHTML = "";
  history.forEach((order) => {
    // order.items here have quantity
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("past-order");

    const title = document.createElement("h3");
    title.textContent = `Pedido de ${order.timestamp} (ID: ${order.id})`;
    orderDiv.appendChild(title);

    const ul = document.createElement("ul");
    let orderTotal = 0;
    order.items.forEach((item) => {
      const li = document.createElement("li");
      const itemSubtotal = item.preco * item.quantity;
      li.textContent = `${item.quantity}x ${item.nome} - R$ ${itemSubtotal.toFixed(2)}`;
      ul.appendChild(li);
      orderTotal += itemSubtotal;
    });
    orderDiv.appendChild(ul);

    const totalP = document.createElement("p");
    totalP.innerHTML = `<strong>Total do Pedido: R$ ${orderTotal.toFixed(2)}</strong>`;
    orderDiv.appendChild(totalP);

    const orderAgainButton = document.createElement("button");
    orderAgainButton.classList.add("order-again-btn");
    orderAgainButton.textContent = "Pedir Novamente";
    orderAgainButton.addEventListener("click", () =>
      handleOrderAgain(order.items),
    );
    orderDiv.appendChild(orderAgainButton);

    pastOrdersList.appendChild(orderDiv);
  });

  updateAnalytics(history);
}

function handleOrderAgain(orderItemsFromHistory) {
  console.log(
    "Order Again clicked. Items to re-populate:",
    orderItemsFromHistory,
  );
  cart = [];

  orderItemsFromHistory.forEach((itemFromHistory) => {
    const quantity = itemFromHistory.quantity || 1;
    for (let i = 0; i < quantity; i++) {
      const baseItem = { ...itemFromHistory };
      delete baseItem.quantity;
      addItemToCart(baseItem);
    }
  });
  updateCartDisplay();

  alert("Itens do seu pedido anterior foram adicionados ao seu carrinho!");
  const cartContainer = document.getElementById("cart-container");
  if (cartContainer) {
    cartContainer.scrollIntoView({ behavior: "smooth" });
  }
}

function handleClearHistory() {
  const confirmation = confirm(
    "Tem certeza que deseja limpar seu histórico de pedidos?",
  );
  if (!confirmation) return;

  localStorage.removeItem("tembiuOrderHistory");
  loadOrderHistory();
  alert("Histórico de pedidos limpo com sucesso.");
}

function calculateAnalytics(history) {
  const totals = { totalOrders: history.length, totalValue: 0, items: {} };
  history.forEach((order) => {
    order.items.forEach((item) => {
      const qty = item.quantity || 1;
      totals.totalValue += item.preco * qty;
      totals.items[item.nome] = (totals.items[item.nome] || 0) + qty;
    });
  });
  const averageOrderValue = totals.totalOrders
    ? totals.totalValue / totals.totalOrders
    : 0;
  const topItems = Object.entries(totals.items)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));
  return { totalOrders: totals.totalOrders, averageOrderValue, topItems };
}

function updateAnalytics(history) {
  const container = document.getElementById("analytics-content");
  if (!container) return;
  const { totalOrders, averageOrderValue, topItems } =
    calculateAnalytics(history);
  let html = `<p>Total de Pedidos: ${totalOrders}</p>`;
  html += `<p>Valor Médio dos Pedidos: R$ ${averageOrderValue.toFixed(2)}</p>`;
  if (topItems.length > 0) {
    html += "<h3>Itens Mais Pedidos</h3><ul>";
    topItems.forEach((item) => {
      html += `<li>${item.name} (${item.count})</li>`;
    });
    html += "</ul>";
  } else {
    html += "<p>Nenhum item registrado.</p>";
  }
  container.innerHTML = html;
}

function formatCartForWhatsApp(cartArray) {
  if (!cartArray || cartArray.length === 0) {
    return "Seu carrinho está vazio!";
  }
  // Prepend restaurant name to the message
  let message = `Olá ${restaurantConfig.name}! Gostaria de fazer o seguinte pedido:\n`; // Corrected newline
  let total = 0;
  cartArray.forEach((item) => {
    const itemSubtotal = item.preco * item.quantity;
    message += `- ${item.quantity}x ${item.nome} (R$ ${itemSubtotal.toFixed(2)})\n`; // Corrected newline
    total += itemSubtotal;
  });
  message += `\nTotal do Pedido: R$ ${total.toFixed(2)}`; // Corrected newline

  const addr = getSavedAddress();
  if (addr) {
    let addrStr = `Logradouro: ${addr.street}, Número: ${addr.number}`;
    if (addr.complement) addrStr += `, Complemento: ${addr.complement}`;
    addrStr += `\nBairro: ${addr.neighborhood}\nCidade: ${addr.city}, CEP: ${addr.cep}`;
    message += `\n\nEndereço de Entrega:\n${addrStr}`;
  }

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

  window.open(whatsappUrl, "_blank");
}

function handleCheckout() {
  console.log("Checkout initiated. Cart contents (with quantities):", cart);

  if (cart.length === 0) {
    alert(
      "Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.",
    );
    return;
  }

  const savedAddress = getSavedAddress();
  const addressContainer = document.getElementById("address-container");
  const cartContainer = document.getElementById("cart-container");

  if (!savedAddress) {
    if (addressContainer) addressContainer.style.display = "block";
    if (cartContainer) cartContainer.style.display = "none";
    return;
  }

  const orderId = "TEMBIU-" + Date.now();
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.preco * item.quantity,
    0,
  );

  generateAndDisplayPix(orderId, totalAmount);

  const pixDisplayContainer = document.getElementById("pix-display-container");
  if (pixDisplayContainer) pixDisplayContainer.style.display = "block";
  const googlePayContainer = document.getElementById("google-pay-container");
  if (googlePayContainer) googlePayContainer.style.display = "block";
  if (cartContainer) cartContainer.style.display = "none";

  console.log(
    "Displaying PIX information with refined QR Code data for order:",
    orderId,
  );
}

function getSavedAddress() {
  const stored = localStorage.getItem("customerAddress");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

function handleSaveAddress() {
  const street = document.getElementById("street").value.trim();
  const number = document.getElementById("number").value.trim();
  const complement = document.getElementById("complement").value.trim();
  const neighborhood = document.getElementById("neighborhood").value.trim();
  const city = document.getElementById("city").value.trim();
  const cep = document.getElementById("cep").value.trim();

  if (!street || !number || !neighborhood || !city || !cep) {
    alert("Por favor, preencha todos os campos obrigatórios do endereço.");
    return;
  }

  const address = { street, number, complement, neighborhood, city, cep };
  try {
    localStorage.setItem("customerAddress", JSON.stringify(address));
  } catch (e) {
    console.error("Error saving address:", e);
  }

  const addressContainer = document.getElementById("address-container");
  if (addressContainer) addressContainer.style.display = "none";
  handleCheckout();
}

function gerarPixCopiaECola({
  chave,
  nome,
  cidade,
  valor = null,
  descricao = "",
  txid = "***",
}) {
  function formatTag(tag, value) {
    const len = String(value.length).padStart(2, "0");
    return `${tag}${len}${value}`;
  }
  function crc16(payload) {
    let polinomio = 0x1021;
    let resultado = 0xffff;
    for (let i = 0; i < payload.length; i++) {
      resultado ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        resultado = (resultado << 1) ^ (resultado & 0x8000 ? polinomio : 0);
        resultado &= 0xffff;
      }
    }
    return resultado.toString(16).toUpperCase().padStart(4, "0");
  }
  const gui = formatTag("00", "BR.GOV.BCB.PIX");
  const chavePix = formatTag("01", chave);
  const infoAdicional = descricao ? formatTag("02", descricao) : "";
  const merchantAccountInfo = formatTag("26", gui + chavePix + infoAdicional);
  const payloadSemCRC =
    formatTag("00", "01") +
    formatTag("01", "12") +
    merchantAccountInfo +
    formatTag("52", "0000") +
    formatTag("53", "986") +
    (valor ? formatTag("54", String(valor)) : "") +
    formatTag("58", "BR") +
    formatTag("59", nome.substring(0, 25)) +
    formatTag("60", cidade.substring(0, 15)) +
    formatTag("62", formatTag("05", txid)) +
    "6304";
  const crc = crc16(payloadSemCRC);
  return payloadSemCRC + crc;
}

function generateAndDisplayPix(orderId, totalAmount) {
  const pixParams = {
    chave: restaurantConfig.phone,
    nome: restaurantConfig.name,
    cidade: restaurantConfig.cidade,
    valor: totalAmount.toFixed(2),
    txid: orderId,
    descricao: `Pedido ${orderId}`,
  };
  const pixDataString = gerarPixCopiaECola(pixParams);
  const pixQrCodeElement = document.getElementById("pix-qr-code");
  const pixCopyPasteElement = document.getElementById("pix-copy-paste-code");
  if (pixQrCodeElement) {
    pixQrCodeElement.innerHTML = "";
    try {
      new QRCode(pixQrCodeElement, {
        text: pixDataString,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      pixQrCodeElement.title = pixDataString;
    } catch (e) {
      pixQrCodeElement.textContent = "[Erro ao gerar QR Code]";
      console.error("Error generating QR Code:", e);
    }
  }
  if (pixCopyPasteElement) pixCopyPasteElement.textContent = pixDataString;
}
