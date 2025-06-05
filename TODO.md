# TODO - Tembiu App

This TODO list is derived from the project's `README.md` and aims to guide development.

## Phase 1: Implement Core v1.0 Functionality (from README)

- [~] **Task:** Basic responsive template and menu loading.
    - **Details:** HTML structure, CSS styling, JavaScript for fetching, parsing, and displaying `menu.csv`. Interactive menu items with "add to cart" functionality. Basic cart display (items and total with quantity). Functional item removal from cart. CSS media queries added for improved responsiveness across screen sizes. **Header now dynamically displays `restaurantConfig.name`.**
    - **Status:** Initial structure and functionality implemented. Cart quantity handling and item removal added. Responsiveness improved. Dynamic restaurant name in header. Further UI refinements may be needed.
    - **Rationale:** Foundation for all other v1.0 features.
- [x] **Task:** PIX Integration (Placeholder/Conceptual). 
    - **Details:** UI elements for PIX display are in place. `handleCheckout` now uses `qrcode.js` to generate a real client-side QR code. **PIX data string structure refined to follow custom format from README.md (using configured phone for 'Tel').**
    - **Status:** Client-side QR code generation implemented with refined data structure.
    - **Rationale:** Core payment method for the app.
- [~] **Task:** WhatsApp Integration (Placeholder/Conceptual). 
    - **Details:** WhatsApp share button UI is in place. `handleWhatsAppShare` formats cart data and opens a `wa.me` link. **Client-side `restaurantConfig` (name, phone) added and used in message and `wa.me` link.**
    - **Status:** JS logic for `wa.me` link and basic config implemented. Further enhancements could include UI for config.
    - **Rationale:** Core communication method for orders.
- [x] **Task:** Basic PWA Features.
    - **Sub-Task:** [x] Create and link `manifest.json`.
    - **Sub-Task:** [x] Implement basic service worker for offline caching of static assets.
    - **Rationale:** Improves user experience with app-like features and offline access, as per v1.0.
- [x] **Task:** Smart History (Conceptual).
    - **Details:** Orders are saved to LocalStorage after simulated payment (now with quantities). Past orders (with quantities) are displayed with a functional "Order Again" button that repopulates the cart. Cart is cleared after checkout.
    - **Status:** Basic LocalStorage save/load and UI implemented. "Order Again" is functional.
    - **Rationale:** Key usability feature for repeat customers.

