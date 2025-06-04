# Google Pay Integration Guide

This guide provides a basic overview of how to enable the Google Pay button in Tembiu.

## 1. Enable Google Pay API

1. Access the [Google Pay API documentation](https://developers.google.com/pay/api/web/guides/tutorial).
2. Create or use an existing Google Pay merchant account.
3. Obtain your `merchantId` and configure a payment gateway (for example, Stripe or another supported provider).

## 2. Configure `js/google_pay.js`

The file `js/google_pay.js` contains a minimal example using the `google.payments.api` library in **TEST** mode. Replace the placeholder `gateway` and `gatewayMerchantId` with your payment gateway details and update the `merchantId` and `merchantName` fields:

```javascript
const paymentDataRequest = {
  // ...
  tokenizationSpecification: {
    type: 'PAYMENT_GATEWAY',
    parameters: {
      gateway: 'YOUR_GATEWAY',
      gatewayMerchantId: 'YOUR_ID'
    }
  },
  merchantInfo: {
    merchantId: 'YOUR_MERCHANT_ID',
    merchantName: 'YOUR_RESTAURANT'
  }
};
```

## 3. Testing

With the placeholders filled, load the app locally and the Google Pay button will appear after checkout. When pressed, the API will prompt a test payment and log the result in the browser console.

This example is intended as a starting point and does not handle real payment confirmation. For production use, consult the official Google Pay documentation and implement secure backend processing.

