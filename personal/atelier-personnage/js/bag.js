document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("bag-items-container");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");
    const orderSummary = document.querySelector(".order-summary");
    const sectionTitle = document.querySelector(".section-title"); // <--- grab the title

    let bagItems = JSON.parse(localStorage.getItem("cartProducts")) || [];

    function saveToLocal() {
        localStorage.setItem("cartProducts", JSON.stringify(bagItems));
    }

    function showEmpty() {
        container.innerHTML = `
            <div class="empty-state">
                <p class="empty-message">Your bag is empty</p>
                <a href="shop.html" class="saved-button">Continue Shopping</a>
            </div>
        `;
        subtotalEl.textContent = "$0.00";
        totalEl.textContent = "$0.00";

        // Hide the order summary and title
        orderSummary.style.display = "none";
        sectionTitle.style.display = "none"; // <---
    }

    function calculateTotals() {
        const subtotal = bagItems.reduce((sum, item) => {
            const price = parseFloat(item.price);
            return sum + (isNaN(price) ? 0 : price);
        }, 0);

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    function renderBag() {
        if (!bagItems.length) {
            showEmpty();
            return;
        }

        // Show the order summary and title again
        orderSummary.style.display = "block";
        sectionTitle.style.display = "block"; // <---

        container.innerHTML = bagItems
            .map((item, index) => `
                <div class="bag-card">
                    <div class="bag-thumb">
                        <img src="${item.img || item.images?.[0]}" alt="${item.name}">
                    </div>

                    <div class="bag-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price}</p>
                        <p>Size: ${item.selectedSize || "-"}</p>
                        <p>Color: ${item.selectedColor || "-"}</p>
                    </div>

                    <div class="bag-actions">
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                </div>
            `)
            .join("");

        calculateTotals();
        attachHandlers();
    }

    function attachHandlers() {
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.dataset.index);
                bagItems.splice(index, 1);
                saveToLocal();
                renderBag();
            });
        });
    }

    renderBag();
});