# Smart Scheduling with Google Maps - Conceptual Design

This document outlines a conceptual approach for integrating Google Maps (specifically, Google Places API) to automate the restaurant's open/closed status in the Tembiu application.

## 1. Overview

Currently, Tembiu uses manually configured open times, close times, and a timezone (`restaurantConfig.openTime`, `restaurantConfig.closeTime`, `restaurantConfig.timezone`) to determine if the restaurant is open. Integrating Google Places API can provide more accurate, real-time opening hours as maintained by the restaurant owner on their Google Business Profile.

## 2. Core Components & API

*   **Google Places API**: The "Place Details" service can return detailed information about a specific establishment, including `opening_hours`.
    *   `opening_hours.open_now`: A boolean indicating if the place is currently open.
    *   `opening_hours.periods`: An array of opening periods.
    *   `opening_hours.weekday_text`: Human-readable opening hours for the week.
    *   `utc_offset_minutes`: The offset from UTC in minutes, useful for timezone calculations if not relying solely on `open_now`.
*   **Google Place ID**: A unique textual identifier for a place on Google Maps. This ID needs to be configured for the restaurant.
*   **API Key**: A Google Cloud API key is required, with the Places API enabled. **This key must be kept secure and not exposed client-side.**

## 3. Proposed Conceptual Approach

A direct client-side call to Google Places API is not recommended due to API key exposure and potential quota abuse. A serverless function acting as a proxy is the preferred method.

### 3.1. Configuration

1.  **Admin Panel (`admin.html`, `js/admin.js`)**:
    *   A new field "Google Place ID" (`googlePlaceId`) is added to the restaurant configuration form.
    *   The restaurant owner can find and save their establishment's Place ID here. This value will be stored in the `restaurant_config` table in Turso.

### 3.2. Client-Side Logic (`js/main.js`)

1.  **Modified `initOpenStatus()` function**:
    *   When `initOpenStatus()` is called, it first checks if `restaurantConfig.googlePlaceId` is available and valid.
    *   **If `googlePlaceId` exists**:
        *   It makes an asynchronous call to a dedicated, secure serverless function endpoint (e.g., `/api/get-google-opening-hours`), passing the `googlePlaceId`.
        *   The serverless function (see below) queries the Google Places API and returns the `opening_hours` data (or a simplified version, like just `open_now` and a descriptive string for next opening/closing time).
        *   If the API call is successful and returns valid data:
            *   Use `opening_hours.open_now` to set the primary "Open" / "Closed" status.
            *   Optionally, use `opening_hours.weekday_text` or formatted period data to display more detailed hours (e.g., "Closes at 10:00 PM" or "Opens tomorrow at 9:00 AM").
        *   If the API call fails or returns no data, fall back to the manual time configuration.
    *   **If `googlePlaceId` does not exist or is invalid**:
        *   Fall back to the current manual time logic using `restaurantConfig.openTime`, `restaurantConfig.closeTime`, and `restaurantConfig.timezone`.

### 3.3. Serverless Function Proxy (e.g., Cloudflare Worker, Vercel Function)

This is a crucial component for security and abstraction.

1.  **Endpoint**: Create an endpoint like `/api/get-google-opening-hours`.
2.  **Request**: Accepts a `placeId` as a query parameter.
3.  **Logic**:
    *   Retrieves the Google Cloud API Key (with Places API enabled) from secure environment variables.
    *   Constructs a request to the Google Places API:
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=<PLACE_ID>&fields=opening_hours,utc_offset_minutes&key=<YOUR_API_KEY>`
    *   Parses the response from Google.
    *   Returns a simplified JSON response to the client, e.g.:
        ```json
        {
          "is_open": true, // from open_now
          "status_text": "Open now", // or "Closes at 10:00 PM"
          "next_change_time": "22:00", // if applicable
          "error": null // or an error message
        }
        ```
4.  **Error Handling**: Implement robust error handling for API key issues, invalid Place IDs, Google API errors, etc.
5.  **Caching (Optional but Recommended)**: To reduce API calls to Google (and potential costs), the serverless function could cache results from the Places API for a short period (e.g., 5-15 minutes).

## 4. Security and Cost

*   **API Key Security**: The Google Maps API key **must** be stored as a secret environment variable in the serverless function environment, never exposed client-side.
*   **API Quotas & Costs**: Google Places API calls are not free beyond a certain quota. Monitor usage. Caching helps.
*   **Endpoint Security**: The serverless function endpoint itself could be rate-limited or have other security measures if abuse is a concern.

## 5. Fallback Mechanism

The system must gracefully fall back to manual opening hours if:
*   `googlePlaceId` is not configured.
*   The serverless function call fails.
*   The Google Places API returns an error or no data for the given Place ID.

## 6. UI Indication

Consider providing a small visual cue in the UI if the hours are being sourced from Google Maps vs. manual entry, for transparency to the restaurant owner (perhaps in the admin panel).

This conceptual design provides a more robust and accurate way to manage restaurant opening hours, leveraging the authoritative data from Google Business Profile.
