# TODO - Tembiu App

This TODO list is derived from the project's `README.md` and aims to guide development.

## Phase 1: Implement Core v1.0 Functionality (from README)

- [x] **Task:** Basic responsive template and menu loading.
    - **Details:** Completely new UI/UX implemented with mobile-first design, CSS variables, new HTML structure, and JS logic for view management. Menu loading and display adapted to new card layout.
- [x] **Task:** PIX Integration (Placeholder/Conceptual). 
    - **Details:** UI elements for PIX display are in place. `handleCheckout` now uses `qrcode.js` to generate a real client-side QR code. **PIX data string structure refined to follow custom format from README.md (using configured phone for 'Tel').**
    - **Status:** Client-side QR code generation implemented with refined data structure.
    - **Rationale:** Core payment method for the app.
- [x] **Task:** WhatsApp Integration (Placeholder/Conceptual).
    - **Details:** JS logic for `wa.me` link in place. Message formatting includes cart details and customer address. `restaurantConfig` used for contact details.
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
- [~] **Task:** Refine `menu.csv` and `menu.json` examples and documentation.
    - **Sub-Task:** [x] Main `README.md`'s `menu.csv` example refined and linked to detailed guide in `docs/README.md#configuration`.
    - **Sub-Task:** [x] Provide a sample `menu.json` file in the repository (e.g., `menu_example.json`).
    - **Sub-Task:** [x] Document the structure and usage of `menu.json` in `docs/README.md` (filling the placeholder).
    - **Sub-Task:** [ ] Implement or verify client-side logic in `js/main.js` to load and parse `menu.json` if `menu.csv` is not found or if a configuration points to JSON.
    - **Rationale:** Crucial for new users to quickly understand how to configure their menus using either format.
- [~] **Task:** Review and Enhance Documentation (`docs/`).
    - **Sub-Task:** [x] Initial `docs/README.md` created. Menu (`menu.csv`) and basic Restaurant Settings configuration sections populated with details.
    - **Sub-Task:** [x] Local development setup guide created (`docs/local_development_setup.md`).
    - **Sub-Task:** [x] Google Apps Script setup guide created (`docs/google_apps_script_setup.md`).
    - **Sub-Task:** [ ] Populate placeholder sections in `docs/README.md`: "Getting Started," "Features" (detailing existing ones like PWA, PIX, WhatsApp, History), "Technical Architecture," "Contributing," and "Troubleshooting."
    - **Sub-Task:** [ ] Ensure all documentation links are correct and working.
    - **Rationale:** Comprehensive and clear documentation is key for user adoption and contributions.

- [x] **Task:** Refine UI/UX for Core Features. 
    - **Details:** Superseded by comprehensive UI/UX overhaul (implemented based on new design brief). New design includes significantly improved visual hierarchy, spacing, mobile-first responsiveness, and component styling using design tokens.
- [x] **Task:** Implement Real PIX QR Code Generation (Client-Side).
    - **Details:** Integrated qrcode.js library. handleCheckout now calls gerarPixCopiaECola to produce a standard BR Code compliant PIX string (including merchant key, name, city, value, TXID, CRC16) and uses this for QR code generation and "Copia e Cola" display.
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
- [x] **Task:** Add customer address input form to HTML.
    - **Details:** Added form with fields for street, number, complement, neighborhood, city, CEP to `index.html`.
- [x] **Task:** Implement JavaScript to save customer address to localStorage.
    - **Details:** `handleSaveAddress` function in `js/main.js` now captures, validates, and saves address to localStorage.
- [x] **Task:** Integrate customer address into WhatsApp messages.
    - **Details:** `formatCartForWhatsApp` in `js/main.js` now retrieves address from localStorage and includes it in the message.
- [x] **Task:** Integrate customer address into backend payload.
    - **Details:** `handleConfirmPayment` in `js/main.js` now retrieves address from localStorage and includes it in `orderPayload`.
