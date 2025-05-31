# Tembiu App Documentation

Welcome to the official documentation for the Tembiu - Cardápio Digital Open Source project.

## Overview

Tembiu ([tem-bi-'u]) is a Tupi-Guarani word meaning "food." This project aims to be the first free and complete open-source digital menu solution with native PIX and WhatsApp Business integration, tailored for Brazilian restaurants. Our mission is to democratize gastronomic technology.

This documentation will guide you through setting up, configuring, using, and contributing to the Tembiu app.

## Getting Started

*(Placeholder for instructions on how to quickly get the application running, either by using a template, forking, or cloning locally. This will likely mirror parts of the main README.md's installation section but could be more detailed here.)*

- Prerequisites
- Installation Options
- First Launch

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
    phone: "5511999999999",       // Used for WhatsApp "wa.me" links AND as the default PIX key
    cidade: "Nome Da Sua Cidade",   // Merchant's city, used in PIX generation (BR Code field 60)
};
```
**Note:** The `phone` number is also used as the default PIX key (telefone type) for generating PIX codes. The `cidade` is the merchant's city name, which is included in the PIX code as per BR Code specifications (field 60 for Merchant City). Ensure these are correctly configured for proper PIX functionality.

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

*(Placeholder for detailed explanations of each core feature, e.g.:)*
- Digital Menu Display
- Shopping Cart & Ordering
- **PIX Payment (Client-Side QR Generation):** The application generates a standard BR Code compliant PIX QR code and a "Copia e Cola" string directly in the client's browser. This includes all necessary fields like merchant details (name, city, PIX key), transaction value, and a unique transaction ID (TXID), ensuring compatibility with Brazilian banking apps.
- WhatsApp Integration
- Order History ("Smart History")
- Progressive Web App (PWA) Functionality

### Customer Address Input

The application now allows customers to input their delivery address.
- **Address Form:** Users can enter their street, number, complement, neighborhood, city, and CEP in a form available in the cart/checkout section.
- **Storage:** The address is saved to the browser's `localStorage` for persistence across sessions.
- **Integration:**
    - The saved address is automatically included in the order message when sharing via WhatsApp.
    - It is also included in the data payload sent to the backend (if configured).

## Technical Architecture

*(Placeholder for a more in-depth look at the client-side architecture, data flow, PWA implementation details, and the conceptual Google Apps Script backend.)*

### Google Apps Script Backend
For detailed instructions on setting up the optional Google Apps Script backend for order logging, please see the [Google Apps Script Setup Guide](google_apps_script_setup.md).

## Contributing

We welcome contributions! Please see the main project `README.md` for initial guidelines, and this section will be expanded with more technical details for developers.
- Reporting Bugs
- Suggesting Enhancements
- Code Contribution Guidelines

## Troubleshooting

*(Placeholder for common issues and their solutions.)*
