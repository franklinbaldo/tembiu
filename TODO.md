# TODO - Tembiu App

This TODO list is derived from the project's `README.md` and aims to guide development.

## Phase 1: Implement Core v1.0 Functionality (from README)

- [~] **Task:** Basic responsive template and menu loading.
    - **Details:** HTML structure, CSS styling, JavaScript for fetching, parsing, and displaying `menu.csv`. Interactive menu items with "add to cart" functionality. Basic cart display (items and total).
    - **Status:** Initial structure and functionality implemented. Further refinements for responsiveness and UI needed.
    - **Rationale:** Foundation for all other v1.0 features.
- [ ] **Task:** PIX Integration (Placeholder/Conceptual).
    - **Details:** Design how PIX QR codes and copyable codes will be generated and displayed. Implement placeholder UI elements. (Note: Basic cart data is now available in `js/main.js`'s `cart` array).
    - **Rationale:** Core payment method for the app.
- [ ] **Task:** WhatsApp Integration (Placeholder/Conceptual).
    - **Details:** Design how order information will be formatted for WhatsApp messages. Implement placeholder UI elements for sending orders/proof of payment. (Note: Basic cart data is now available in `js/main.js`'s `cart` array).
    - **Rationale:** Core communication method for orders.
- [x] **Task:** Basic PWA Features.
    - **Sub-Task:** [x] Create and link `manifest.json`.
    - **Sub-Task:** [x] Implement basic service worker for offline caching of static assets.
    - **Rationale:** Improves user experience with app-like features and offline access, as per v1.0.
- [ ] **Task:** Smart History (Conceptual).
    - **Details:** Plan how order history will be stored (LocalStorage) and how the "order again" functionality will work. Implement placeholder UI.
    - **Rationale:** Key usability feature for repeat customers.

- [ ] **Task:** Set up Local Development Environment.
    - **Details:** Document and test the steps for setting up a local development environment (as per `README.md`'s "Clone Local" option). Ensure it's easy for new contributors to get started.
    - **Rationale:** Essential for any further development or contributions.

## Phase 2: Roadmap Implementation (Next Steps from README)

- [ ] **Task:** Begin v1.1 - Google Apps Script Integration (Backend).
    - **Sub-Task:** Design basic Google Apps Script structure for backend logic (e.g., handling orders, analytics).
    - **Sub-Task:** Implement a function to log new orders to a Google Sheet.
    - **Sub-Task:** Document how to set up and deploy this GAS backend.
    - **Rationale:** This is the first unchecked major item in the `README.md` roadmap (v1.1) and adds significant value through data persistence and automation.
- [ ] **Task:** Refine `menu.csv` and `menu.json` examples and documentation.
    - **Details:** Ensure the examples in `README.md` for `menu.csv` and `menu.json` are fully functional and cover common use cases. Provide sample `menu.csv` and `menu.json` files in the repository if they don't already exist. Update documentation on how to use them.
    - **Rationale:** Crucial for new users to quickly understand how to configure their menus.
- [ ] **Task:** Review and Enhance Documentation (`docs/`).
    - **Details:** Check if the `docs/` directory and key files like `docs/configuration.md` (mentioned in `README.md`) exist. If they exist, review for clarity, accuracy, and completeness. If not, create them with basic setup and configuration guides.
    - **Rationale:** Comprehensive and clear documentation is key for user adoption, self-service setup, and attracting contributions.

## Future Phases (High-Level from README Roadmap)

- [ ] Implement v1.2 - PWA Avançado (Push notifications, advanced offline, geolocation, A11Y).
- [ ] Implement v1.3 - Pagamentos Híbridos (Advanced PIX, card machine, loyalty points).
- [ ] Explore v2.0 - Marketplace (Premium templates, plugins).
- [ ] Develop v2.1 - IA Avançada (Chatbot, ML recommendations).
- [ ] Build v3.0 - Ecossistema (Multi-restaurant, API, delivery integration).

**Note on `[~]`:** Indicates task is partially complete or in progress.
