# Web Push Notifications for Tembiu - Conceptual Design

This document outlines a conceptual approach for implementing web push notifications for order status updates in the Tembiu application. Full implementation is a significant feature requiring careful consideration of security and infrastructure.

## 1. Overview

Web Push Notifications allow the application to send messages to users even when they are not actively browsing the site. This is useful for notifying customers about important order status changes (e.g., "Your order is confirmed," "Your order is out for delivery").

## 2. Core Components & Flow

A standard Web Push implementation involves:

*   **Service Worker**: A script that runs in the background, separate from the web page, and is responsible for receiving and displaying push messages.
*   **Push Service**: A browser vendor-specific intermediary service (e.g., Firebase Cloud Messaging - FCM for Chrome, Mozilla Push Service for Firefox) that manages message delivery.
*   **User Permission**: The user must explicitly grant permission for the site to send them push notifications.
*   **Push Subscription**: Once permission is granted, the browser provides a unique Push Subscription object. This object contains an `endpoint` URL (specific to the user and browser) and encryption keys.
*   **Application Server (or equivalent)**: A backend component that:
    1.  Securely stores user push subscriptions.
    2.  Uses these subscriptions and a push service's API (with appropriate authentication, like a VAPID key pair or FCM server key) to send push messages.

## 3. Proposed Conceptual Approach for Tembiu

Given Tembiu's current architecture (client-side focus with Turso as the database), a full implementation would likely require introducing a minimal server-side component, ideally as a serverless function for cost-effectiveness and simplicity.

### 3.1. User-Side (Client - `index.html`, `js/main.js`)

1.  **Requesting Permission**:
    *   Offer a button or toggle (e.g., in a user settings area if implemented, or after a successful order) for users to "Enable Order Notifications."
    *   When clicked, use the `Notification.requestPermission()` API.
2.  **Generating & Storing Subscription**:
    *   If permission is granted, use `ServiceWorkerRegistration.pushManager.subscribe()` to get a `PushSubscription` object.
        *   This requires VAPID public keys to be provided during subscription. These keys are generated once for the application.
    *   **Conceptual Storage**: The `PushSubscription` object (JSON stringified) needs to be associated with the user or their orders.
        *   *Without user accounts*: Could be stored in `localStorage` (less reliable, device-specific) or potentially sent to Turso alongside an order, associated with `order_id`. This has privacy implications if not handled carefully.
        *   *With user accounts (future)*: Store against the user's profile in Turso.
3.  **Service Worker (`sw.js`)**:
    *   The existing `sw.js` would need a `push` event listener.
    *   When a push message is received, this listener would be responsible for displaying a notification using `ServiceWorkerRegistration.showNotification()`. The notification payload (title, body, icon, etc.) would come from the push message.

### 3.2. Admin-Side (`admin.html`, `js/admin.js`)

1.  **UI Trigger**:
    *   The "Notificar Cliente (Conceitual)" button in the order details modal.
2.  **Action**:
    *   When clicked, this button would trigger a process to send a notification for the specific order.

### 3.3. Push Message Triggering (The "Backend" Part)

This is where a serverless function is recommended:

1.  **Serverless Function (e.g., Cloudflare Worker, Vercel Function)**:
    *   Create a secure HTTP endpoint (e.g., `/api/send-notification`).
    *   This endpoint would accept parameters like `order_id` (or `user_id`) and the message content/type.
    *   The admin panel would make an authenticated request to this endpoint.
2.  **Function Logic**:
    *   The serverless function connects to Turso.
    *   It retrieves the stored `PushSubscription` object for the given `order_id` or `user_id`.
    *   It formats the push message payload.
    *   It uses a library (like `web-push`) and its VAPID keys (or FCM server key if using FCM directly) to send the message to the `endpoint` URL from the retrieved `PushSubscription`.
    *   Handles responses from the push service (success, error, unsubscribed).

### 3.4. VAPID Keys

*   Voluntary Application Server Identification (VAPID) keys are a pair of public and private keys used to authenticate your application server with push services.
*   These would need to be generated once. The public key is used client-side when subscribing, and the private key is used by the serverless function (kept secret).

## 4. Security & Privacy Considerations

*   **Subscription Storage**: Push subscriptions are sensitive. Store them securely.
*   **Serverless Function Security**: The endpoint for triggering pushes must be secured to prevent abuse (e.g., authentication, rate limiting).
*   **VAPID/Server Keys**: Private keys must be kept confidential on the server-side (serverless function environment variables).
*   **User Control**: Users must be able to easily unsubscribe from notifications.

## 5. Next Steps (If Proceeding Beyond Conceptual)

1.  Generate VAPID keys.
2.  Implement client-side permission request and subscription logic.
3.  Develop the service worker's `push` event handler.
4.  Set up a serverless function project.
5.  Implement the serverless function logic for retrieving subscriptions and sending push messages.
6.  Secure the serverless function endpoint.
7.  Wire up the admin panel button to call the serverless function.
8.  Thorough testing.

This conceptual outline provides a roadmap. Actual implementation details would need further refinement.
