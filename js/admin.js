// js/admin.js
console.log("Tembiu admin.js loaded.");

// --- Turso Configuration (Assume configured, same as main.js) ---
// IMPORTANT: In a real production app, you would not duplicate this.
// You'd secure your admin panel differently, likely with server-side auth
// and backend API calls, not direct client-side DB access with exposed tokens.
// For this project's current structure, we'll mirror main.js's approach.

const TURSO_DATABASE_URL = "YOUR_TURSO_DATABASE_URL_HERE"; // Placeholder
const TURSO_AUTH_TOKEN = "YOUR_TURSO_AUTH_TOKEN_HERE";   // Placeholder

let db;

try {
    if (typeof libsql === "undefined") {
        throw new Error("libsql client not loaded. Make sure the script tag is in admin.html.");
    }
    db = libsql.createClient({
        url: TURSO_DATABASE_URL,
        authToken: TURSO_AUTH_TOKEN,
    });
    console.log("Admin Turso client initialized.");
} catch (e) {
    console.error("Failed to initialize Admin Turso client:", e);
    alert("Erro crítico ao conectar com o banco de dados no painel admin. Verifique o console.");
}
// --- End Turso Configuration ---

document.addEventListener("DOMContentLoaded", () => {
    if (!db && (TURSO_DATABASE_URL === "YOUR_TURSO_DATABASE_URL_HERE" || TURSO_AUTH_TOKEN === "YOUR_TURSO_AUTH_TOKEN_HERE")) {
        console.warn("Admin Turso client NOT initialized because placeholders are still present.");
        // Optionally, disable features or show a more prominent warning on the page
        const menuManagementSection = document.getElementById("menu-management-section");
        if (menuManagementSection) {
            menuManagementSection.innerHTML = `
                <h2>Gerenciar Cardápio</h2>
                <p style="color: red; font-weight: bold;">
                    A conexão com o banco de dados (Turso) não foi configurada corretamente.
                    Por favor, atualize os placeholders TURSO_DATABASE_URL e TURSO_AUTH_TOKEN em js/admin.js.
                </p>
            ` + menuManagementSection.innerHTML; // Keep existing form but add warning
        }
    } else if (!db) {
         console.error("Admin Turso client is not initialized, but placeholders seem to be replaced. Check for other errors.");
         alert("A conexão com o banco de dados falhou. Funcionalidades do admin podem não operar corretamente.");
    }


    const menuItemForm = document.getElementById("menu-item-form");
    const menuItemsTableBody = document.querySelector("#menu-items-table tbody");
    const clearFormButton = document.getElementById("clear-form-button");
    const adminMenuSearchInput = document.getElementById("admin-menu-search");

    // Navigation
    const navLinks = document.querySelectorAll("nav .nav-link");
    const sections = document.querySelectorAll(".admin-section");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetSectionId = link.getAttribute("data-section");

            sections.forEach(section => {
                section.style.display = "none";
                section.classList.remove("active-section");
            });

            navLinks.forEach(navLink => navLink.classList.remove("active"));

            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.style.display = "block";
                targetSection.classList.add("active-section");
                link.classList.add("active");
            }
            // Load data for the activated section if needed
            if (targetSectionId === "menu-management-section") {
                loadMenuItems();
            }
            // Add similar conditions for other sections when they are implemented
        });
    });

    // Initial load for the default active section
    if (document.querySelector("#menu-management-section.active-section")) {
        loadMenuItems();
    }

    if (menuItemForm) {
        menuItemForm.addEventListener("submit", handleSaveMenuItem);
    }

    if (clearFormButton) {
        clearFormButton.addEventListener("click", resetMenuItemForm);
    }

    if (adminMenuSearchInput) {
        adminMenuSearchInput.addEventListener("input", () => loadMenuItems(adminMenuSearchInput.value.trim()));
    }

    // --- Restaurant Config Form Event Listener ---
    const restaurantConfigForm = document.getElementById("restaurant-config-form");
    if (restaurantConfigForm) {
        restaurantConfigForm.addEventListener("submit", saveRestaurantConfigAdmin);
    }
    const resetConfigButton = document.getElementById("reset-config-button");
    if (resetConfigButton) {
        resetConfigButton.addEventListener("click", () => {
            if (confirm("Tem certeza que deseja recarregar as configurações? Quaisquer alterações não salvas no formulário serão perdidas.")) {
                loadRestaurantConfigAdmin(); // Reloads data from DB into the form
            }
        });
    }

    // --- Order Management Event Listeners ---
    const applyOrderFiltersButton = document.getElementById("apply-order-filters");
    if (applyOrderFiltersButton) {
        applyOrderFiltersButton.addEventListener("click", loadOrdersAdmin);
    }
    const updateOrderStatusButton = document.getElementById("update-order-status-button");
    if (updateOrderStatusButton) {
        updateOrderStatusButton.addEventListener("click", updateOrderStatus);
    }
    const shareOrderLinkButton = document.getElementById("share-order-link-button");
    if (shareOrderLinkButton) {
        shareOrderLinkButton.addEventListener("click", handleShareOrderLink);
    }

    // --- Reports Event Listener ---
    const generateReportsButton = document.getElementById("generate-reports-button");
    if (generateReportsButton) {
        generateReportsButton.addEventListener("click", generateAllReports);
    }

    // --- Initial Load Logic based on Hash or Default Active Section ---
    // Consolidating the logic for which section to show and what data to load initially.
    let sectionActivatedByHash = false;
    if (window.location.hash) {
        const sectionIdFromHash = window.location.hash.substring(1) + "-section"; // e.g. #reports -> reports-section
        const reportLink = document.querySelector(`nav .nav-link[data-section="${sectionIdFromHash}"]`);
        if (reportLink) {
            reportLink.click(); // Simulate click to activate section
            sectionActivatedByHash = true;
        }
    }

    if (!sectionActivatedByHash) {
        // Default to menu management if no hash or hash doesn't match a nav link
        const defaultActiveSection = document.querySelector("#menu-management-section.active-section");
        if (defaultActiveSection) { // Should always be true based on HTML
            loadMenuItems();
        }
    }
    // Note: The .click() simulation on navLink already handles calling load functions for specific sections.
    // The previous individual checks for .active-section on other sections are now covered by this.

});