- [x] **Task:** Ensure PIX generation uses merchant's city.
    - **Details:** Corrected `handleCheckout` to use `restaurantConfig.cidade` for PIX field 60, not customer's city.
- [ ] **Task:** Display Basic Client-Side Analytics (v1.x).
    - **Sub-Task:** Create a new section/modal in `index.html` for analytics.
    - **Sub-Task:** In `js/main.js`, add functions to calculate and display simple metrics from `localStorage` order history:
        - Total number of orders made.
        - Average order value.
        - List of most frequently ordered items.
    - **Sub-Task:** Ensure this data is presented clearly.
    - **Rationale:** Provides insights for the restaurant owner as per README.
- [ ] **Task:** Full End-to-End Testing of New UI and JS Logic.
    - **Details:** `Thorough interactive testing of all user flows, navigation, cart operations, checkout steps, address handling, PIX generation, and order history with the new UI and refactored JavaScript.`
    - **Rationale:** `Crucial to ensure stability and correct functionality after major UI/UX and JS changes.`
- [ ] **Task:** Implement Client-Side Menu Search Functionality.
    - **Details:** `Wire up the existing search input (`#menu-search`) to filter items in `#menu-items-list` based on user input. Update `renderMenuItems` or create a new filtering function.`
    - **Rationale:** `Enhances menu usability, UI placeholder already exists.`
- [ ] **Task:** Implement Client-Side Category Filtering Functionality.
    - **Details:** `Wire up the category filter buttons (`.category-filter`) to filter items in `#menu-items-list`. Update `renderMenuItems` or create a new filtering function.`
    - **Rationale:** `Improves menu navigation, UI placeholder already exists.`
- [ ] **Task:** PWA: Enhance Offline Support for New Views & Data.
    - **Details:** `Update service worker (`sw.js`) to cache all critical static assets for the new views (menu, checkout, history). Consider strategies for caching dynamic data like menu items and order history for a richer offline experience beyond basic static asset caching.`
    - **Rationale:** `Improves PWA robustness and user experience in low/no connectivity scenarios.`
- [ ] **Task:** UI: Refine Mobile Bottom Navigation Interaction.
    - **Details:** `Review active state styling for clarity. Consider smooth transitions or animations if desired and within performance budget. Ensure behavior is robust across different interactions and view changes.`
    - **Rationale:** `Polishes a key navigation component of the new UI.`
- [ ] **Task:** UI: Polish Menu Item Card Interactions.
    - **Details:** `Review hover states for menu item cards. Consider subtle animations for 'Add to Cart' if desired. Ensure cards are fully responsive and text truncation/wrapping is handled gracefully for varying content lengths.`
    - **Rationale:** `Enhances the visual appeal and interactivity of the core menu display.`
- [ ] **Task:** UI: Polish Checkout Step Transitions.
    - **Details:** `Ensure transitions between order summary, address, and payment steps are smooth and provide clear visual feedback to the user about their progress in the checkout flow. Verify all button states (disabled, active).`
    - **Rationale:** `Improves the user experience of the critical checkout process.`
- [ ] **Task:** UI: Implement Loading Indicators.
    - **Details:** `Add visual loading indicators (e.g., spinners, skeletons, or simple text messages) for asynchronous operations like `loadMenu()` to improve perceived performance and provide feedback to the user during data fetching.`
    - **Rationale:** `Enhances user experience by managing expectations during loading times.`

## Future Phases (High-Level from README Roadmap)

- [ ] Implement v1.2 - PWA Avançado (Push notifications, advanced offline, geolocation, A11Y).
- [ ] Implement v1.3 - Pagamentos Híbridos (Advanced PIX, card machine, loyalty points).
- [ ] Explore v2.0 - Marketplace (Premium templates, plugins).
- [ ] Develop v2.1 - IA Avançada (Chatbot, ML recommendations).
- [ ] Build v3.0 - Ecossistema (Multi-restaurant, API, delivery integration).

**Note on `[~]`:** Indicates task is partially complete or in progress.
