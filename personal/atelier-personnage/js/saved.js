document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("saved-items-container");

  // Get saved products from localStorage
  let savedItems = JSON.parse(localStorage.getItem("savedProducts")) || [];

  // Render empty message
  function showEmpty() {
    container.innerHTML = `<p class="empty-message">Your list is empty.</p>`;
  }

  // Render all saved items
  function renderList() {
    if (!savedItems.length) {
      // ✅ No saved items → remove the indicator from header
      localStorage.removeItem("hasSavedItems");
      return showEmpty();
    }

    container.innerHTML = savedItems
      .map((item, index) => `
        <div class="saved-card">
          <div class="saved-thumb">
            <img src="${item.img || item.image}" alt="${item.name || item.title}" />
          </div>
          <div class="saved-info">
            <h4>${item.name || item.title}</h4>
            <p>${item.price || ""}</p>
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        </div>
      `)
      .join("");

    attachRemoveHandlers();
  }

  // Remove item from list
  function attachRemoveHandlers() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        savedItems.splice(index, 1); // Remove only this item
        localStorage.setItem("savedProducts", JSON.stringify(savedItems));

        // ✅ If there are no saved items left, remove the dot indicator
        if (savedItems.length === 0) {
          localStorage.removeItem("hasSavedItems");
        }

        renderList(); // Re-render the list
      });
    });
  }

  // Initial render
  renderList();
});