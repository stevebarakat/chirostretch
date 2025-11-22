export const getCurrentPromo = `
query GetCurrentPromo {
  currentPromo {
    promo {
      bottomLine
      middleLine
      price
      topLine
    }
  }
}`;
