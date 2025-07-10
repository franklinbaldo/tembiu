# Automated Email Notifications - Conceptual Design

This document outlines a conceptual approach for implementing automated email notifications (e.g., order confirmations for customers, new order alerts for the restaurant) in the Tembiu application.

## 1. Overview

Automated emails enhance customer communication and streamline restaurant operations. Given Tembiu's client-side nature with Turso as a database, sending emails directly from the client is not secure or feasible. A serverless function approach is recommended.

## 2. Core Requirements

*   **Customer Order Confirmation**: Send an email to the customer with their order details upon successful checkout.
*   **Restaurant New Order Notification**: Send an email to a designated restaurant address when a new order is placed.
*   **Secure API Key Management**: API keys for email services must be kept secret.
*   **Scalability & Reliability**: The solution should handle a reasonable volume of emails reliably.

## 3. Proposed Architecture: Serverless Function + Email Service

### 3.1. Chosen Email Service (Hypothetical)

For this conceptual design, let's assume **Resend** ([resend.com](https://resend.com/)) as the email service provider due to its modern API and developer-friendly approach. Other services like SendGrid, Mailgun, or AWS SES are also viable alternatives.

### 3.2. Serverless Function (e.g., Cloudflare Worker, Vercel Function)

A serverless function will act as the backend to handle email sending.

*   **Endpoint(s)**:
    *   `/api/send-order-confirmation`: For sending customer confirmation emails.
    *   `/api/notify-restaurant-new-order`: For sending new order alerts to the restaurant.
*   **Authentication**: The serverless function endpoints should be protected (e.g., via a secret token passed from the client, or by restricting invocation origins if the platform supports it) to prevent abuse.
*   **Environment Variables**:
    *   `RESEND_API_KEY`: Securely store the Resend API key.
    *   `RESTAURANT_NOTIFICATION_EMAIL_ADDRESS`: The email address configured by the restaurant owner to receive new order alerts. This could be fetched from Turso by the serverless function if needed, or set as an environment variable too.
    *   `FROM_EMAIL_ADDRESS`: The email address from which notifications will be sent (e.g., `noreply@yourtembiudomain.com`).

### 3.3. Data Flow

#### a. Customer Order Confirmation

1.  **Checkout (`js/main.js`)**:
    *   During checkout, the customer provides their email address (new input field `customer-email` in `index.html`).
    *   This email is saved along with other address details in `localStorage` by `handleSaveAddress`.
    *   It should also be included in the `orderPayload` when `handleConfirmPayment` is called.
2.  **Order Persistence (`js/main.js` - `sendOrderToBackend`)**:
    *   The customer's email (`customer_email`) needs to be added as a column to the `orders` table in Turso and saved with the order.
3.  **Triggering Email (`js/main.js` - `handleConfirmPayment`)**:
    *   After `sendOrderToBackend` successfully saves the order to Turso:
        *   `js/main.js` makes an asynchronous `fetch` call to the `/api/send-order-confirmation` serverless endpoint.
        *   The payload to this endpoint includes `order_id`, `customer_email`, and relevant order details (or the function can fetch them from Turso using `order_id`).
4.  **Serverless Function (`/api/send-order-confirmation`)**:
    *   Receives the request.
    *   (Optional: Fetches full order details from Turso if not all provided in payload).
    *   Formats an HTML email template with order summary, restaurant name, etc.
    *   Uses the Resend API (with `RESEND_API_KEY`) to send the email to the `customer_email`.
    *   Logs success or failure.

#### b. New Order Notification to Restaurant

1.  **Triggering Email (`js/main.js` - `handleConfirmPayment`)**:
    *   Similar to customer confirmation, after `sendOrderToBackend` is successful:
        *   `js/main.js` makes an asynchronous `fetch` call to the `/api/notify-restaurant-new-order` serverless endpoint.
        *   Payload includes `order_id` and key order details.
2.  **Serverless Function (`/api/notify-restaurant-new-order`)**:
    *   Receives the request.
    *   Retrieves `RESTAURANT_NOTIFICATION_EMAIL_ADDRESS` (from env var or fetched from `restaurant_config` in Turso via `js/admin.js` and potentially passed in payload or fetched by function).
    *   Formats an HTML email template for the restaurant (e.g., new order received, items, customer details, delivery address).
    *   Uses the Resend API to send the email to the restaurant's notification address.
    *   Logs success or failure.

### 3.4. Configuration Updates

*   **`index.html`**: Add an input field for `customer-email` in the address/checkout form.
*   **`js/main.js`**:
    *   Modify `handleSaveAddress` to also save `customer-email` to `localStorage`.
    *   Modify `orderPayload` in `handleConfirmPayment` to include `customerEmail`.
    *   Modify `sendOrderToBackend` to save `customer_email` to the `orders` table in Turso (requires schema update).
    *   Add `fetch` calls to the serverless function endpoints after successful order submission.
*   **`admin.html`**: Add an input field for `restaurantNotificationEmail` in the Restaurant Configuration section.
*   **`js/admin.js`**: The existing `saveRestaurantConfigAdmin` will handle saving `restaurantNotificationEmail` to Turso (key: `restaurantNotificationEmail`).
*   **Turso Schema**:
    *   `orders` table: Add `customer_email TEXT` column.
    *   `restaurant_config` table: Will store `restaurantNotificationEmail` (already handled by generic key-value structure).

### 3.5. Email Templates

*   Simple, responsive HTML templates should be designed for:
    *   Order confirmation (logo, order summary, thank you message, link to shared order URL).
    *   New order notification (clear details for the restaurant to process the order).

## 4. Security Considerations

*   **API Key Protection**: Resend API key MUST be kept secret in serverless function environment variables.
*   **Endpoint Security**: Protect serverless endpoints from abuse (e.g., rate limiting, simple auth token if needed).
*   **Email Validation**: Basic client-side and potentially serverless-side validation for customer email format.
*   **Data Privacy**: Clearly state why the customer's email is being collected (for order confirmation).

## 5. Fallback & Error Handling

*   If the serverless function call fails from the client, the core ordering process should still complete. Email failure should not block order placement.
*   Log errors from the email service within the serverless function for debugging.

This conceptual design provides a pathway to implementing automated emails. The primary development effort would be in creating and deploying the serverless functions and integrating the client-side calls.