async function loadMenuItems(searchTerm = "") {
    const tableBody = document.querySelector("#menu-items-table tbody");
    if (!tableBody) {
        console.error("Menu items table body not found!");
        return;
    }
    tableBody.innerHTML = "<tr><td colspan=\"5\">Carregando itens...</td></tr>";

    if (!db) {
        tableBody.innerHTML = "<tr><td colspan=\"5\" style=\"color:red;\">Erro: Conexão com banco de dados não configurada.</td></tr>";
        return;
    }

    try {
        let sql = "SELECT rowid as id, nome, categoria, preco, descricao, emoji, disponivel FROM menu_items ORDER BY nome ASC";
        let args = [];
        if (searchTerm) {
            sql = "SELECT rowid as id, nome, categoria, preco, descricao, emoji, disponivel FROM menu_items WHERE nome LIKE ? OR categoria LIKE ? ORDER BY nome ASC";
            args = [`%${searchTerm}%`, `%${searchTerm}%`];
        }

        const rs = await db.execute({ sql, args });

        if (rs.rows.length === 0) {
            tableBody.innerHTML = "<tr><td colspan=\"5\">Nenhum item encontrado.</td></tr>";
            return;
        }

        tableBody.innerHTML = ""; // Clear loading/empty message
        rs.rows.forEach(item => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item.nome;
            row.insertCell().textContent = item.categoria;
            row.insertCell().textContent = typeof item.preco === 'number' ? `R$ ${item.preco.toFixed(2)}` : 'N/A';
            row.insertCell().textContent = item.disponivel ? "Sim" : "Não";

            const actionsCell = row.insertCell();
            actionsCell.classList.add("action-buttons");
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.classList.add("secondary");
            editButton.onclick = () => populateFormForEdit(item);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Excluir";
            deleteButton.classList.add("danger");
            deleteButton.onclick = () => handleDeleteMenuItem(item.id, item.nome);
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error("Error loading menu items:", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="color:red;">Erro ao carregar itens: ${error.message}</td></tr>`;
    }
}

function populateFormForEdit(item) {
    document.getElementById("menu-item-id").value = item.id;
    document.getElementById("item-name").value = item.nome;
    document.getElementById("item-category").value = item.categoria;
    document.getElementById("item-price").value = item.preco;
    document.getElementById("item-description").value = item.descricao || "";
    document.getElementById("item-emoji").value = item.emoji || "";
    document.getElementById("item-available").checked = item.disponivel ? true : false; // Handles 0/1 from SQLite
    document.getElementById("save-item-button").textContent = "Atualizar Item";
    document.getElementById("item-name").focus(); // Focus on the first field
}

function resetMenuItemForm() {
    document.getElementById("menu-item-form").reset();
    document.getElementById("menu-item-id").value = ""; // Clear hidden ID field
    document.getElementById("save-item-button").textContent = "Salvar Item";
}

async function handleSaveMenuItem(event) {
    event.preventDefault();
    if (!db) {
        alert("Erro: Conexão com banco de dados não configurada. Não é possível salvar.");
        return;
    }

    const itemId = document.getElementById("menu-item-id").value;
    const name = document.getElementById("item-name").value.trim();
    const category = document.getElementById("item-category").value.trim();
    const price = parseFloat(document.getElementById("item-price").value);
    const description = document.getElementById("item-description").value.trim();
    const emoji = document.getElementById("item-emoji").value.trim();
    const available = document.getElementById("item-available").checked ? 1 : 0; // SQLite uses 0 or 1 for boolean

    const saveButton = document.getElementById("save-item-button");

    if (!name || !category || isNaN(price)) {
        alert("Por favor, preencha Nome, Categoria e Preço.");
        return;
    }

    const originalButtonText = saveButton.textContent;
    saveButton.textContent = "Salvando...";
    saveButton.disabled = true;

    try {
        if (itemId) {
            // Update existing item
            await db.execute({
                sql: "UPDATE menu_items SET nome = ?, categoria = ?, preco = ?, descricao = ?, emoji = ?, disponivel = ? WHERE rowid = ?",
                args: [name, category, price, description, emoji, available, itemId]
            });
            alert("Item atualizado com sucesso!");
        } else {
            // Add new item
            await db.execute({
                sql: "INSERT INTO menu_items (nome, categoria, preco, descricao, emoji, disponivel) VALUES (?, ?, ?, ?, ?, ?)",
                args: [name, category, price, description, emoji, available]
            });
            alert("Item adicionado com sucesso!");
        }
        resetMenuItemForm();
        loadMenuItems(document.getElementById("admin-menu-search").value.trim()); // Refresh list
    } catch (error) {
        console.error("Error saving menu item:", error);
        alert(`Erro ao salvar item: ${error.message}`);
    } finally {
        saveButton.textContent = originalButtonText;
        saveButton.disabled = false;
    }
}

async function handleDeleteMenuItem(itemId, itemName) {
    if (!db) {
        alert("Erro: Conexão com banco de dados não configurada. Não é possível excluir.");
        return;
    }
    if (confirm(`Tem certeza que deseja excluir o item "${itemName}"?`)) {
        try {
            await db.execute({
                sql: "DELETE FROM menu_items WHERE rowid = ?",
                args: [itemId]
            });
            alert("Item excluído com sucesso!");
            loadMenuItems(document.getElementById("admin-menu-search").value.trim()); // Refresh list
        } catch (error) {
            console.error("Error deleting menu item:", error);
            alert(`Erro ao excluir item: ${error.message}`);
        }
    }
}

// TODO: Add functions for restaurant config, order management, and reports
// For example:
async function loadRestaurantConfigAdmin() {
    if (!db) {
        alert("Erro: Conexão com banco de dados não configurada.");
        return;
    }
    try {
        const rs = await db.execute("SELECT key, value FROM restaurant_config");
        const config = {};
        rs.rows.forEach(row => {
            config[row.key] = row.value;
        });

        document.querySelectorAll("#restaurant-config-form [data-configkey]").forEach(input => {
            const key = input.dataset.configkey;
            if (config[key] !== undefined) {
                input.value = config[key];
            } else {
                input.value = ""; // Clear if not set
            }
        });
        console.log("Restaurant config loaded into admin form:", config);
    } catch (error) {
        console.error("Error loading restaurant config for admin:", error);
        alert(`Erro ao carregar configurações: ${error.message}`);
    }
}

async function saveRestaurantConfigAdmin(event) {
    event.preventDefault();
    if (!db) {
        alert("Erro: Conexão com banco de dados não configurada. Não é possível salvar.");
        return;
    }

    const inputs = document.querySelectorAll("#restaurant-config-form [data-configkey]");
    const configToSave = [];

    inputs.forEach(input => {
        const key = input.dataset.configkey;
        const value = input.value.trim();
        // Basic validation: required fields in HTML have 'required' attribute
        // More specific validation can be added here if needed.
        if (input.required && !value) {
            alert(`Campo obrigatório '${input.labels[0] ? input.labels[0].textContent : key}' não preenchido.`);
            return; // Stop if required field is empty
        }
        configToSave.push({ key, value });
    });

    const saveButton = document.getElementById("save-config-button");
    const originalButtonText = saveButton.textContent;
    saveButton.textContent = "Salvando...";
    saveButton.disabled = true;

    try {
        // Turso specific: Use a transaction to update or insert config values.
        // This assumes a simple key-value table `restaurant_config (key TEXT PRIMARY KEY, value TEXT)`
        // If your schema is different, adjust accordingly.
        // A common approach is to use INSERT OR REPLACE (UPSERT)
        const statements = configToSave.map(item => ({
            sql: "INSERT OR REPLACE INTO restaurant_config (key, value) VALUES (?, ?)",
            args: [item.key, item.value]
        }));

        if (statements.length > 0) {
            await db.batch(statements, "write"); // Use "write" mode for batch operations that modify data
            alert("Configurações salvas com sucesso!");
        } else {
            alert("Nenhuma configuração para salvar.");
        }

    } catch (error) {
        console.error("Error saving restaurant config:", error);
        alert(`Erro ao salvar configurações: ${error.message}`);
    } finally {
        saveButton.textContent = originalButtonText;
        saveButton.disabled = false;
    }
}


// Event listener for restaurant config form
document.addEventListener("DOMContentLoaded", () => {
    // ... (other DOMContentLoaded code)

    const restaurantConfigForm = document.getElementById("restaurant-config-form");
    if (restaurantConfigForm) {
        restaurantConfigForm.addEventListener("submit", saveRestaurantConfigAdmin);
    }

    // Update navigation logic to load config when section is shown
    const navLinks = document.querySelectorAll("nav .nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // ... (existing click logic)
            const targetSectionId = link.getAttribute("data-section");
            if (targetSectionId === "restaurant-config-section") {
                loadRestaurantConfigAdmin();
            }
            // ...
        });
    });

    // Initial load if config section is default active (though menu is default)
    if (document.querySelector("#restaurant-config-section.active-section")) {
        loadRestaurantConfigAdmin();
    }

    const resetConfigButton = document.getElementById("reset-config-button");
    if (resetConfigButton) {
        resetConfigButton.addEventListener("click", () => {
            if (confirm("Tem certeza que deseja recarregar as configurações? Quaisquer alterações não salvas no formulário serão perdidas.")) {
                loadRestaurantConfigAdmin(); // Reloads data from DB into the form
            }
        });
    }
});

async function loadOrdersAdmin() {
    const tableBody = document.querySelector("#orders-table tbody");
    if (!tableBody) {
        console.error("Orders table body not found!");
        return;
    }
    tableBody.innerHTML = "<tr><td colspan=\"6\">Carregando pedidos...</td></tr>";

    if (!db) {
        tableBody.innerHTML = "<tr><td colspan=\"6\" style=\"color:red;\">Erro: Conexão com banco de dados não configurada.</td></tr>";
        return;
    }

    const statusFilter = document.getElementById("order-status-filter").value;
    const dateFilter = document.getElementById("order-date-filter").value;

    let sql = `
        SELECT o.rowid as id, o.order_id, o.timestamp, o.customer_name, o.customer_phone, o.total_amount, o.status,
               o.address_street, o.address_number, o.address_complement, o.address_neighborhood, o.address_city, o.address_cep
        FROM orders o
    `;
    const params = [];
    const conditions = [];

    if (statusFilter) {
        conditions.push("o.status = ?");
        params.push(statusFilter);
    }
    if (dateFilter) {
        // Assuming timestamp is stored in a way that DATE() function can compare the date part
        conditions.push("DATE(o.timestamp) = ?");
        params.push(dateFilter);
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY o.timestamp DESC";

    try {
        const rs = await db.execute({ sql: sql, args: params });

        if (rs.rows.length === 0) {
            tableBody.innerHTML = "<tr><td colspan=\"6\">Nenhum pedido encontrado com os filtros aplicados.</td></tr>";
            return;
        }

        tableBody.innerHTML = ""; // Clear loading/empty message
        rs.rows.forEach(order => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = order.order_id;
            row.insertCell().textContent = new Date(order.timestamp).toLocaleString('pt-BR');
            row.insertCell().textContent = order.customer_name || 'N/A';
            row.insertCell().textContent = typeof order.total_amount === 'number' ? `R$ ${order.total_amount.toFixed(2)}` : 'N/A';
            row.insertCell().textContent = order.status || 'N/A';

            const actionsCell = row.insertCell();
            actionsCell.classList.add("action-buttons");
            const viewButton = document.createElement("button");
            viewButton.textContent = "Ver Detalhes";
            viewButton.onclick = () => showOrderDetails(order.id); // Pass internal rowid
            actionsCell.appendChild(viewButton);
        });
    } catch (error) {
        console.error("Error loading orders:", error);
        tableBody.innerHTML = `<tr><td colspan="6" style="color:red;">Erro ao carregar pedidos: ${error.message}</td></tr>`;
    }
}

async function showOrderDetails(orderDbId) {
    if (!db) {
        alert("Erro: Conexão com o banco de dados não configurada.");
        return;
    }
    try {
        // Fetch main order details
        const orderRs = await db.execute({
            sql: `SELECT rowid as id, order_id, timestamp, customer_name, customer_phone, total_amount, status,
                         address_street, address_number, address_complement, address_neighborhood, address_city, address_cep
                  FROM orders WHERE rowid = ?`,
            args: [orderDbId]
        });

        if (orderRs.rows.length === 0) {
            alert("Pedido não encontrado.");
            return;
        }
        const order = orderRs.rows[0];

        // Fetch order items
        const itemsRs = await db.execute({
            sql: "SELECT item_name, quantity, price_at_order FROM order_items WHERE order_id = ?",
            args: [order.order_id] // Use the public order_id to link items
        });

        document.getElementById("modal-order-id").textContent = order.order_id;
        document.getElementById("modal-order-db-id").textContent = order.id; // Store internal DB ID for status update
        document.getElementById("modal-order-timestamp").textContent = new Date(order.timestamp).toLocaleString('pt-BR');
        document.getElementById("modal-order-customer-name").textContent = order.customer_name || "Não informado";
        document.getElementById("modal-order-customer-phone").textContent = order.customer_phone || "Não informado";

        const addressParts = [
            order.address_street, order.address_number, order.address_complement,
            order.address_neighborhood, order.address_city, order.address_cep
        ].filter(part => part).join(', ');
        document.getElementById("modal-order-address").textContent = addressParts || "Não informado";

        document.getElementById("modal-order-total").textContent = typeof order.total_amount === 'number' ? order.total_amount.toFixed(2) : "N/A";

        const itemsList = document.getElementById("modal-order-items-list");
        itemsList.innerHTML = "";
        itemsRs.rows.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.quantity}x ${item.item_name} (R$ ${(item.price_at_order * item.quantity).toFixed(2)})`;
            itemsList.appendChild(li);
        });

        const statusSelect = document.getElementById("modal-order-status-select");
        statusSelect.value = order.status || "Pending";

        const modal = document.getElementById("order-details-modal");
        modal.style.display = "flex";
        // A11Y: Focus should be moved into the modal here.
        // For example, focus the close button or the status select.
        // const closeButton = modal.querySelector(".close-button");
        // if (closeButton) closeButton.focus();
        // Storing the trigger element might be needed to return focus on close.
        // window.lastFocusedElement = document.activeElement;


    } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Erro ao buscar detalhes do pedido: " + error.message);
    }
}