- [x] **Task:** Set up Local Development Environment.
    - **Details:** Documentation created in `docs/local_development_setup.md`. Documented and tested the steps for setting up a local development environment (as per `README.md`'s "Clone Local" option). Ensured it's easy for new contributors to get started.
    - **Rationale:** Essential for any further development or contributions.

## Phase 2: Roadmap Implementation (Next Steps from README)

- [x] **Task:** Begin v1.1 - Google Apps Script Integration (Backend).
    - **Sub-Task:** [x] Design basic Google Apps Script structure for backend logic (e.g., handling orders, analytics). (Implemented in `backend/google_apps_script_backend.gs.js` and `js/main.js` updated).
    - **Sub-Task:** [x] Implement a function in GAS to log new orders to a Google Sheet. (Completed in `backend/google_apps_script_backend.gs.js`).
    - **Sub-Task:** [x] Document how to set up and deploy this GAS backend. (Documentation created in `docs/google_apps_script_setup.md`).
    - **Rationale:** This is the first unchecked major item in the `README.md` roadmap (v1.1) and adds significant value through data persistence and automation.
- [ ] **Task:** Build Administrative Dashboard.
    - **Details:** Use Google Apps Script or Google Data Studio to visualize orders and key metrics from the spreadsheet.
    - **Rationale:** Gives restaurant owners real-time insights into sales.
- [ ] **Task:** Implement Automated Email Notifications.
    - **Details:** Configure GAS to send order confirmations or periodic summaries via email.
    - **Rationale:** Streamlines communication with customers and staff.
- [ ] **Task:** Generate Sales Reports.
    - **Details:** Add GAS functions to compile daily or weekly sales reports from logged orders.
    - **Rationale:** Facilitates performance tracking and inventory planning.
- [ ] **Task:** Provide Webhook Endpoints for Integrations.
    - **Details:** Expose simple GAS webhooks so external systems can receive new order data.
    - **Rationale:** Enables integration with other services and automation tools.
- [ ] **Task:** Research Open Source Store Frameworks.
    - **Details:** Evaluate solutions like WooCommerce, Magento Open Source, PrestaShop, OpenCart e Odoo.
    - **Rationale:** Identificar recursos que possamos reutilizar ou integrar mantendo o espírito open source.
- [ ] **Task:** Integrar Pagamento via Google Pay.
    - **Details:** Adicionar botão Google Pay no front-end utilizando a API `google.payments.api`.
    - **Rationale:** Oferecer uma alternativa de pagamento digital amplamente usada.
- [~] **Task:** Refine `menu.csv` and `menu.json` examples and documentation.
    - **Sub-Task:** [x] Main `README.md`'s `menu.csv` example refined and linked to detailed guide in `docs/README.md#configuration`.
    - **Sub-Task:** [x] Provide a sample `menu.json` file in the repository (e.g., `menu_example.json`).
    - **Sub-Task:** [x] Document the structure and usage of `menu.json` in `docs/README.md` (filling the placeholder).

    - **Sub-Task:** [x] Implement or verify client-side logic in `js/main.js` to load and parse `menu.json` if `menu.csv` is not found or if a configuration points to JSON.

    - **Rationale:** Crucial for new users to quickly understand how to configure their menus using either format.
- [~] **Task:** Review and Enhance Documentation (`docs/`).
    - **Sub-Task:** [x] Initial `docs/README.md` created. Menu (`menu.csv`) and basic Restaurant Settings configuration sections populated with details.
    - **Sub-Task:** [x] Local development setup guide created (`docs/local_development_setup.md`).
    - **Sub-Task:** [x] Google Apps Script setup guide created (`docs/google_apps_script_setup.md`).
    - **Sub-Task:** [x] Populate placeholder sections in `docs/README.md`: "Getting Started," "Features" (detailing existing ones like PWA, PIX, WhatsApp, History), "Technical Architecture," "Contributing," and "Troubleshooting."
    - **Sub-Task:** [x] Ensure all documentation links are correct and working.
    - **Rationale:** Comprehensive and clear documentation is key for user adoption and contributions.

- [x] **Task:** Refine UI/UX for Core Features. 
    - **Details:** Improve visual hierarchy and spacing of menu, cart, PIX display, and order history. Ensure better responsiveness. Add loading indicators. Design user-friendly quantity management in cart. **[Cart quantity handling implemented. CSS active styles for button feedback added. Placeholder 'Remover' buttons added to cart items, now fully functional. Dynamic display of restaurant name in header implemented.]**
    - **Rationale:** Enhance usability and align with the "premium experience" goal from `README.md`.
- [x] **Task:** Implement Real PIX QR Code Generation (Client-Side). 
    - **Details:** Integrated `qrcode.js` library (via CDN). `handleCheckout` now generates a real QR code image/canvas using a structured PIX data string (simulated BR Code: Phone, Order ID, Items, Location placeholder). CSS for QR display updated.
    - **Rationale:** Move PIX feature from placeholder to a functional (client-side) state.
- [x] **Task:** Develop WhatsApp Web Intent Integration. 
    - **Details:** `handleWhatsAppShare` constructs and opens a `https://wa.me/` URL with the pre-filled order message (including quantities) for sharing.
    - **Rationale:** Make WhatsApp sharing functional, improving restaurant communication.
- [x] **Task:** Enhance "Order Again" Functionality. 
    - **Details:** Modify `handleOrderAgain` to repopulate the current cart with items from a selected past order. Provide user feedback.
    - **Rationale:** Make the "Smart History" feature more useful for re-ordering.

## Phase 3: Feature Enhancements (Derived from README and Project Goals)

- [ ] **Task:** Implement Shareable Order URLs (v1.x).
    - **Sub-Task:** Design URL structure and data encoding/decoding mechanism (e.g., Base64 or JSON compressed in URL params).
    - **Sub-Task:** Implement client-side logic in `js/main.js` to generate a shareable URL upon order completion/checkout.
    - **Sub-Task:** Develop a mechanism or page (potentially reusing `index.html` with specific URL params) to display a read-only summary of an order when accessed via a shareable URL.
    - **Sub-Task:** Add UI elements for copying/sharing the generated URL.
    - **Rationale:** Key unique feature mentioned in README, enhances professionalism and sharing.
- [ ] **Task:** Basic Smart Scheduling System - Phase 1 (v1.x).
    - **Sub-Task:** Add restaurant open/close times and timezone to `restaurantConfig` in `js/main.js`.
    - **Sub-Task:** Implement logic in `js/main.js` to display a simple "Open" / "Closed" status based on current time and configured hours.
    - **Sub-Task:** (Future) Consider disabling "Add to Cart" or "Checkout" if closed, or allow pre-orders.
    - **Rationale:** First step towards "Sistema de Horários Inteligente" from README. Full Google Maps integration is a larger future phase.
- [ ] **Task:** Implement Basic Contextual Item Suggestions (v1.x).
    - **Sub-Task:** When an item is added to cart, check order history (localStorage) for frequently co-ordered items.
    - **Sub-Task:** If a pattern is found (e.g., "Pizza often ordered with Coke"), display a simple non-intrusive suggestion (e.g., a toast message or a small section below cart).
    - **Sub-Task:** Ensure this is lightweight and doesn't overly complicate the UI.
    - **Rationale:** Initial step for "Sugestões por IA" from README.
- [ ] **Task:** Implement Dark/Light Mode Theme Toggle (v1.x).
    - **Sub-Task:** Define CSS variables for color schemes (light and dark).
    - **Sub-Task:** Add a UI toggle (e.g., in the header or footer).
    - **Sub-Task:** Implement JS to switch themes and save user preference in localStorage.
    - **Rationale:** UI/UX enhancement listed in README.
- [ ] **Task:** Implement "Clear Order History" Button (v1.x).
    - **Sub-Task:** Add a "Clear History" button to the order history section in `index.html`.
    - **Sub-Task:** Implement `handleClearHistory()` function in `js/main.js` to remove `tembiuOrderHistory` from localStorage and update the UI.
    - **Sub-Task:** Add a confirmation prompt before clearing.
    - **Rationale:** Fulfills "Direito ao esquecimento" mentioned in README.
- [ ] **Task:** Display Basic Client-Side Analytics (v1.x).
    - **Sub-Task:** Create a new section/modal in `index.html` for analytics.
    - **Sub-Task:** In `js/main.js`, add functions to calculate and display simple metrics from `localStorage` order history:
        - Total number of orders made.
        - Average order value.
        - List of most frequently ordered items.
    - **Sub-Task:** Ensure this data is presented clearly.
    - **Rationale:** Provides insights for the restaurant owner as per README.

- [ ] **Task:** Implement Client-Side Menu Search Functionality.
    - **Details:** Wire up the search input (`#menu-search`) to filter items conforme o usuário digita.
    - **Rationale:** Facilita encontrar pratos rapidamente.
- [ ] **Task:** Implement Client-Side Category Filtering.
    - **Details:** Permitir filtragem por categoria usando botões gerados do cardápio.
    - **Rationale:** Melhora a navegação entre diferentes tipos de itens.

## Future Phases (High-Level from README Roadmap)

- [ ] Implement v1.2 - PWA Avançado (Push notifications, advanced offline, geolocation, A11Y).
- [ ] Implement v1.3 - Pagamentos Híbridos (Advanced PIX, card machine, loyalty points).
- [ ] Explore v2.0 - Marketplace (Premium templates, plugins).
- [ ] Develop v2.1 - IA Avançada (Chatbot, ML recommendations).
- [ ] Build v3.0 - Ecossistema (Multi-restaurant, API, delivery integration).

**Note on `[~]`:** Indicates task is partially complete or in progress.
