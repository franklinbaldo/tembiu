// Google Apps Script Backend Logic for Tembiu App

// Global constants for Spreadsheet and Sheet configuration
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // Replace with your actual Spreadsheet ID
const SHEET_NAME = "Pedidos";

/**
 * Handles POST requests to the web app.
 * This is the main entry point for receiving order data from the client-side.
 *
 * @param {Object} e - The event parameter from Google Apps Script, containing request data.
 *                   e.g., e.postData.contents for JSON payload.
 */
function doPost(e) {
  let responseMessage = "";
  let orderData; // To make orderData accessible in the final response if needed

  try {
    // 1. Parse incoming data (expecting JSON from client)
    orderData = JSON.parse(e.postData.contents);
    Logger.log("Received order data: " + JSON.stringify(orderData));

    // 2. Validate orderData (basic checks - can be expanded)
    if (
      !orderData ||
      !orderData.orderId ||
      !orderData.items ||
      orderData.items.length === 0
    ) {
      throw new Error(
        "Invalid or empty order data received. 'orderId' and 'items' are required.",
      );
    }

    // 3. Record the order to a Google Sheet
    const recordStatus = recordOrderToSheet(orderData);
    if (!recordStatus.success) {
      throw new Error(
        recordStatus.message || "Failed to record order to sheet.",
      );
    }

    responseMessage =
      "Order received and recorded successfully for Order ID: " +
      orderData.orderId;
    Logger.log(responseMessage);

    // Return a success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: responseMessage,
        orderId: orderData.orderId,
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log(
      "Error in doPost: " +
        error.toString() +
        (e.postData
          ? ". Received payload: " + e.postData.contents
          : ". No payload received."),
    );
    responseMessage = "Error processing order: " + error.toString();
    // Return an error response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: responseMessage,
        receivedData: e.postData ? e.postData.contents : "N/A", // Include raw payload for debugging
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Records the provided order data to a specific Google Spreadsheet.
 *
 * @param {Object} orderData - The order data to record.
 *                             Example: {
 *                               orderId: "CLIENT_GENERATED_ID",
 *                               items: [ { "nome": "Item1", "quantity": 2, "preco": 10.00 }, ... ],
 *                               customerName: "Optional Name",
 *                               customerPhone: "Optional Phone"
 *                             }
 * @return {Object} status - An object indicating success or failure, e.g., { success: true } or { success: false, message: "Error details" }
 */
function recordOrderToSheet(orderData) {
  try {
    // 1. Get the active spreadsheet or open by ID
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      Logger.log("Sheet '" + SHEET_NAME + "' did not exist and was created.");
    }

    // 2. Define headers if sheet is new/empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp",
        "Order ID",
        "Customer Name",
        "Customer Phone",
        "Total Amount",
        "Items JSON",
        "Raw Data JSON",
      ];
      sheet.appendRow(headers);
      Logger.log("Headers added to new sheet: " + headers.join(", "));
    }

    // 3. Prepare data row
    const timestamp = new Date();
    const orderId = orderData.orderId;
    const customerName = orderData.customerName || ""; // Handle if undefined
    const customerPhone = orderData.customerPhone || ""; // Handle if undefined

    // Calculate Total Amount
    let totalAmount = 0;
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach(function (item) {
        const price = parseFloat(item.preco);
        const quantity = parseInt(item.quantity, 10);
        if (!isNaN(price) && !isNaN(quantity)) {
          totalAmount += price * quantity;
        }
      });
    }

    const itemsJson = JSON.stringify(orderData.items);
    const rawDataJson = JSON.stringify(orderData);

    const rowData = [
      timestamp,
      orderId,
      customerName,
      customerPhone,
      totalAmount.toFixed(2),
      itemsJson,
      rawDataJson,
    ];

    // 4. Append the new order data to the sheet
    sheet.appendRow(rowData);
    Logger.log(
      "Order " +
        orderId +
        " recorded to Google Sheet in spreadsheet " +
        SPREADSHEET_ID,
    );
    return { success: true };
  } catch (error) {
    Logger.log(
      "Error in recordOrderToSheet: " +
        error.toString() +
        ". Data: " +
        JSON.stringify(orderData),
    );
    // Optionally, re-throw or handle error (e.g., send an email notification)
    return {
      success: false,
      message: "Failed to record to sheet: " + error.toString(),
    };
  }
}

