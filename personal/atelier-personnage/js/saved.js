document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("saved-items-container");
  const sizeDropdown = document.getElementById("sizeDropdown");
  const colorDropdown = document.getElementById("colorDropdown");

  let savedItems = JSON.parse(localStorage.getItem("savedProducts")) || [];

  function showEmpty() {
    container.innerHTML = `<p class="empty-message">Your list is empty</p>`;
  }

  function saveToLocal() {
    localStorage.setItem("savedProducts", JSON.stringify(savedItems));
  }

  function renderList() {
    if (!savedItems.length) {
      showEmpty();
      return;
    }

    container.innerHTML = savedItems
      .map(
        (item, index) => `
        <div class="saved-card">
          <div class="saved-thumb">
            <img src="${item.img}" alt="${item.name}" />
          </div>
          <div class="saved-info">
            <h4>${item.name}</h4>
            <p>${item.price}</p>
          </div>
          <div class="options">
            <button class="color-btn underline-btn" data-index="${index}">
              Color: <span class="color-value">${item.selectedColor || ""}</span>
            </button>
            <button class="size-btn underline-btn" data-index="${index}">
              Size: <span class="size-value">${item.selectedSize || ""}</span>
            </button>
          </div>
          <div class="saved-actions">
            <button class="move-btn" data-index="${index}">Move to Cart</button>
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        </div>`
      )
      .join("");

    attachHandlers();
  }

  function attachHandlers() {
    // Remove item
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        savedItems.splice(index, 1);
        saveToLocal();
        renderList();
      });
    });

    // Move to cart
    document.querySelectorAll(".move-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        const item = savedItems[index];
        let cartItems = JSON.parse(localStorage.getItem("cartProducts")) || [];
        cartItems.push(item);
        localStorage.setItem("cartProducts", JSON.stringify(cartItems));
        savedItems.splice(index, 1);
        saveToLocal();
        renderList();
      });
    });

    // Handle dropdown openings (color + size)
    document.querySelectorAll(".size-btn, .color-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const index = parseInt(btn.dataset.index);
        const savedItem = savedItems[index];
        const productData = products.find(
          (p) => p.name === savedItem.name
        ); // Match from products.js

        const isSize = btn.classList.contains("size-btn");
        const dropdown = isSize ? sizeDropdown : colorDropdown;

        // Clear current dropdown options
        dropdown.querySelector("ul").innerHTML = "";

        // Get product-specific options
        const options = isSize ? productData.sizes : productData.colors;

        // Build list dynamically
        options.forEach((opt) => {
          const li = document.createElement("li");
          li.textContent = opt;
          dropdown.querySelector("ul").appendChild(li);
        });

        // Hide both before showing selected one
        [sizeDropdown, colorDropdown].forEach((d) => (d.style.display = "none"));

        // Position dropdown
        const btnRect = btn.getBoundingClientRect();
        dropdown.style.display = "block";
        dropdown.style.opacity = "0";
        dropdown.style.left = "0px";
        dropdown.style.top = "0px";

        const ddRect = dropdown.getBoundingClientRect();
        const preferredLeft =
          btnRect.left + btnRect.width / 2 - ddRect.width / 2;
        let left = Math.max(8, preferredLeft);
        if (left + ddRect.width > window.innerWidth - 8) {
          left = window.innerWidth - ddRect.width - 8;
        }

        const top = btnRect.bottom + window.scrollY + 8;
        dropdown.style.left = `${left}px`;
        dropdown.style.top = `${top}px`;
        dropdown.style.opacity = "";
        dropdown.setAttribute("data-for", btn.dataset.index);
        dropdown.setAttribute("data-type", isSize ? "size" : "color");
      });
    });
  }

  // Handle selections (color + size)
  [sizeDropdown, colorDropdown].forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      const item = e.target;
      if (item.tagName.toLowerCase() !== "li") return;

      const chosen = item.textContent.trim();
      const type = dropdown.getAttribute("data-type");
      const index = parseInt(dropdown.getAttribute("data-for"));

      // Update in memory
      if (type === "size") savedItems[index].selectedSize = chosen;
      if (type === "color") savedItems[index].selectedColor = chosen;

      // Save to localStorage
      saveToLocal();

      // Update label visually
      const span = document.querySelector(
        `.${type}-btn[data-index="${index}"] .${type}-value`
      );
      if (span) span.textContent = chosen;

      dropdown.style.display = "none";
    });
  });

  // Close dropdowns on outside click or escape
  document.addEventListener("click", (e) => {
    if (!sizeDropdown.contains(e.target) && !colorDropdown.contains(e.target)) {
      sizeDropdown.style.display = "none";
      colorDropdown.style.display = "none";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      sizeDropdown.style.display = "none";
      colorDropdown.style.display = "none";
    }
  });

  window.addEventListener("resize", () => {
    sizeDropdown.style.display = "none";
    colorDropdown.style.display = "none";
  });

  renderList();
});