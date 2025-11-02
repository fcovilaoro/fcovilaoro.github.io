document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("saved-items-container");

  function showEmpty() {
    container.innerHTML = `<p class="empty-message">Your list is empty.</p>`;
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
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        </div>`
      )
      .join("");

    attachRemoveHandlers();
  }

  function attachRemoveHandlers() {
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        savedItems.splice(index, 1);
        localStorage.setItem("savedProducts", JSON.stringify(savedItems));
        renderList();

        // Update dot
        const bookmarkDot = document.querySelector(".bookmark-dot");
        if (bookmarkDot) {
          bookmarkDot.style.display = savedItems.length > 0 ? "block" : "none";
        }
      });
    });
  }

  renderList();
});