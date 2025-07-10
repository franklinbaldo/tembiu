# Advanced PWA: Offline Order Queuing - Conceptual Design

This document outlines a conceptual approach for implementing offline order queuing in the Tembiu PWA. This feature would allow users to build an order and "pseudo-checkout" while offline, with the actual order submission to the Turso backend occurring once connectivity is restored.

## 1. Overview

Users in areas with intermittent connectivity could benefit from being able to prepare their order offline. The PWA currently caches static assets for offline viewing. This feature extends offline capabilities to order creation.

## 2. Core Objectives

*   Allow users to add items to the cart while offline.
*   Allow users to proceed through a modified checkout flow while offline, saving the order details locally.
*   Provide a mechanism to submit these queued orders to the backend (Turso) when the user is back online.
*   Clearly communicate offline status and the state of queued orders to the user.

## 3. Proposed Architecture & Logic

### 3.1. Detecting Network Status

*   Use `navigator.onLine` to get an initial idea of the network status.
*   Listen to `window.addEventListener('online', ...)` and `window.addEventListener('offline', ...)` to react to changes in connectivity.
*   Display a persistent but unobtrusive offline indicator in the UI (e.g., a small banner) when `navigator.onLine` is `false`.

### 3.2. Offline Cart & Checkout

1.  **Cart Management**: The existing in-memory `cart` array in `js/main.js` will function as usual while the app is open, even offline. For persistence across sessions if the user closes the tab/browser while offline, the cart could be periodically synced to `localStorage`.
2.  **Modified Checkout (`handleCheckout` in `js/main.js`)**:
    *   When `handleCheckout` is called:
        *   Check `navigator.onLine`.
        *   **If Online**: Proceed with the normal checkout flow (address form, PIX/Google Pay, `handleConfirmPayment`).
        *   **If Offline**:
            *   Prevent calls to `generateAndDisplayPix` or Google Pay initialization.
            *   Display a message: "Você está offline. Gostaria de salvar este pedido para enviá-lo quando estiver online novamente?" (You are offline. Would you like to save this order to send it when you are back online?).
            *   Provide "Salvar Pedido Offline" (Save Order Offline) and "Cancelar" (Cancel) buttons.
            *   The address form should still be usable to collect delivery details.
3.  **Saving Offline Order (`handleSaveOrderOffline` - new function)**:
    *   If "Salvar Pedido Offline" is clicked:
        *   Collect all necessary order data:
            *   Current cart items (name, quantity, price at time of offline checkout).
            *   Saved address from `localStorage` (via `getSavedAddress()`).
            *   Customer email from `localStorage` (if collected).
            *   A unique client-generated ID for this queued order (e.g., `OFFLINE-ORD-${Date.now()}`).
            *   Timestamp of offline checkout.
        *   Store this order object in an array in `localStorage` under a key like `tembiuOfflineOrdersQueue`.
        *   Provide feedback: "Pedido salvo offline. Ele será enviado quando você estiver online."
        *   Clear the current cart (as if checkout was completed).
        *   Update UI to show an indicator that there are pending offline orders.

### 3.4. Managing and Syncing Queued Orders

1.  **Offline Queue Indicator**:
    *   Display a noticeable indicator in the UI (e.g., in the header, or near the cart icon) when `localStorage.getItem('tembiuOfflineOrdersQueue')` contains orders.
    *   Clicking this could lead to a simple view of queued orders.
2.  **Viewing/Managing Queued Orders (Optional UI)**:
    *   A simple UI could list queued orders with basic details and an option to "Remover da Fila" (Remove from Queue).
3.  **Automatic Sync Attempt on Reconnect**:
    *   When `window.addEventListener('online', ...)` fires:
        *   Check `tembiuOfflineOrdersQueue`.
        *   If orders are present, prompt the user: "Você está online novamente. Deseja enviar [N] pedidos salvos offline?" (You are back online. Do you want to send [N] orders saved offline?).
        *   If confirmed, iterate through each queued order:
            *   Call a modified version of the payment/order submission logic (e.g., `submitQueuedOrder(queuedOrderData)`).
            *   This function would essentially re-run the core parts of `handleConfirmPayment`, including calling `sendOrderToBackend(orderPayload)`.
            *   **Data Validation (Important Consideration)**:
                *   **Prices/Availability**: Decide if item prices and availability should be re-validated against the current live menu from Turso.
                    *   *Option 1 (Simpler)*: Honor prices/items at the time of offline checkout. Risk: price changes, item unavailable.
                    *   *Option 2 (Safer for Restaurant)*: Re-validate. If discrepancies, inform user and potentially move order back to cart for review. This is more complex.
                *   For this conceptual phase, Option 1 is assumed for simplicity, but Option 2 should be noted as a production consideration.
            *   If `sendOrderToBackend` is successful:
                *   Remove the order from `tembiuOfflineOrdersQueue` in `localStorage`.
                *   Optionally, notify user of successful submission.
            *   If `sendOrderToBackend` fails (e.g., specific item now truly unavailable even if not re-validating price):
                *   Keep the order in the queue.
                *   Notify the user of the specific failure and that the order remains queued.
        *   Update the offline queue indicator.
4.  **Manual Sync Trigger**:
    *   Provide a button (e.g., "Sincronizar Pedidos Offline") if the user dismisses the automatic prompt or wants to retry later.

### 3.5. Service Worker & Background Sync (Advanced - Future Consideration)

*   The [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Sync_API) could be used by the service worker to attempt order submission in the background when connectivity returns, even if the user has closed the tab.
*   This involves registering a `sync` event in the service worker. When the browser deems conditions suitable (connectivity restored), it fires this event.
*   This is more robust but adds significant complexity to the service worker logic and communication between the page and the service worker (e.g., for passing order data to be synced).
*   For this initial conceptual design, focus on `localStorage` and user-prompted/foreground sync.

## 4. UI/UX Considerations

*   **Clarity**: Users must understand when they are offline, what actions they can take, and the status of their queued orders.
*   **Feedback**: Provide immediate feedback for actions like saving an order offline, successful submission from queue, or submission failures.
*   **Control**: Users should be able to view and (at least) remove orders from the offline queue.

## 5. Potential Issues & Edge Cases

*   **Data Conflicts**: Changes in menu item availability or pricing between offline queuing and online submission.
*   **Queue Size**: `localStorage` has limits (typically 5-10MB). Very large numbers of complex queued orders could hit this, but unlikely for typical use.
*   **Sync Failures**: Repeated failures to sync an order need a clear resolution path for the user.

This conceptual design provides a foundation for building an offline order queuing system. Implementation would require careful state management and UI updates in `js/main.js`.
