# Google Apps Script Backend Setup Guide

This guide provides step-by-step instructions for setting up the Google Apps Script backend for the Tembiu application. This backend will log orders from your digital menu directly into a Google Sheet.

## 1. Create a Google Sheet for Orders

First, you'll need a Google Sheet to store your orders.

1.  **Go to Google Sheets:** Open your web browser and navigate to [sheets.google.com](https://sheets.google.com).
2.  **Create a new spreadsheet:** Click on "+ Blank" or "Create new spreadsheet".
3.  **Rename it:** Click on "Untitled spreadsheet" at the top left and rename it to something memorable, for example, `TembiuOrders`.
4.  **Copy the Spreadsheet ID:** Look at the URL in your browser's address bar. It will look something like this:
    `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0`
    Copy the `SPREADSHEET_ID` part. This is a long string of letters and numbers between `.../d/` and `/edit...`.
    *Example:* If your URL is `https://docs.google.com/spreadsheets/d/1aBcD_eFgHiJkLmNoPqRsTuVwXyZ_12345AbCdEfGhIj/edit#gid=0`, your Spreadsheet ID is `1aBcD_eFgHiJkLmNoPqRsTuVwXyZ_12345AbCdEfGhIj`.
    Keep this ID safe; you'll need it soon.

## 2. Create the Google Apps Script Project

Now, let's create the script that will handle the orders.

1.  **Open your Google Sheet:** Make sure the `TembiuOrders` (or your named) spreadsheet is open.
2.  **Go to Apps Script:** Click on "Extensions" in the menu bar, then select "Apps Script". This will open a new tab with the Google Apps Script editor.
3.  **Rename the Apps Script project:** Click on "Untitled project" at the top left of the Apps Script editor. Rename it to something like `TembiuBackendScript`.

## 3. Add the Backend Code

1.  **Clear existing code:** In the `Code.gs` file (the default file open in the editor), delete any content that might be there (e.g., `function myFunction() {}`).
2.  **Copy backend code:**
    *   Open the `backend/google_apps_script_backend.gs.js` file from your local Tembiu project folder using a text editor.
    *   Select and copy the *entire content* of this file.
3.  **Paste into Apps Script:** Go back to the Apps Script editor tab and paste the copied code into the `Code.gs` file.

## 4. Configure the Script

You need to tell the script which spreadsheet to use.

1.  **Locate the SPREADSHEET_ID line:** Near the top of the code you just pasted into `Code.gs`, find the line:
    ```javascript
    const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
    ```
2.  **Replace with your ID:** Replace `"YOUR_SPREADSHEET_ID_HERE"` (including the quotes) with the actual Spreadsheet ID you copied in Step 1. Make sure the ID is enclosed in double quotes.
    *Example:*
    ```javascript
    const SPREADSHEET_ID = "1aBcD_eFgHiJkLmNoPqRsTuVwXyZ_12345AbCdEfGhIj";
    ```
3.  **Save the script:** Click the "Save project" icon (looks like a floppy disk) in the Apps Script editor toolbar, or press `Ctrl+S` (Windows) or `Cmd+S` (Mac).

## 5. Run the Test Function (Optional but Recommended)

This step checks if the script can correctly write to your sheet.

1.  **Select `testRecordOrder`:** In the Apps Script editor toolbar, find the dropdown menu that likely says `doPost` or `Select function`. Click on it and choose `testRecordOrder`.
2.  **Click "Run":** Click the "Run" button (looks like a play icon ▶️) next to the function dropdown.
3.  **Authorize the script:**
    *   The first time you run it, Google will ask for authorization. Click "Review permissions".
    *   Choose your Google account.
    *   You might see a "Google hasn’t verified this app" screen. If so, click "Advanced" and then "Go to TembiuBackendScript (unsafe)" (or whatever you named your script).
    *   Review the permissions the script needs (it will ask to manage your Google Sheets). Click "Allow".
4.  **Check your Google Sheet:** Go back to your `TembiuOrders` Google Sheet. A new sheet named "Pedidos" should have been created (if it wasn't there already), and it should contain a header row and one row with sample order data.
5.  **Check Logs (if issues):** If no data appears, go back to the Apps Script editor. Click on "Executions" (clock icon on the left sidebar). Look for the `testRecordOrder` execution. Click on it to see the `Logger.log` output, which might show errors. A common error at this stage is an incorrect `SPREADSHEET_ID`.

## 6. Deploy as a Web App

To allow your Tembiu frontend to send data to this script, you need to deploy it as a web app.

1.  **Click "Deploy":** In the Apps Script editor, click the "Deploy" button (usually top right) and select "New deployment".
2.  **Select type:** Click the gear icon next to "Select type" and choose "Web app".
3.  **Configure deployment:**
    *   **Description:** (Optional) You can add a description, e.g., `Tembiu Order Logger v1`.
    *   **Execute as:** Select "Me (`your_email@example.com`)". This means the script runs with your permissions.
    *   **Who has access:** Select "Anyone".
        *   *Note:* "Anyone" means the script can be executed by anyone who has the URL. "Anyone, even anonymous" is also an option but for this purpose "Anyone" is generally sufficient and slightly more controlled as it implies the user might need to be logged into a Google account, though the script itself can be triggered without active Google session if URL is known. For simplicity and common use for such web apps, "Anyone" is a good starting point.
4.  **Click "Deploy".**
5.  **Authorize again:** You might need to authorize the script again for the new permissions related to running as a web app. Follow the same authorization steps as in Step 5.

## 7. Get the Web App URL

This URL is how your website will communicate with the script.

1.  **Copy Web app URL:** After successful deployment, a "New deployment" window will appear, showing a **Web app URL**. This URL is very important. Click the "Copy" button next to it.
    It will look something like: `https://script.google.com/macros/s/LONG_RANDOM_STRING/exec`
2.  Keep this URL safe.

## 8. Configure the Client-Side (Frontend)

Now, tell your Tembiu application where to send the order data.

1.  **Open `js/main.js`:** In your local Tembiu project code, open the `js/main.js` file with your text editor.
2.  **Find the `backendUrl` line:** Near the top of the `sendOrderToBackend` function, or as a global constant, find a line similar to this:
    ```javascript
    const backendUrl = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
    ```
3.  **Replace with your Web App URL:** Replace `"YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"` (including the quotes) with the Web app URL you copied in Step 7.
    *Example:*
    ```javascript
    const backendUrl = "https://script.google.com/macros/s/LONG_RANDOM_STRING/exec";
    ```
4.  **Save `js/main.js`**.

## 9. Testing the Integration

Finally, let's test if the whole system works.

1.  **Run your Tembiu app:** Open your local Tembiu app in your web browser (e.g., by opening `index.html` or using a local server as described in `local_development_setup.md`).
2.  **Place an order:** Add some items to your cart.
3.  **Checkout and Confirm:** Proceed to checkout and click the "Confirm Payment" (or similar) button. This action should trigger the `sendOrderToBackend` function.
4.  **Check your Google Sheet:** Open your `TembiuOrders` Google Sheet again (the "Pedidos" sheet). Within a few moments, the new order you just placed in the app should appear as a new row.
5.  **Troubleshooting:**
    *   If the order doesn't appear, first check your browser's developer console (usually F12, then click "Console") for any errors in `js/main.js`.
    *   Then, check the "Executions" log in your Google Apps Script editor for the `doPost` function. This will show if the script was called and if any errors occurred on the backend. Common issues include incorrect `backendUrl` in `main.js` or permissions issues with the web app deployment.

Congratulations! Your Tembiu app should now be connected to your Google Sheet for order logging. Remember that if you make changes to `Code.gs` (the Apps Script code), you'll need to create a **New deployment** (or manage existing deployments and create a new version) for those changes to take effect for the web app.