async function updateOrderStatus() {
    const orderDbId = document.getElementById("modal-order-db-id").textContent;
    const newStatus = document.getElementById("modal-order-status-select").value;

    if (!orderDbId || !newStatus) {
        alert("ID do pedido ou novo status inválido.");
        return;
    }
    if (!db) {
        alert("Erro: Conexão com banco de dados não configurada.");
        return;
    }
    const updateButton = document.getElementById("update-order-status-button");
    const originalButtonText = updateButton.textContent;
    updateButton.textContent = "Atualizando...";
    updateButton.disabled = true;

    try {
        await db.execute({
            sql: "UPDATE orders SET status = ? WHERE rowid = ?",
            args: [newStatus, orderDbId]
        });
        alert("Status do pedido atualizado com sucesso!");
        document.getElementById("order-details-modal").style.display = "none";
        // A11Y: Return focus to window.lastFocusedElement here, if it was stored.
        // if (window.lastFocusedElement) window.lastFocusedElement.focus();
        loadOrdersAdmin(); // Refresh the orders list
    } catch (error) {
        console.error("Error updating order status:", error);
        alert("Erro ao atualizar status do pedido: " + error.message);
    } finally {
        updateButton.textContent = originalButtonText;
        updateButton.disabled = false;
    }
}


// Event listeners for order management
document.addEventListener("DOMContentLoaded", () => {
    // ... (other DOMContentLoaded code like menu management, config management)

    const applyOrderFiltersButton = document.getElementById("apply-order-filters");
    if (applyOrderFiltersButton) {
        applyOrderFiltersButton.addEventListener("click", loadOrdersAdmin);
    }

    const updateOrderStatusButton = document.getElementById("update-order-status-button");
    if (updateOrderStatusButton) {
        updateOrderStatusButton.addEventListener("click", updateOrderStatus);
    }

    const shareOrderLinkButton = document.getElementById("share-order-link-button");
    if (shareOrderLinkButton) {
        shareOrderLinkButton.addEventListener("click", handleShareOrderLink);
    }

    // Update navigation logic to load orders when section is shown
    const navLinks = document.querySelectorAll("nav .nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // ... (existing click logic for menu and config)
            const targetSectionId = link.getAttribute("data-section");
            if (targetSectionId === "order-management-section") {
                loadOrdersAdmin(); // Load orders when this section is activated
            }
            // ...
        });
    });
    // Initial load if order management section is default active
     if (document.querySelector("#order-management-section.active-section")) {
        loadOrdersAdmin();
    }
});

