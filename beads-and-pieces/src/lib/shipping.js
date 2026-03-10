export function calculateShipping(subtotal, destination = "UK") {
  // Free shipping threshold
  if (subtotal >= 40) return 0;

  // Flat rate UK shipping
  if (destination === "UK") return 3.99;

  // Example: EU shipping
  if (destination === "EU") return 7.99;

  // Example: International
  return 12.99;
}
