document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("saved-items-container");
  const savedItems = JSON.parse(localStorage.getItem("savedProducts")) || [];

  if (savedItems.length === 0) {
    container.innerHTML = `<p class="empty-message">Your list is empty.</p>`;
    return;
  }

  // Different layout for saved items
  container.innerHTML = savedItems
    .map(
      (item) => `
      <div class="saved-card">
        <img src="${item.image}" alt="${item.title}" />
        <div class="saved-info">
          <h4>${item.title}</h4>
          <p>${item.price}</p>
          <button class="remove-btn" data-title="${item.title}">
            Remove
          </button>
        </div>
      </div>
    `
    )
    .join("");

  // Remove button functionality
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.target.dataset.title;
      const updatedItems = savedItems.filter((item) => item.title !== title);
      localStorage.setItem("savedProducts", JSON.stringify(updatedItems));
      location.reload(); // reload to update view
    });
  });
});