function handleShareOrderLink() {
    const orderId = document.getElementById("modal-order-id").textContent;
    if (!orderId) {
        alert("ID do pedido não encontrado para gerar o link.");
        return;
    }
    // Construct the URL. Assumes admin.html is in the root like index.html.
    // If admin.html is in a subdirectory, adjust '../' or provide full path.
    const baseUrl = window.location.origin + window.location.pathname.replace(/admin\.html$/, 'index.html');
    const shareUrl = `${baseUrl}?order_id=${encodeURIComponent(orderId)}`;

    // You can enhance this to copy to clipboard
    prompt("Link compartilhável do pedido (copie manualmente):", shareUrl);
}

// --- Reporting Functions ---

function getReportDateRange() {
    let startDateStr = document.getElementById("report-start-date").value;
    let endDateStr = document.getElementById("report-end-date").value;

    // Default to today if end date is not set
    if (!endDateStr) {
        endDateStr = new Date().toISOString().split('T')[0];
    }
    // Default to 7 days ago if start date is not set
    if (!startDateStr) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(new Date().getDate() - 7); // Correctly get 7 days ago from today
        startDateStr = sevenDaysAgo.toISOString().split('T')[0];
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert("Datas inválidas selecionadas.");
        return null;
    }

    if (endDate < startDate) {
        alert("A data final não pode ser anterior à data inicial.");
        return null;
    }

    // Format for SQL: YYYY-MM-DD HH:MM:SS (start of day for startDate, end of day for endDate)
    // Turso uses ISO 8601 strings for timestamps typically.
    return {
        startDate: `${startDateStr}T00:00:00.000Z`,
        endDate: `${endDateStr}T23:59:59.999Z`
    };
}