/**
 * Example function to test if the script is working, particularly recordOrderToSheet.
 * Can be run directly from the Apps Script editor.
 */
function testRecordOrder() {
  Logger.log("Starting testRecordOrder...");

  const sampleOrder = {
    orderId: "TEST-" + new Date().toISOString(), // Unique ID for testing
    items: [
      { nome: "Pizza Test Margherita", quantity: 2, preco: 26.9, emoji: "🍕" },
      { nome: "Coca-Cola Test", quantity: 4, preco: 5.0, emoji: "🥤" },
    ],
    // Total will be calculated by recordOrderToSheet
    customerName: "Test User " + Math.floor(Math.random() * 1000),
    customerPhone: "5511999998888",
  };

  Logger.log("Sample order for testing: " + JSON.stringify(sampleOrder));

  // Check if SPREADSHEET_ID is set
  if (SPREADSHEET_ID === "YOUR_SPREADSHEET_ID_HERE") {
    Logger.log(
      "ERROR: SPREADSHEET_ID is not set. Please update the global constant SPREADSHEET_ID in the script.",
    );
    Browser.msgBox(
      "Configuration Error",
      "SPREADSHEET_ID is not set. Please update it in the script before testing.",
      Browser.Buttons.OK,
    );
    return;
  }

  const status = recordOrderToSheet(sampleOrder);

  if (status.success) {
    Logger.log(
      "testRecordOrder completed successfully. Order should be in the sheet.",
    );
    Browser.msgBox(
      "Test Complete",
      "testRecordOrder ran. Check the sheet: " + SPREADSHEET_ID,
      Browser.Buttons.OK,
    );
  } else {
    Logger.log("testRecordOrder failed: " + status.message);
    Browser.msgBox(
      "Test Failed",
      "testRecordOrder failed: " + status.message,
      Browser.Buttons.OK,
    );
  }
}

// Other utility functions for the backend could go here, e.g.:
// - Sending email confirmations
// - Managing menu data from a sheet (if desired, though current app uses client-side CSV)
// - Admin functions
// Dummy function to simulate SpreadsheetApp for local testing if needed (won't actually work without GAS environment)
// if (typeof SpreadsheetApp === 'undefined') {
//   Logger.log("SpreadsheetApp is not defined. Creating dummy for local testing purposes.");
//   var SpreadsheetApp = {
//     openById: function(id) {
//       Logger.log("Dummy SpreadsheetApp.openById called with: " + id);
//       return {
//         getSheetByName: function(name) {
//           Logger.log("Dummy Sheet.getSheetByName called with: " + name);
//           return {
//             getLastRow: function() { return 0; },
//             appendRow: function(data) { Logger.log("Dummy Sheet.appendRow called with: " + data); },
//             insertSheet: function(name) { Logger.log("Dummy Sheet.insertSheet called with: " + name); return this; } // Return self for chaining
//           };
//         }
//       };
//     }
//   };
//   var Logger = console; // Use console for logging if Logger is not defined
//   var ContentService = {
//     createTextOutput: function(text) {
//       return {
//         setMimeType: function(type) {
//           Logger.log("Dummy ContentService.setMimeType: " + type);
//           Logger.log("Dummy ContentService.createTextOutput: " + text);
//           return { text: text, mimeType: type }; // Return an object for inspection
//         }
//       };
//     },
//     MimeType: { JSON: "application/json" }
//   };
//   var Browser = {
//       msgBox: function(title, prompt, buttons) {
//           Logger.log("Dummy Browser.msgBox: " + title + " - " + prompt);
//       }
//   }
// }
