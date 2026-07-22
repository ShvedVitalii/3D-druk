// src/lib/priceUtils.ts

/**
 * Розраховує знижку у відсотках на основі старої та нової ціни
 */
export function calculateDiscount(originalPrice: number, newPrice: number): number {
  if (originalPrice <= 0 || newPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - newPrice) / originalPrice) * 100);
}

/**
 * Розраховує стару ціну на основі нової ціни та знижки
 */
export function calculateOldPrice(newPrice: number, discount: number): number {
  if (discount <= 0 || discount >= 100) return newPrice;
  return Math.round(newPrice / (1 - discount / 100));
}

/**
 * Розраховує нову ціну на основі старої ціни та знижки
 */
export function calculateNewPrice(originalPrice: number, discount: number): number {
  if (discount <= 0) return originalPrice;
  if (discount >= 100) return 0;
  return Math.round(originalPrice * (1 - discount / 100));
}