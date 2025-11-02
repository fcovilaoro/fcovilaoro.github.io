// Single source of truth for your products — edit sizes/colors as needed.

const products = [
  {
    id: "P001",
    name: "RELAXED FIT PANTS",
    price: "1660",
    images: ["images/item9.WEBP","images/item8.WEBP"],
    colors: ["Navy"],
    sizes: ["32","34","36","38"]
  },
  {
    id: "P002",
    name: "RAGLAN OVERSIZE T-SHIRT",
    price: "1075",
    images: ["images/tshirt1.WEBP","images/tshirt2.AVIF","images/tshirt3.AVIF"],
    colors: ["White","Black","Navy"],
    sizes: ["XS","S","M","L","XL","XXL"]
  },
  {
    id: "P003",
    name: "BOXY JACKET",
    price: "3885",
    images: ["images/jacket1.AVIF","images/jacket2.AVIF","images/jacket3.AVIF"],
    colors: ["Black"],
    sizes: ["M","L","XL"]
  },
  {
    id: "P004",
    name: "BAGGY PANTS",
    price: "1620",
    images: ["images/pants1.WEBP","images/pants2.AVIF","images/pants3.AVIF"],
    colors: ["Gray"],
    sizes: ["36","38","40","42","44"]
  }
];

// Expose products variable globally (already global if loaded as script)