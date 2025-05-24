# TODO - Tembiu App

This TODO list is derived from the project's `README.md` and aims to guide development.

## Phase 1: Implement Core v1.0 Functionality (from README)

- [~] **Task:** Basic responsive template and menu loading.
    - **Details:** HTML structure, CSS styling, JavaScript for fetching, parsing, and displaying `menu.csv`. Interactive menu items with "add to cart" functionality. Basic cart display (items and total with quantity). Functional item removal from cart. **CSS media queries added for improved responsiveness across screen sizes.**
    - **Status:** Initial structure and functionality implemented. Cart quantity handling and item removal added. Responsiveness improved. Further UI refinements may be needed.
    - **Rationale:** Foundation for all other v1.0 features.
- [x] **Task:** PIX Integration (Placeholder/Conceptual). 
    - **Details:** UI elements for PIX display are in place. `handleCheckout` now uses `qrcode.js` to generate a real client-side QR code from simulated PIX data (including item quantities). "Copia e Cola" also uses this data string.
    - **Status:** Client-side QR code generation implemented. Next step could be refining PIX data structure if needed or server-side validation (future).
    - **Rationale:** Core payment method for the app.
- [~] **Task:** WhatsApp Integration (Placeholder/Conceptual). 
    - **Details:** WhatsApp share button UI is in place. `handleWhatsAppShare` formats cart data (including quantities) and opens a `wa.me` link.
    - **Status:** Placeholder UI and JS logic for `wa.me` link implemented. (Marking as [~] as full integration might involve phone number config, etc.)
    - **Rationale:** Core communication method for orders.
- [x] **Task:** Basic PWA Features.
    - **Sub-Task:** [x] Create and link `manifest.json`.
    - **Sub-Task:** [x] Implement basic service worker for offline caching of static assets.
    - **Rationale:** Improves user experience with app-like features and offline access, as per v1.0.
- [x] **Task:** Smart History (Conceptual).
    - **Details:** Orders are saved to LocalStorage after simulated payment (now with quantities). Past orders (with quantities) are displayed with a functional "Order Again" button that repopulates the cart. Cart is cleared after checkout.
    - **Status:** Basic LocalStorage save/load and UI implemented. "Order Again" is functional.
    - **Rationale:** Key usability feature for repeat customers.

- [ ] **Task:** Set up Local Development Environment.
    - **Details:** Document and test the steps for setting up a local development environment (as per `README.md`'s "Clone Local" option). Ensure it's easy for new contributors to get started.
    - **Rationale:** Essential for any further development or contributions.

## Phase 2: Roadmap Implementation (Next Steps from README)

- [~] **Task:** Begin v1.1 - Google Apps Script Integration (Backend).
    - **Sub-Task:** Design basic Google Apps Script structure for backend logic (e.g., handling orders, analytics). **[Placeholder `backend/google_apps_script_backend.gs.js` file created. Client-side `js/main.js` now includes `sendOrderToBackend` function to POST order data to a placeholder GAS URL.]**
    - **Sub-Task:** Implement a function in GAS to log new orders to a Google Sheet.
    - **Sub-Task:** Document how to set up and deploy this GAS backend.
    - **Rationale:** This is the first unchecked major item in the `README.md` roadmap (v1.1) and adds significant value through data persistence and automation.
- [ ] **Task:** Refine `menu.csv` and `menu.json` examples and documentation.
    - **Details:** Ensure the examples in `README.md` for `menu.csv` and `menu.json` are fully functional and cover common use cases. Provide sample `menu.csv` and `menu.json` files in the repository if they don't already exist. Update documentation on how to use them.
    - **Rationale:** Crucial for new users to quickly understand how to configure their menus.
- [ ] **Task:** Review and Enhance Documentation (`docs/`).
    - **Details:** Check if the `docs/` directory and key files like `docs/configuration.md` (mentioned in `README.md`) exist. If they exist, review for clarity, accuracy, and completeness. If not, create them with basic setup and configuration guides.
    - **Rationale:** Comprehensive and clear documentation is key for user adoption, self-service setup, and attracting contributions.

- [x] **Task:** Refine UI/UX for Core Features. 
    - **Details:** Improve visual hierarchy and spacing of menu, cart, PIX display, and order history. Ensure better responsiveness. Add loading indicators. Design user-friendly quantity management in cart. **[Cart quantity handling implemented. CSS active styles for button feedback added. Placeholder 'Remover' buttons added to cart items, now fully functional.]**
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

## Future Phases (High-Level from README Roadmap)

- [ ] Implement v1.2 - PWA Avançado (Push notifications, advanced offline, geolocation, A11Y).
- [ ] Implement v1.3 - Pagamentos Híbridos (Advanced PIX, card machine, loyalty points).
- [ ] Explore v2.0 - Marketplace (Premium templates, plugins).
- [ ] Develop v2.1 - IA Avançada (Chatbot, ML recommendations).
- [ ] Build v3.0 - Ecossistema (Multi-restaurant, API, delivery integration).

**Note on `[~]`:** Indicates task is partially complete or in progress.
