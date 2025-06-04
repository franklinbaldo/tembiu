// Minimal Google Pay integration for Tembiu
// This implementation runs in TEST environment and only logs the payment data.

let googlePayClient;

function onGooglePayLoaded() {
    if (!window.google || !google.payments) {
        console.warn('Google Pay library not available.');
        return;
    }
    googlePayClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
    const button = googlePayClient.createButton({ onClick: onGooglePayButtonClicked });
    const container = document.getElementById('google-pay-button');
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
            type: 'CARD',
            parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['VISA', 'MASTERCARD']
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    gateway: 'example', // replace with real gateway
                    gatewayMerchantId: 'exampleGatewayMerchantId'
                }
            }
        }],
        merchantInfo: {
            merchantId: 'B0123456789012345678', // placeholder merchant ID
            merchantName: 'Tembiu Demo'
        },
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: '1.00', // placeholder price
            currencyCode: 'BRL'
        }
    };

    googlePayClient.loadPaymentData(paymentDataRequest)
        .then(paymentData => {
            console.log('Received Google Pay payment data:', paymentData);
            alert('Google Pay payment autorizado (simulado).');
        })
        .catch(err => {
            console.error('Google Pay payment failed:', err);
        });
}
