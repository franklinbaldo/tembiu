# Manual Testing Checklist for Tembiu

This checklist is designed to help manually test the core features of the Tembiu application, including both the customer-facing interface (`index.html`) and the administrative panel (`admin.html`).

**Prerequisites:**
*   A local web server running the Tembiu project.
*   Turso database configured with the necessary schema (`menu_items`, `restaurant_config`, `orders`, `order_items`).
*   `js/main.js` and `js/admin.js` updated with **your actual Turso URL and Auth Token**.
*   The Content Security Policy (CSP) placeholder `YOUR_TURSO_DATABASE_HOSTNAME_HERE` in `index.html` and `admin.html` **must be replaced** with your actual Turso database hostname (e.g., `your-db-name.turso.io`) for database connections to work with CSP enabled.

## I. Customer Interface (`index.html`) Tests

### 1. Initial Page Load & Basic UI
- [ ] **Test**: Open `index.html`.
    - **Expected**: Restaurant name (from Turso config) displays correctly in the header.
    - **Expected**: Menu items (from Turso `menu_items` table) load and display correctly.
    - **Expected**: "Open/Closed" status displays based on configured hours.
- [ ] **Test**: Theme Toggle (Dark/Light Mode).
    - **Expected**: Clicking the theme toggle button changes the theme.
    - **Expected**: Theme preference is saved in `localStorage` and persists on page reload.

### 2. Menu Interaction
- [ ] **Test**: Menu Item Search.
    - **Expected**: Typing in the search bar filters menu items by name and description.
- [ ] **Test**: Category Filtering.
    - **Expected**: Clicking category buttons filters menu items by the selected category. Clicking "Todos" shows all items.
- [ ] **Test**: Adding Items to Cart.
    - **Expected**: Clicking "Adicionar" on a menu item adds it to the cart.
    - **Expected**: Cart display updates with item, quantity (1), and correct subtotal.
    - **Expected**: Total cart value updates correctly.
    - **Expected**: Adding the same item multiple times increments its quantity in the cart.
- [ ] **Test**: Item Suggestions (if data exists to generate them).
    - **Expected**: After adding an item, relevant suggestions appear below the cart (if co-ordering patterns exist in past orders).
    - **Expected**: Clicking "Adicionar" on a suggested item adds it to the cart.
    - **Expected**: Suggestions do not include items already in the cart.
- [ ] **Test**: Removing Items from Cart.
    - **Expected**: Clicking "Remover" on a cart item with quantity > 1 decrements its quantity.
    - **Expected**: Clicking "Remover" on a cart item with quantity = 1 removes the item entirely.
    - **Expected**: Cart display and total update correctly.

### 3. Checkout Process
- [ ] **Test**: Initiate Checkout with an empty cart.
    - **Expected**: An alert/message prevents checkout.
- [ ] **Test**: Initiate Checkout with items in cart.
    - **Expected**: If no address is saved, the address form is displayed. Cart section is hidden.
- [ ] **Test**: Address Form Submission.
    *   Fill out all required address fields and the (conceptual) email field.
    *   Click "Salvar Endereço".
    - **Expected**: Address is saved to `localStorage`.
    - **Expected**: PIX display and Google Pay button (if configured) become visible. Address form is hidden.
- [ ] **Test**: PIX Display.
    - **Expected**: QR Code for PIX payment is generated and displayed.
    *   Verify the QR code contains reasonable data if scanned (restaurant name, order ID concept, total).
    - **Expected**: "Copia e Cola" PIX code is displayed and matches QR data concept.
- [ ] **Test**: Google Pay Button (User must have Google Pay configured in their browser).
    - **Expected**: Google Pay button is displayed.
    - **Expected**: Clicking it initiates the Google Pay flow (actual payment processing is beyond this test).
- [ ] **Test**: (Simulated) Payment Confirmation.
    *   Click "Confirmar Pagamento (Simulado)".
    - **Expected**: Order data (items, total, address, customer email - if collected and saved) is sent to Turso `orders` and `order_items` tables with "Pending" status. (Verify in DB or Admin Panel).
    - **Expected**: Order is saved to local browser history.
    - **Expected**: Cart is cleared.
    - **Expected**: User sees a confirmation message.
    - **Expected**: PIX/Google Pay sections are hidden, cart is shown as empty.

### 4. Order History & Analytics
- [ ] **Test**: View Order History (after placing some orders).
    - **Expected**: Past orders are listed with timestamp, items, quantities, and total.
- [ ] **Test**: "Order Again" Functionality.
    *   Click "Pedir Novamente" on a past order.
    - **Expected**: Items from that past order are added to the current cart with correct quantities.
    - **Expected**: User is alerted, and cart display updates.
- [ ] **Test**: Clear Order History.
    *   Click "Limpar Histórico". Confirm the action.
    - **Expected**: Order history is cleared from `localStorage` and UI.
- [ ] **Test**: Client-Side Analytics.
    - **Expected**: "Estatísticas" section displays total orders, average value, and top items based on local history.

### 5. Sharing & External Links
- [ ] **Test**: WhatsApp Share.
    *   With items in cart and address saved, click "Compartilhar Pedido no WhatsApp".
    - **Expected**: A new tab opens with `wa.me` URL, pre-filled with restaurant's configured phone number and a formatted order message (items, total, address).
- [ ] **Test**: View Shared Order URL.
    *   Manually construct or use a link from Admin Panel: `index.html?order_id=<VALID_ORDER_ID>`.
    - **Expected**: Page loads displaying only the summary for the specified order (ID, date, status, total, items, address).
    - **Expected**: Other sections (menu, cart, regular header) are hidden.
    - **Expected**: "Voltar ao Cardápio" button works.

## II. Admin Panel (`admin.html`) Tests

