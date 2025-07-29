// src/utils/pricing.ts

// Internal markup calculation
const calculateMarkup = (basePrice: number) => {
  if (basePrice <= 49) return 10;
  if (basePrice <= 500) return basePrice * 0.35;
  if (basePrice <= 750) return basePrice * 0.25;
  if (basePrice <= 1000) return basePrice * 0.20;
  if (basePrice <= 1500) return basePrice * 0.15;
  return basePrice * 0.10;
};

// Get final price with hidden markup (synchronous version)
export const getPriceDetails = (basePrice: number) => {
  const markup = calculateMarkup(basePrice);
  const finalPrice = basePrice + markup;

  return {
    basePrice,
    markup,
    finalPrice
  };
};

// Format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
};

// Calculate shipping cost
export const calculateShipping = (price: number): number => {
  if (price > 500) return 0; // Free shipping for orders over $500
  if (price > 200) return 25;
  return 35;
};

// Calculate tax (New Orleans specific)
export const calculateTax = (price: number): number => {
  // Louisiana state tax 4.45% + Orleans Parish tax 5%
  return price * 0.0945;
};