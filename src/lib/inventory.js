import products from "@/data/products.json";
import fs from "fs";
import path from "path";

export function getProduct(id) {
  return products.find((p) => p.id === id);
}

export function reduceStock(orderItems) {
  orderItems.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      product.stock -= item.quantity;
      if (product.stock < 0) product.stock = 0;
    }
  });

  // Save updated stock back to file
  const filePath = path.join(process.cwd(), "src/data/products.json");
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}