async function generateAllReports() {
    if (!db) {
        alert("Erro: Conexão com banco de dados não configurada.");
        return;
    }
    const dateRange = getReportDateRange();
    if (!dateRange) return;

    const generateButton = document.getElementById("generate-reports-button");
    const originalButtonText = generateButton.textContent;
    generateButton.textContent = "Gerando...";
    generateButton.disabled = true;

    // Clear previous reports
    document.getElementById("sales-summary-report").innerHTML = "";
    document.getElementById("popular-items-qty-report").innerHTML = "";
    document.getElementById("popular-items-revenue-report").innerHTML = "";
    document.getElementById("sales-by-category-report").innerHTML = "";

    try {
        await generateSalesSummaryReport(dateRange);
        await generatePopularItemsQtyReport(dateRange);
        await generatePopularItemsRevenueReport(dateRange);
        await generateSalesByCategoryReport(dateRange);
    } catch (error) {
        console.error("Error generating reports:", error);
        // Specific error messages are shown by individual report functions
        // alert("Ocorreu um erro ao gerar os relatórios: " + error.message);
    } finally {
        generateButton.textContent = originalButtonText;
        generateButton.disabled = false;
    }
}

async function generateSalesSummaryReport(dateRange) {
    const outputDiv = document.getElementById("sales-summary-report");
    outputDiv.innerHTML = "<p>Carregando sumário de vendas...</p>"; // Double quotes okay
    try {
        const rs = await db.execute({
            sql: `SELECT COUNT(order_id) as total_orders, SUM(total_amount) as total_revenue
                  FROM orders
                  WHERE timestamp >= ? AND timestamp <= ? AND status != 'Cancelled'`,
            args: [dateRange.startDate, dateRange.endDate]
        });
        if (rs.rows.length > 0 && rs.rows[0].total_orders > 0) {
            const data = rs.rows[0];
            const avgOrderValue = data.total_orders > 0 ? (data.total_revenue / data.total_orders) : 0;
            outputDiv.innerHTML = `
                <p><strong>Total de Pedidos:</strong> ${data.total_orders}</p>
                <p><strong>Receita Total:</strong> R$ ${data.total_revenue ? data.total_revenue.toFixed(2) : '0.00'}</p>
                <p><strong>Ticket Médio:</strong> R$ ${avgOrderValue.toFixed(2)}</p>
            `;
        } else {
            outputDiv.innerHTML = "<p>Nenhum dado de venda encontrado para o período.</p>";
        }
    } catch (error) {
        console.error("Error in Sales Summary Report:", error);
        outputDiv.innerHTML = `<p style="color:red;">Erro ao gerar sumário de vendas: ${error.message}</p>`;
        throw error;
    }
}

