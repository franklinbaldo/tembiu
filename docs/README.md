# Tembiu App Documentation

Welcome to the official documentation for the Tembiu - Cardápio Digital Open Source project.

## Overview

Tembiu ([tem-bi-'u]) is a Tupi-Guarani word meaning "food." This project aims to be the first free and complete open-source digital menu solution with native PIX and WhatsApp Business integration, tailored for Brazilian restaurants. Our mission is to democratize gastronomic technology.

This documentation will guide you through setting up, configuring, using, and contributing to the Tembiu app.

## Getting Started

This section guides you through getting your Tembiu digital menu up and running.

### Prerequisites

*   A GitHub account (for using the template or forking).
*   Basic familiarity with editing text files (for menu and configuration).
*   A modern web browser.

### Installation Options

There are several ways to set up your Tembiu menu:

1.  **Use the GitHub Template (Recommended):**
    *   Visit the main project repository and look for the "Use this template" button. (The exact URL can be found in the main project `README.md`).
    *   This creates a new repository under your account, pre-filled with all necessary files.
    *   Follow the configuration steps below.

2.  **Fork the Repository:**
    *   Go to the main project repository page (e.g., `https://github.com/YourUsername/YourTembiuRepo`) and click "Fork".
    *   This creates a copy of the repository under your account.
    *   Follow the configuration steps below.

3.  **Clone Locally:**
    *   Clone the repository to your local machine: `git clone https://github.com/YourUsername/YourTembiuRepo.git` (replace with the actual repository URL).
    *   This is suitable if you plan to do significant local development or deploy to your own hosting.
    *   See the [Local Development Setup Guide](local_development_setup.md) for more details on developing locally.

### Initial Configuration & First Launch

After setting up your repository using one of the methods above:

1.  **Configure Your Menu:**
    *   Decide if you want to use `menu.csv` or `menu.json`.
    *   Create or edit your chosen menu file in the root of your repository.
    *   Refer to the [Menu Setup (`menu.csv`)](#menu-setup-menucsv) and [Menu Setup (`menu.json`)](#menu-setup-menujson) sections for detailed instructions on structuring your menu data.

2.  **Configure Restaurant Settings:**
    *   Edit the `restaurantConfig` object at the top of the `js/main.js` file.
    *   Update the `name` and `phone` number for your restaurant.
    *   See the [Restaurant Settings](#restaurant-settings) section for more details.

3.  **Deploy (if using GitHub Pages):**
    *   If you used the template or forked the repository on GitHub:
        *   Go to your repository's "Settings" tab.
        *   Navigate to the "Pages" section.
        *   Under "Build and deployment", select "Deploy from a branch" as the source (usually `main` or `master`).
        *   Choose the `/ (root)` folder, then click "Save".
        *   Your digital menu will be live at `https://your-github-username.github.io/your-repository-name/` within a few minutes.

4.  **First Launch:**
    *   Open the live URL provided by GitHub Pages or your local `index.html` file in a web browser.
    *   Verify that your restaurant name and menu items appear correctly.

For more advanced setup or if you encounter issues, refer to the [Troubleshooting](#troubleshooting) section or the main project `README.md` (usually located at `../README.md` from this document).

### Local Development Environment Setup
For detailed instructions on setting up a local development environment, please see the [Local Development Setup Guide](local_development_setup.md).

## Configuration

This section will detail how to configure your Tembiu instance.

### Restaurant Settings

Currently, basic restaurant settings (like the name displayed in the header and the WhatsApp contact number) are configured directly within the `js/main.js` file, at the top, in an object named `restaurantConfig`.

Example in `js/main.js`:
```javascript
const restaurantConfig = {
    name: "Seu Restaurante Aqui", // Used in page header and WhatsApp messages
    phone: "5511999999999",       // Used for WhatsApp "wa.me" links
};
```
*(Future versions may move this to a dedicated configuration file or a user interface.)*

### Menu Setup (`menu.csv`)

The primary way to define your menu is by creating and maintaining a `menu.csv` file in the root directory of the project. This file can be easily edited with spreadsheet software like Microsoft Excel, Google Sheets, LibreOffice Calc, or even a plain text editor.

**File Structure:**

The `menu.csv` file must be a Comma Separated Values (CSV) file with the first line defining the headers. The following headers are required, in this order:

1.  `nome`: Text - The name of the dish or item as it will be displayed on the menu.
    *   Example: `Pizza Margherita`
2.  `categoria`: Text - The category this item belongs to (e.g., pizzas, massas, bebidas, sobremesas). Items will be grouped by category on the menu (future feature, currently items are listed together).
    *   Example: `pizzas`
3.  `preco`: Number - The price of the item. Use a period (`.`) as the decimal separator. Do not include currency symbols.
    *   Example: `26.90`
4.  `descricao`: Text - A brief description of the item. This will be displayed to customers.
    *   Example: `Molho de tomate fresco, mussarela de búfala, manjericão.`
5.  `emoji`: Text (Optional) - An emoji to visually represent the item. If omitted, a default emoji might be used.
    *   Example: `🍕`
6.  `disponivel`: Boolean - Indicates if the item is currently available. Set to `true` if available, or `false` if temporarily unavailable (e.g., out of stock). Items marked as `false` will not be shown on the menu.
    *   Example: `true`

**CSV Example:**

```csv
nome,categoria,preco,descricao,emoji,disponivel
Pizza Margherita,pizzas,26.90,Molho de tomate fresco, mussarela de búfala, manjericão.,🍕,true
Spaghetti Carbonara,massas,32.50,Massa fresca com ovos, pancetta, queijo Pecorino Romano e pimenta preta.,🍝,true
Coca-Cola,bebidas,5.00,Lata 350ml.,🥤,true
Suco de Laranja Natural,bebidas,8.00,Feito com laranjas frescas, 500ml.,🍊,true
Brownie com Sorvete,sobremesas,18.00,Brownie de chocolate meio amargo com uma bola de sorvete de creme.,🍰,false
```

**Important Notes:**
- Ensure the file is saved with UTF-8 encoding, especially if using special characters or emojis.
- The header row must be exactly as specified (`nome,categoria,preco,descricao,emoji,disponivel`).
- Do not use commas within a field's text (e.g., in `descricao`), as this will break the CSV parsing. If you need commas, you would typically enclose the field in double quotes, but the current simple parser might not support this robustly. It's safer to avoid internal commas for now.

### Menu Setup (`menu.json`)

Alternatively, or for more complex menu structures in the future, Tembiu can be configured to load its menu from a `menu.json` file located in the root directory of the project. This file should contain a JSON array of menu item objects.

Each menu item object in the array should have the following fields:

-   `nome`: (String) The name of the dish or item as it will be displayed on the menu.
    *   Example: `"Pizza Margherita"`
-   `categoria`: (String) The category this item belongs to (e.g., "pizzas", "massas", "bebidas", "sobremesas").
    *   Example: `"pizzas"`
-   `preco`: (Number) The price of the item. Use standard number format.
    *   Example: `26.90`
-   `descricao`: (String) A brief description of the item.
    *   Example: `"Molho de tomate mussarela manjericão"`
-   `emoji`: (String, Optional) An emoji to visually represent the item.
    *   Example: `"🍕"`
-   `disponivel`: (Boolean) Indicates if the item is currently available. Set to `true` if available, or `false` if not.
    *   Example: `true`

**JSON Example (`menu_example.json`):**

```json
[
  {
    "nome": "Pizza Margherita",
    "categoria": "pizzas",
    "preco": 26.90,
    "descricao": "Molho de tomate mussarela manjericão",
    "emoji": "🍕",
    "disponivel": true
  },
  {
    "nome": "Spaghetti Carbonara",
    "categoria": "massas",
    "preco": 28.90,
    "descricao": "Massa fresca com ovos pancetta",
    "emoji": "🍝",
    "disponivel": true
  }
  // ... other items
]
```

**Note:** While `menu.csv` is currently the primary method, the application may include logic to prioritize `menu.json` or allow selection via configuration in future updates. Refer to `js/main.js` for current menu loading behavior.

## Features

Tembiu is packed with features designed to provide a seamless experience for both restaurants and customers. Here are some of the core functionalities:

*   **Digital Menu Display:**
    *   Easily display your menu items, which can be loaded from a simple `menu.csv` or a more flexible `menu.json` file.
    *   Items can include name, category, price, description, and an emoji.
    *   Control item availability (e.g., for out-of-stock items).
    *   Refer to the [Menu Setup (`menu.csv`)](#menu-setup-menucsv) and [Menu Setup (`menu.json`)](#menu-setup-menujson) sections for configuration details.

*   **Shopping Cart & Ordering:**
    *   Intuitive "add to cart" functionality for customers.
    *   Clear display of cart items, quantities, and total price.
    *   Easy item removal or quantity adjustment (if implemented, currently removal is per item).

*   **PIX Payment (Client-Side QR Generation):**
    *   Generate a PIX QR code directly on the client-side for payment.
    *   Includes a "copy and paste" PIX code.
    *   Order details can be embedded in the PIX data string.

*   **WhatsApp Integration:**
    *   Allows customers to share their formatted order directly to the restaurant's WhatsApp number.
    *   Uses `wa.me` links for quick redirection to WhatsApp.

*   **Order History ("Smart History"):**
    *   Saves past orders to the user's local browser storage.
    *   "Order Again" functionality allows quick re-ordering of items from past orders.

*   **Progressive Web App (PWA) Functionality:**
    *   Installable on user devices for an app-like experience (icon on home screen).
    *   Basic offline support for static assets (menu may require connection if not cached recently).
    *   Faster loading and improved reliability.

*   **Shareable Order URLs (Conceptual/Future):**
    *   The main README describes a feature for generating unique, shareable URLs for each order, allowing customers to review their order details via a link. (This feature's implementation status should be verified in `js/main.js` or recent TODOs).

*   **Smart Scheduling System (Conceptual/Future):**
    *   The main README outlines plans for integration with Google Maps for automatic open/close status, display of business hours, and potentially scheduled ordering.

*   **Contextual Item Suggestions (Conceptual/Future):**
    *   The main README describes plans for AI-based suggestions (e.g., frequently co-ordered items) based on customer behavior and order history.

*   **Dark/Light Mode Theme (Conceptual/Future):**
    *   A user-selectable dark or light theme for improved visual comfort is a planned UI/UX enhancement.

*   **Privacy-Focused (LGPD Considerations):**
    *   Primarily uses local browser storage for user data like cart and order history, minimizing server-side data collection for the core application.
    *   The optional Google Apps Script backend would handle data as per its setup.

*(Note: "Conceptual/Future" indicates features described in the main project README that may not be fully implemented in the current core version. Always refer to the latest `TODO.md` or main project `README.md` for current feature status.)*

## Technical Architecture

Tembiu is designed with a client-centric architecture, prioritizing simplicity, performance, and cost-effectiveness.

### Frontend (Client-Side)

The core application runs entirely in the user's web browser:

*   **Structure:** Semantic HTML5 (`index.html`) provides the basic layout.
*   **Styling:** CSS3 (`css/style.css`), potentially using CSS Variables for theming (e.g., for future Dark/Light mode).
*   **Logic:** Vanilla JavaScript (ES6+) (`js/main.js`) handles all dynamic behavior, including:
    *   Fetching and parsing menu data (`menu.csv` or `menu.json`).
    *   Rendering menu items.
    *   Shopping cart management.
    *   PIX QR code generation.
    *   WhatsApp message formatting.
    *   Saving and retrieving order history.
*   **Data Storage:** `localStorage` is used to store the shopping cart, order history, and potentially user preferences locally in the browser.
*   **Progressive Web App (PWA):**
    *   A Service Worker (`sw.js`) enables basic offline caching of static assets (HTML, CSS, JS, icons).
    *   A `manifest.json` file allows the application to be installed on user devices, providing an app-like experience.

### Backend (Optional)

For features like persistent order logging and analytics beyond the client's browser, Tembiu offers an optional backend solution:

*   **Google Apps Script (`backend/google_apps_script_backend.gs.js`):**
    *   Provides serverless backend logic.
    *   Can be configured to log new orders to a Google Sheet, effectively using it as a simple database.
    *   Can be extended for other automations like sending email confirmations or building a sales dashboard within Google Sheets.
    *   For setup instructions, see the [Google Apps Script Setup Guide](google_apps_script_setup.md).

### Infrastructure & Deployment

*   **GitHub Pages (Recommended for free hosting):**
    *   Serves the static HTML, CSS, and JavaScript files.
    *   Provides free SSL (HTTPS).
    *   Offers a global Content Delivery Network (CDN) for faster loading times.
    *   Supports continuous deployment from a GitHub repository.
*   **Alternative Hosting:** Being a static site, Tembiu can be hosted on various other platforms (Netlify, Vercel, traditional web hosting, etc.).

This architecture ensures that the core menu and ordering functionality can operate without any server-side dependencies, making it highly resilient and free to operate for basic use cases.

## Contributing

Tembiu is an open-source project, and we welcome contributions from everyone, whether you're a developer, a restaurant owner, or just an enthusiastic user!

### Ways to Contribute

*   **Reporting Bugs:** If you find a bug, please open an issue on the project's GitHub repository. Provide as much detail as possible, including steps to reproduce, browser version, and screenshots if applicable.
*   **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Open an issue or start a discussion on GitHub.
*   **Code Contributions (for Developers):**
    1.  **Fork** the repository.
    2.  Create a new **branch** for your feature or bugfix (e.g., `feature/new-cool-feature` or `fix/cart-bug`).
    3.  Make your **changes** and **test** them thoroughly.
    4.  **Commit** your changes with a clear and descriptive commit message.
    5.  **Push** your branch to your fork and open a **Pull Request (PR)** against the main project repository.
    *   Areas where help is particularly welcome include: UI/UX design, frontend feature development (JavaScript), Google Apps Script enhancements, writing tests, and internationalization (i18n).
*   **Documentation:** Help improve this documentation, write tutorials, or provide examples.
*   **Feedback from Restaurants:** If you're using Tembiu in your restaurant, share your experiences, pain points, and success stories. This real-world feedback is invaluable.
*   **Spread the Word:** Tell other restaurant owners about Tembiu, star the project on GitHub, or share it on social media.

### Guidelines

*   Please ensure your code contributions adhere to the existing coding style.
*   For significant changes, it's always a good idea to discuss them in an issue first.
*   Be respectful and constructive in all communications.

For more specific guidelines or if you're looking for tasks to work on, please check the main project `README.md` (usually at `../README.md`) and the "Issues" tab on GitHub.

## Troubleshooting

Encountering an issue? Here are some common problems and how to resolve them.

**1. Menu Not Loading or Items Not Appearing:**

*   **Check `menu.csv` or `menu.json`:**
    *   Ensure the file (`menu.csv` or `menu.json`, whichever you are using) is present in the root directory of your repository.
    *   **For `menu.csv`:**
        *   Verify the CSV structure: headers (`nome,categoria,preco,descricao,emoji,disponivel`) must be exactly correct and in order.
        *   Ensure there are no commas within individual fields (e.g., in `descricao`). If you need commas, the field should typically be enclosed in double quotes, but test this as the parser might be simple.
        *   Check that `disponivel` is set to `true` for items you want to display.
        *   Ensure the file is UTF-8 encoded, especially if using special characters or emojis.
    *   **For `menu.json`:**
        *   Validate the JSON structure. It should be an array of objects. Use a JSON validator tool if unsure.
        *   Check that `disponivel` is set to `true` (boolean) for items you want to display.
        *   Ensure field names (`nome`, `categoria`, `preco`, etc.) are correct.
*   **GitHub Pages Delay:** If you've just updated your menu file on GitHub, there might be a delay of a minute or two before changes are live due to caching or deployment propagation. Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R).
*   **Browser Cache:** Your browser might be caching an old version of the menu. Try clearing your browser's cache and cookies for the site, or test in an incognito/private window.
*   **Check Browser Console:** Open your browser's developer tools (usually by pressing F12) and look at the "Console" tab for any error messages. This can provide clues about what went wrong (e.g., file not found, parsing errors).

**2. Changes to `js/main.js` (like restaurant name) Not Reflecting:**

*   Similar to menu changes, ensure the file was saved correctly.
*   Allow time for GitHub Pages to update.
*   Try a hard refresh or clear browser cache.

**3. PWA Not Installing or Working Offline Correctly:**

*   **HTTPS Required:** PWAs require HTTPS, which is standard on GitHub Pages. If hosting elsewhere, ensure HTTPS is enabled.
*   **Service Worker Issues:** If offline functionality isn't working as expected, the service worker (`sw.js`) might not have registered correctly or might have encountered an error. Check the browser console and the "Application" tab (under "Service Workers") in developer tools.
*   **Manifest File:** Ensure `manifest.json` is correctly linked in `index.html` and is accessible.

**4. How to Update the Menu:**

*   Edit your `menu.csv` or `menu.json` file directly in your GitHub repository or locally and push the changes.
*   Changes should reflect on your live site after a short delay (if using GitHub Pages).

**5. Does it work on iPhone/Android?**

*   Yes, Tembiu is designed as a Progressive Web App (PWA) and should work well on modern mobile browsers on both iOS (Safari, Chrome, etc.) and Android. Users can often "Add to Home Screen" for an app-like experience.

**6. Need Further Help?**

*   **Check GitHub Issues:** See if someone else has reported a similar problem on the project's GitHub repository under the "Issues" tab.
*   **Consult the Community:** Ask for help in the project's community channels (e.g., Discord, GitHub Discussions, as mentioned in the main `README.md`).
*   **Review Documentation:** Double-check the setup and configuration guides in this documentation and the main project `README.md`.

If you identify a new issue or have a solution not covered here, consider contributing by opening an issue or suggesting an improvement to this documentation.
