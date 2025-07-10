# TODO - Tembiu App

This TODO list is derived from the project's `README.md` and aims to guide development.
The application now uses **Turso** as its primary backend for menu, configuration, and order data, managed via a new **Admin Panel (`admin.html`)**.

## Phase 1: Core v1.0 Functionality (Mostly Complete, Evolved with Turso)

- [x] **Task:** Basic responsive template and menu loading.
  - **Details:** HTML structure, CSS styling. JavaScript now fetches menu from **Turso DB**. Interactive menu items with "add to cart" functionality. Basic cart display (items and total with quantity). Functional item removal from cart. CSS media queries for responsiveness. Header dynamically displays restaurant name from **Turso config**.
  - **Status:** Core functionality implemented and stable. Menu and config are database-driven.
- [x] **Task:** PIX Integration.
  - **Details:** Implemented `gerarPixCopiaECola` and `generateAndDisplayPix` for BR Code compliant QR generation. Uses restaurant details from **Turso config**.
  - **Status:** PIX QR code and copia e cola seguem o padrão oficial BR Code.
- [x] **Task:** Coleta de Endereço de Entrega.
  - **Details:** Formulário simples em `index.html` salva o endereço em `localStorage`. Endereço is included in order data sent to **Turso DB**.
  - **Status:** Endereço incluído no pedido e na mensagem do WhatsApp.
- [x] **Task:** WhatsApp Integration.
  - **Details:** WhatsApp share button UI is in place. `handleWhatsAppShare` formats cart data (including address) and opens a `wa.me` link using phone number from **Turso config**.
  - **Status:** Functional.
- [x] **Task:** Basic PWA Features.
  - **Sub-Task:** [x] Create and link `manifest.json`.
  - **Sub-Task:** [x] Implement basic service worker for offline caching of static assets.
  - **Rationale:** Improves user experience with app-like features and offline access.
- [x] **Task:** Smart History (Local).
  - **Details:** Orders are saved to LocalStorage after simulated payment. Past orders are displayed with a functional "Order Again" button. Cart is cleared after checkout.
  - **Status:** Functional for client-side history.
- [x] **Task:** Set up Local Development Environment.
  - **Details:** Documentation created in `docs/local_development_setup.md`.
  - **Rationale:** Essential for any further development or contributions.
- [x] **Task:** Security Hardening (Client-Side).
  - **Details:** Added Content Security Policy (CSP) headers to `index.html` and `admin.html`. Refactored some DOM manipulation to prefer `textContent` over `innerHTML` where appropriate.
  - **Status:** Basic CSP implemented. User needs to configure Turso hostname in CSP.
- [x] **Task:** UI/UX Refinements for Admin Panel.
  - **Details:** Implemented button disabling/text changes during async operations. Added loading states. Consolidated `DOMContentLoaded` logic. Added reset button to config form.
  - **Status:** Completed for current scope.

## Phase 2: Backend, Admin Panel & Advanced Features (Turso-based)

- [x] **Task:** Implement Turso Backend Integration.
  - **Details:** Replaced CSV/GAS with Turso for menu, restaurant configuration, and order persistence. `js/main.js` and new `js/admin.js` interact directly with Turso.
  - **Status:** Core integration complete.
- [x] **Task:** Build Administrative Dashboard (`admin.html`).
  - **Sub-Task:** [x] Menu Management (CRUD operations via Turso).
  - **Sub-Task:** [x] Restaurant Configuration Management (edit settings stored in Turso).
  - **Sub-Task:** [x] Order Management (View orders from Turso, filter by status/date, update order status).
  - **Rationale:** Empowers restaurant owners with direct control over their digital menu and operations.
- [x] **Task:** Generate Sales Reports (Admin Panel).
  - **Details:** Implemented basic sales reports in `admin.html` (Sales Summary, Popular Items by Qty/Revenue, Sales by Category) querying Turso data.
  - **Rationale:** Provides insights into sales performance.
- [x] **Task:** Implement Shareable Order URLs.
  - **Details:** Generated URLs (`index.html?order_id=<ID>`) display a read-only summary of a specific order fetched from Turso. Share button in admin panel.
  - **Status:** Implemented.
- [x] **Task:** Basic Smart Scheduling System - Phase 1 (Manual Config).
  - **Details:** Restaurant open/close times and timezone configured via Admin Panel (Turso `restaurant_config`) and used by `js/main.js` to display "Open" / "Closed" status.
  - **Status:** Implemented.
- [~] **Task:** Smart Scheduling System - Phase 2 (Google Maps Integration - Conceptual).
  - **Details:** Conceptual design for integrating Google Places API (via serverless proxy) to fetch real-time hours. Added `googlePlaceId` to admin config.
  - **Status:** Documented in `docs/google_maps_scheduling_conceptual.md`. No live code.