async function generatePopularItemsQtyReport(dateRange) {
    const outputDiv = document.getElementById("popular-items-qty-report");
    outputDiv.innerHTML = "<p>Carregando itens mais vendidos (quantidade)...</p>"; // Double quotes okay
    try {
        const rs = await db.execute({
            sql: `SELECT oi.item_name, SUM(oi.quantity) as total_quantity
                  FROM order_items oi
                  JOIN orders o ON oi.order_id = o.order_id
                  WHERE o.timestamp >= ? AND o.timestamp <= ? AND o.status != 'Cancelled'
                  GROUP BY oi.item_name
                  ORDER BY total_quantity DESC
                  LIMIT 10`,
            args: [dateRange.startDate, dateRange.endDate]
        });
        if (rs.rows.length > 0) {
            let html = "<table><thead><tr><th>Item</th><th>Quantidade Vendida</th></tr></thead><tbody>";
            rs.rows.forEach(row => {
                html += `<tr><td>${row.item_name}</td><td>${row.total_quantity}</td></tr>`;
            });
            html += "</tbody></table>";
            outputDiv.innerHTML = html;
        } else {
            outputDiv.innerHTML = "<p>Nenhum item vendido encontrado para o período.</p>";
        }
    } catch (error) {
        console.error("Error in Popular Items (Qty) Report:", error);
        outputDiv.innerHTML = `<p style="color:red;">Erro ao gerar relatório de itens por quantidade: ${error.message}</p>`;
        throw error;
    }
}

