export function generateProductSchema(config: any) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Custom Neon Sign",
    "image": config.imageUrl || "/default-neon.jpg",
    "description": `Custom neon sign: ${config.line1}${config.line2 ? ` & ${config.line2}` : ''}`,
    "brand": {
      "@type": "Brand",
      "name": "NEONTJ"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": config.price,
      "availability": "https://schema.org/InStock",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "US"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": "1",
            "maxValue": "2"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": "2",
            "maxValue": "3"
          }
        }
      }
    }
  });
}