### 1. Access & Navigation
- [ ] **Test**: Open `admin.html`.
    - **Expected**: Admin panel loads. Default "Gerenciar Cardápio" section is active.
    - **Expected**: If Turso is not configured in `js/admin.js`, a warning message appears.
- [ ] **Test**: Navigation Links.
    - **Expected**: Clicking nav links (Gerenciar Cardápio, Configurações, Gerenciar Pedidos, Relatórios) correctly switches the active section.
    - **Expected**: Data for the active section loads (e.g., menu items for "Gerenciar Cardápio").
- [ ] **Test**: URL Hash Navigation.
    *   Open `admin.html#orders-management` (or other section hash).
    - **Expected**: The correct section is displayed and its data is loaded.

### 2. Menu Management
- [ ] **Test**: View Menu Items.
    - **Expected**: Table lists all menu items from Turso.
- [ ] **Test**: Search Menu Items.
    - **Expected**: Typing in search filters the table by item name/category.
- [ ] **Test**: Add New Menu Item.
    *   Fill all fields (name, category, price, description, emoji, available). Click "Salvar Item".
    - **Expected**: Item is added to Turso. Table updates. Form clears. Success message.
    - **Expected**: Verify on `index.html` (after refresh) that the new item appears/is hidden based on "Disponível" status.
- [ ] **Test**: Edit Existing Menu Item.
    *   Click "Editar". Modify data (e.g., price, availability). Click "Atualizar Item".
    - **Expected**: Item is updated in Turso. Table updates. Form clears. Success message.
    - **Expected**: Verify changes on `index.html`.
- [ ] **Test**: Clear Menu Item Form.
    *   Type in form. Click "Limpar Formulário".
    - **Expected**: Form fields are reset.
- [ ] **Test**: Delete Menu Item.
    *   Click "Excluir". Confirm.
    - **Expected**: Item is removed from Turso. Table updates. Success message.
    - **Expected**: Verify item is gone from `index.html`.

### 3. Restaurant Configuration
- [ ] **Test**: View Configurations.
    - **Expected**: Form is populated with current settings from Turso.
- [ ] **Test**: Modify and Save Configurations.
    *   Change restaurant name, phone, open/close times, Google Place ID, notification email. Click "Salvar Configurações".
    - **Expected**: Settings are saved to Turso. Success message.
    - **Expected**: Verify impact on `index.html` (e.g., header name, WhatsApp number, open/closed status if manual hours changed).
- [ ] **Test**: Reload Current Configurations.
    *   Change a value in the form (do not save). Click "Recarregar Configurações Atuais". Confirm.
    - **Expected**: Form reverts to the currently saved values from Turso.

### 4. Order Management
- [ ] **Test**: View Orders.
    - **Expected**: Table lists orders from Turso.
- [ ] **Test**: Filter Orders.
    *   Filter by a specific status (e.g., "Pending"). Click "Aplicar Filtros".
    - **Expected**: Table updates to show only matching orders.
    *   Filter by a specific date. Click "Aplicar Filtros".
    - **Expected**: Table updates.
    *   Combine status and date filters.
    - **Expected**: Table updates.
- [ ] **Test**: View Order Details.
    *   Click "Ver Detalhes" for an order.
    - **Expected**: Modal appears with correct order ID, timestamp, customer info, address, total, items, and current status selected in dropdown.
- [ ] **Test**: Update Order Status.
    *   In modal, select a new status from dropdown. Click "Atualizar Status".
    - **Expected**: Status is updated in Turso. Modal closes. Order list refreshes with new status. Success message.
- [ ] **Test**: Share Order Link (from Admin).
    *   In modal, click "Compartilhar Link do Pedido".
    - **Expected**: A prompt appears with a shareable URL (`index.html?order_id=...`).
    - **Expected**: Opening this URL in a new tab shows the order summary (as tested in I.5).

### 5. Reports
- [ ] **Test**: Generate Reports with Default Date Range (last 7 days to today).
    *   Navigate to "Relatórios". Click "Gerar Relatórios".
    - **Expected**: All report sections (Sales Summary, Popular Items Qty, Popular Items Revenue, Sales by Category) populate with data or "No data" messages.
    - **Expected**: Data should appear plausible based on test orders.
- [ ] **Test**: Generate Reports with Custom Date Range.
    *   Select a specific start and end date. Click "Gerar Relatórios".
    - **Expected**: Reports update for the selected period.
- [ ] **Test**: Generate Reports with Invalid Date Range (end before start).
    - **Expected**: An alert message appears. No reports are generated.
- [ ] **Test**: Sales by Category Report Data.
    - **Expected**: Categories from `menu_items` are correctly associated with sales from `order_items`. (Requires `menu_items` to be populated and items sold).

## III. Cross-Cutting Concerns

- [ ] **Test**: Responsiveness.
    *   Resize browser window to simulate different screen sizes (desktop, tablet, mobile).
    - **Expected**: Both `index.html` and `admin.html` layouts adjust and remain usable. Content should not be cut off or jumbled.
- [ ] **Test**: Content Security Policy (CSP).
    *   Open browser developer console.
    - **Expected**: No CSP violation errors related to loading scripts, styles, images, or connecting to Turso (assuming `YOUR_TURSO_DATABASE_HOSTNAME_HERE` was correctly replaced).
    - **Expected**: All functionalities (QR code, Google Pay, Turso connections) still work.
- [ ] **Test**: General Error Handling.
    *   (If possible/safe) Simulate network offline temporarily while an action is pending.
    *   Try invalid inputs where client-side validation might be missing.
    - **Expected**: Application handles errors gracefully, shows informative messages (to user or console), and doesn't crash.

---

This checklist provides a comprehensive set of manual tests. Mark each test as passed or failed, and note any issues found.