async function generatePopularItemsRevenueReport(dateRange) {
    const outputDiv = document.getElementById("popular-items-revenue-report");
    outputDiv.innerHTML = "<p>Carregando itens mais vendidos (receita)...</p>"; // Double quotes okay
    try {
        const rs = await db.execute({
            sql: `SELECT oi.item_name, SUM(oi.quantity * oi.price_at_order) as item_revenue
                  FROM order_items oi
                  JOIN orders o ON oi.order_id = o.order_id
                  WHERE o.timestamp >= ? AND o.timestamp <= ? AND o.status != 'Cancelled'
                  GROUP BY oi.item_name
                  ORDER BY item_revenue DESC
                  LIMIT 10`,
            args: [dateRange.startDate, dateRange.endDate]
        });
        if (rs.rows.length > 0) {
            let html = "<table><thead><tr><th>Item</th><th>Receita Gerada</th></tr></thead><tbody>";
            rs.rows.forEach(row => {
                html += `<tr><td>${row.item_name}</td><td>R$ ${row.item_revenue ? row.item_revenue.toFixed(2) : '0.00'}</td></tr>`;
            });
            html += "</tbody></table>";
            outputDiv.innerHTML = html;
        } else {
            outputDiv.innerHTML = "<p>Nenhum item vendido encontrado para o período.</p>";
        }
    } catch (error) {
        console.error("Error in Popular Items (Revenue) Report:", error);
        outputDiv.innerHTML = `<p style="color:red;">Erro ao gerar relatório de itens por receita: ${error.message}</p>`;
        throw error;
    }
}

