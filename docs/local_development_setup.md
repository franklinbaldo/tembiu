# Local Development Setup

This guide details the steps for setting up a local development environment for the Tembi'u project. This allows you to run and test the application on your own computer.

## 1. Prerequisites

Before you begin, ensure you have the following installed:

*   **Git:** For cloning the project repository. You can download it from [git-scm.com](https://git-scm.com/).
*   **A modern web browser:** Such as Chrome, Firefox, Safari, or Edge, for viewing the application.
*   **A text editor:** For viewing and editing code. Popular choices include VS Code, Sublime Text, or Atom.
*   **(Optional but Recommended) Node.js and npm:** While not strictly necessary for editing the current HTML, CSS, and JavaScript, Node.js and npm (Node Package Manager) are useful for running local development servers and will be beneficial if any build tools or package management are introduced in the future. You can download them from [nodejs.org](https://nodejs.org/).

## 2. Cloning the Repository

1.  Open your terminal or command prompt.
2.  Clone the project repository using Git.
    ```bash
    git clone https://github.com/seu-usuario/tembiu.git 
    ```
    *(Note: Replace `https://github.com/seu-usuario/tembiu.git` with the actual repository URL if different. This is a placeholder.)*
3.  Navigate into the cloned project directory:
    ```bash
    cd tembiu
    ```

## 3. Running the Application Locally

Since Tembi'u is primarily a client-side application (HTML, CSS, JavaScript), you have a couple of options for running it locally:

*   **Directly opening `index.html`:** You can often just open the `index.html` file directly in your web browser. However, this method might not accurately reflect a live server environment and can sometimes lead to issues with file paths or Cross-Origin Resource Sharing (CORS) if you were to integrate APIs.

*   **Using a simple local web server (Recommended):** This is the preferred method for a more accurate testing environment.

    *   **If Python is installed:**
        Open your terminal in the `tembiu` project root and run:
        ```bash
        # For Python 3
        python3 -m http.server 8000
        # Or for Python 2 (less common now)
        # python -m SimpleHTTPServer 8000
        ```
        Then, open your browser and go to `http://localhost:8000`.

    *   **Using Node.js (if installed):**
        *   **`npx serve`:** This command uses `serve`, a simple HTTP server, without needing to install it globally. Open your terminal in the `tembiu` project root and run:
            ```bash
            npx serve
            ```
            It will typically serve the content on `http://localhost:3000` or another available port (the command output will tell you the address).
        *   **`live-server`:** This is a popular option that also provides live reloading.
            If you don't have it, install it globally first:
            ```bash
            npm install -g live-server
            ```
            Then, run it from the project root:
            ```bash
            live-server
            ```
            This will usually open the application automatically in your default browser at `http://localhost:8080` or a similar address.

Once the server is running, you can access the application by navigating to the specified URL (e.g., `http://localhost:8000`, `http://localhost:3000`, or `http://localhost:8080`).

## 4. Project Structure Overview

Here's a brief overview of the key files and directories in the project:

*   `index.html`: The main entry point of the application.
*   `css/`: Contains stylesheet files (e.g., `style.css`).
*   `js/`: Contains JavaScript files (e.g., `main.js`, `fetch_data.js`).
*   `icons/`: Contains icons and images used in the application.
*   `backend/`: Contains the Google Apps Script code (`Code.gs`) for optional backend functionalities.
*   `docs/`: Contains documentation files, like this one.
*   `menu.csv`: The primary data source for the menu items. This file is crucial for the application's content.

## 5. Google Apps Script (GAS) Backend (Optional Setup)

The Google Apps Script backend provides optional advanced features, such as order logging or integration with Google Sheets.

For detailed instructions on setting up the GAS backend and integrating it with your local client, please refer to the separate [Google Apps Script Setup Guide](google_apps_script_setup.md).

## 6. Making Changes

1.  **Edit Files:** You can directly edit the HTML (`.html`), CSS (`.css`), and JavaScript (`.js`) files using your preferred text editor.
2.  **Edit Menu Data:** The `menu.csv` file can be edited with a spreadsheet program (like Google Sheets, Microsoft Excel, LibreOffice Calc) or a plain text editor. Ensure you maintain the CSV format.
3.  **Test Changes:** After making changes, if you are using a local web server like `live-server`, your browser might refresh automatically. If not, simply refresh the page in your web browser to see the updates. If you opened `index.html` directly, you'll also need to refresh.

Happy coding!