- [x] **Task:** Implement Basic Contextual Item Suggestions.
  - **Details:** When an item is added to cart, `js/main.js` queries Turso for frequently co-ordered items and displays simple suggestions.
  - **Status:** Implemented.
- [~] **Task:** Implement Automated Email Notifications (Conceptual).
  - **Details:** Conceptual design for using a serverless function and email service (e.g., Resend) for order confirmations and restaurant notifications. Added placeholder email fields.
  - **Status:** Documented in `docs/automated_email_notifications_conceptual.md`. No live code.
- [ ] **Task:** Provide Webhook Endpoints for Integrations (Conceptual for Turso).
  - **Details:** (Future) Research how to trigger or expose data from Turso for external integrations, likely via serverless functions.
  - **Rationale:** Enables integration with other services.
- [ ] **Task:** Research Open Source Store Frameworks.
  - **Details:** Evaluate solutions like WooCommerce, Magento Open Source, PrestaShop, OpenCart e Odoo.
  - **Rationale:** Identificar recursos que possamos reutilizar ou integrar mantendo o espírito open source. (Low priority given current custom path).
- [x] **Task:** Integrar Pagamento via Google Pay.
  - **Details:** Google Pay button integration present in `index.html` and `js/google_pay.js`.
  - **Status:** Client-side integration exists. User configuration needed.
- [~] **Task:** Refine Menu Data Structure (Now Database Schema).
  - **Details:** Menu structure is now defined by the `menu_items` table in Turso (name, category, price, description, emoji, available).
  - **Status:** Schema defined and used. Documentation on schema could be added.
- [x] **Task:** Review and Enhance Documentation (`docs/`).
  - **Sub-Task:** [x] `docs/local_development_setup.md` (Exists).
  - **Sub-Task:** [x] `docs/google_apps_script_setup.md` (Exists, but less relevant now).
  - **Sub-Task:** [x] `docs/admin_panel_guide.md` (NEW - How to use the new admin panel).
  - **Sub-Task:** [x] `docs/manual_testing_checklist.md` (NEW - For testing current features).
  - **Sub-Task:** [x] `docs/push_notifications_conceptual.md` (NEW - Conceptual design).
  - **Sub-Task:** [x] `docs/google_maps_scheduling_conceptual.md` (NEW - Conceptual design).
  - **Sub-Task:** [x] `docs/automated_email_notifications_conceptual.md` (NEW - Conceptual design).
  - **Sub-Task:** [ ] Update main `docs/README.md` and other general docs to reflect Turso architecture.
  - **Rationale:** Comprehensive and clear documentation is key.

- [x] **Task:** Refine UI/UX for Core Features (Ongoing).
  - **Details:** Ongoing improvements to main UI and admin panel.
- [x] **Task:** Implement Real PIX QR Code Generation (Client-Side).
  - **Status:** Functional.
- [x] **Task:** Develop WhatsApp Web Intent Integration.
  - **Status:** Functional.
- [x] **Task:** Enhance "Order Again" Functionality.
  - **Status:** Functional.
- [x] **Task:** Implement Dark/Light Mode Theme Toggle.
  - **Status:** Functional.
- [x] **Task:** Implement "Clear Order History" Button.
  - **Status:** Functional.
- [x] **Task:** Display Basic Client-Side Analytics.
  - **Status:** Functional (based on localStorage history).
- [x] **Task:** Implement Client-Side Menu Search Functionality.
  - **Status:** Functional.
- [x] **Task:** Implement Client-Side Category Filtering.
  - **Status:** Functional.

## Phase 3: Future Enhancements (High-Level from README Roadmap)

- [~] **Task:** Implement v1.2 - PWA Avançado.
  - **Sub-Task:** [~] Push notifications (Conceptual design done).
  - **Sub-Task:** [ ] Advanced offline (e.g., queue orders offline, sync when online).
  - **Sub-Task:** [ ] Geolocation (e.g., for delivery fee calculation or finding nearby stores if multi-restaurant).
  - **Sub-Task:** [ ] A11Y (Accessibility Review - basic pass planned).
- [ ] **Task:** Implement v1.3 - Pagamentos Híbridos.
  - **Sub-Task:** [ ] PIX avançado com comprovante (e.g., webhook confirmation from payment gateway).
  - **Sub-Task:** [ ] Cartão via maquininha (e.g., integration with POS or payment terminal APIs).
  - **Sub-Task:** [ ] Sistema de pontos/fidelidade.
- [ ] **Task:** Explore v2.0 - Marketplace (Premium templates, plugins).
- [ ] **Task:** Develop v2.1 - IA Avançada (Chatbot, ML recommendations beyond current basic).
- [ ] **Task:** Build v3.0 - Ecossistema (Multi-restaurant, API, delivery integration).

**Note on `[~]`:** Indicates task is partially complete, in progress, or conceptually designed.
**Note on `[x]`:** Indicates task is considered complete for its current scope.
**Note on `[ ]`:** Indicates task is not yet started or significantly implemented.