async function generateSalesByCategoryReport(dateRange) {
    const outputDiv = document.getElementById("sales-by-category-report");
    outputDiv.innerHTML = "<p>Carregando vendas por categoria...</p>"; // Double quotes okay
    try {
        const rs = await db.execute({
            sql: \`SELECT mi.categoria, SUM(oi.quantity * oi.price_at_order) as category_revenue
                  FROM order_items oi
                  JOIN orders o ON oi.order_id = o.order_id
                  LEFT JOIN menu_items mi ON oi.item_name = mi.nome
                  WHERE o.timestamp >= ? AND o.timestamp <= ? AND o.status != 'Cancelled'
                  GROUP BY mi.categoria
                  ORDER BY category_revenue DESC\`,
            args: [dateRange.startDate, dateRange.endDate]
        });

        if (rs.rows.length > 0) {
            let html = "<table><thead><tr><th>Categoria</th><th>Receita Gerada</th></tr></thead><tbody>";
            rs.rows.forEach(row => {
                // Handle cases where category might be null if an item in order_items no longer exists in menu_items
                const categoryName = row.categoria || "Categoria Desconhecida/Removida";
                html += \`<tr><td>\${categoryName}</td><td>R$ \${row.category_revenue ? row.category_revenue.toFixed(2) : '0.00'}</td></tr>\`;
            });
            html += "</tbody></table>";
            outputDiv.innerHTML = html;
        } else {
            outputDiv.innerHTML = "<p>Nenhuma venda por categoria encontrada para o período.</p>";
        }
    } catch (error) {
        console.error("Error in Sales by Category Report:", error);
        outputDiv.innerHTML = \`<p style="color:red;">Erro ao gerar relatório de vendas por categoria: \${error.message}.</p>\`;
        throw error;
    }
}

// Add event listener for the reports button in DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // ... existing listeners ...

    const generateReportsButton = document.getElementById("generate-reports-button");
    if (generateReportsButton) {
        generateReportsButton.addEventListener("click", generateAllReports);
    }

    // Activate reports tab if it's the one linked in URL hash
    if (window.location.hash === "#reports") {
        const reportLink = document.querySelector('nav .nav-link[data-section="reports-section"]');
        if (reportLink) {
            reportLink.click(); // Simulate click to activate section and load data if needed
        }
    }
     // Ensure reports are loaded if the reports section is active on page load (e.g. due to hash)
    if (document.querySelector("#reports-section.active-section")) {
        // Perhaps set default dates and generate reports, or prompt user
        // For now, it will wait for button click.
    }
});
