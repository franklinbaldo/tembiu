// Minimal Google Pay integration for Tembiu
// Uses Stripe gateway for demonstration purposes.

let googlePayClient;

function onGooglePayLoaded() {
    if (!window.google || !google.payments) {
        console.warn("Google Pay library not available.");
        return;
    }
    googlePayClient = new google.payments.api.PaymentsClient({ environment: "TEST" });
    const button = googlePayClient.createButton({ onClick: onGooglePayButtonClicked });
    const container = document.getElementById("google-pay-button");
    if (container) {
        container.appendChild(button);
    }
}

function onGooglePayButtonClicked() {
    if (!googlePayClient) return;
    const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
            type: "CARD",
            parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["VISA", "MASTERCARD"]
            },
            tokenizationSpecification: {
                type: "PAYMENT_GATEWAY",
                parameters: {
                    gateway: "stripe",
                    gatewayMerchantId: "tembiuGateway"
                }
            }
        }],
        merchantInfo: {
            merchantId: "01234567890123456789",
            merchantName: "Tembiu Demo"
        },
        transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPrice: "1.00",
            currencyCode: "BRL"
        }
    };

    googlePayClient.loadPaymentData(paymentDataRequest)
        .then(paymentData => {
            console.log("Received Google Pay payment data:", paymentData);
            alert("Google Pay payment autorizado (simulado).");
        })
        .catch(err => {
            console.error("Google Pay payment failed:", err);
        });
}
