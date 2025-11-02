document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("saved-items-container");
  const dropdown = document.getElementById("sizeDropdown");

  function showEmpty() {
    container.innerHTML = `<p class="empty-message">Your list is empty</p>`;
  }

  let savedItems = JSON.parse(localStorage.getItem("savedProducts")) || [];

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
            <button class="color-btn underline-btn">Color</button>
            <button class="size-btn underline-btn" data-index="${index}">Size</button>
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
        localStorage.setItem("savedProducts", JSON.stringify(savedItems));
        renderList();

        const bookmarkDot = document.querySelector(".bookmark-dot");
        if (bookmarkDot) {
          bookmarkDot.style.display = savedItems.length > 0 ? "block" : "none";
        }
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
        localStorage.setItem("savedProducts", JSON.stringify(savedItems));
        renderList();
      });
    });

    // Size button listeners (position & open)
    document.querySelectorAll(".size-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent document click closing it immediately

        // place dropdown under the clicked button, centered
        const btnRect = btn.getBoundingClientRect();

        // Make dropdown visible to calculate its width/height
        dropdown.style.display = "block";
        dropdown.style.opacity = "0"; // hide during measurement
        dropdown.style.left = "0px"; // reset
        dropdown.style.top = "0px";

        // Force layout/read so measurements are accurate
        const ddRect = dropdown.getBoundingClientRect();

        // calculate centered left, but keep within viewport
        const preferredLeft = btnRect.left + (btnRect.width / 2) - (ddRect.width / 2);
        let left = Math.max(8, preferredLeft); // not less than 8px
        // if dropdown would overflow right, clamp
        if (left + ddRect.width > window.innerWidth - 8) {
          left = window.innerWidth - ddRect.width - 8;
          dropdown.classList.add("right-edge");
        } else {
          dropdown.classList.remove("right-edge");
        }

        const top = btnRect.bottom + window.scrollY + 8; // 8px gap

        dropdown.style.left = `${left}px`;
        dropdown.style.top = `${top}px`;
        dropdown.style.opacity = ""; // restore
        dropdown.setAttribute("aria-hidden", "false");
      });
    });
  }

  // Clicking a size item
  dropdown.addEventListener("click", (e) => {
    const item = e.target;
    if (item.classList.contains("disabled")) return;
    if (item.tagName.toLowerCase() === "li") {
      const chosen = item.textContent.trim();
      // Example: show chosen size. Replace with your desired behavior (save selection, display on card, etc.)
      alert(`Selected size: ${chosen}`);
      dropdown.style.display = "none";
      dropdown.setAttribute("aria-hidden", "true");
    }
  });

  // Close dropdown on outside click or Escape
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.style.display = "none";
      dropdown.setAttribute("aria-hidden", "true");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdown.style.display = "none";
      dropdown.setAttribute("aria-hidden", "true");
    }
  });

  // If window resizes, hide dropdown (avoid misplacement)
  window.addEventListener("resize", () => {
    dropdown.style.display = "none";
    dropdown.setAttribute("aria-hidden", "true");
  });

  renderList();
});