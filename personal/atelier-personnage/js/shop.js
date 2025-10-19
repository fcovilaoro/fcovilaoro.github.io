// js/shop.js
document.addEventListener("DOMContentLoaded", () => {
  const saveButtons = document.querySelectorAll(".product-item .button");

  saveButtons.forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();

      const item = button.closest(".product-item");
      const name = item.querySelector("h3").textContent;
      const price = item.querySelector("p").textContent;
      const img = item.querySelector("img").src;

      const product = { name, price, img };

      // Get current saved items
      let saved = JSON.parse(localStorage.getItem("savedProducts")) || [];

      // Check if product already exists
      const exists = saved.some(p => p.name === name && p.img === img);

      if (!exists) {
        saved.push(product);
        localStorage.setItem("savedProducts", JSON.stringify(saved));

        button.querySelector("i").classList.remove("fa-regular");
        button.querySelector("i").classList.add("fa-solid");
      } else {
        // Remove it if already saved
        saved = saved.filter(p => !(p.name === name && p.img === img));
        localStorage.setItem("savedProducts", JSON.stringify(saved));

        button.querySelector("i").classList.remove("fa-solid");
        button.querySelector("i").classList.add("fa-regular");
      }
    });
  });

  // Load icons based on saved state
  const savedProducts = JSON.parse(localStorage.getItem("savedProducts")) || [];
  saveButtons.forEach(button => {
    const item = button.closest(".product-item");
    const name = item.querySelector("h3").textContent;
    const img = item.querySelector("img").src;

    if (savedProducts.some(p => p.name === name && p.img === img)) {
      button.querySelector("i").classList.remove("fa-regular");
      button.querySelector("i").classList.add("fa-solid");
    }
  });
});