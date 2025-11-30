document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("saved-items-container");
    const sizeDropdown = document.getElementById("sizeDropdown");

    let savedItems = JSON.parse(localStorage.getItem("savedProducts")) || [];

    const colorMap = {
        "White": "#ffffff",
        "Black": "#000000",
        "Gray": "#bfbfbf",
        "Navy": "#001f3f"
    };

    function showEmpty() {
        container.innerHTML = `
            <p class="empty-message">Your list is empty</p>
            <a href="shop.html" class="saved-button">Continue Shopping</a>
        `;
    }

    function saveToLocal() {
        localStorage.setItem("savedProducts", JSON.stringify(savedItems));
    }

    function renderList() {
        if (!savedItems.length) return showEmpty();

        container.innerHTML = savedItems
            .map((item, index) => {
                const product = products.find(p => p.name === item.name);

                if (product) {
                    if (product.sizes?.length === 1 && !item.selectedSize) {
                        item.selectedSize = product.sizes[0];
                    }
                    if (product.colors?.length === 1 && !item.selectedColor) {
                        item.selectedColor = product.colors[0];
                    }
                }

                saveToLocal();

                const swatchesHTML = product.colors
                    .map(color => {
                        const cssColor = colorMap[color] || color;
                        const selected = item.selectedColor === color ? "selected" : "";
                        return `
                            <div class="swatch ${selected}" 
                                 style="background:${cssColor};" 
                                 data-color="${color}" 
                                 data-index="${index}">
                            </div>`;
                    })
                    .join("");

                return `
                    <div class="saved-card">
                        <div class="remove-x" data-index="${index}">
                            <i class="fa-solid fa-xmark"></i>
                        </div>

                        <div class="saved-thumb">
                            <img src="${item.img}" alt="${item.name}">
                        </div>

                        <div class="saved-info">
                            <h4>${item.name}</h4>
                            <p>${item.price}</p>
                        </div>

                        <div class="color-swatches">${swatchesHTML}</div>

                        <div class="saved-actions">
                            <button class="size-action-btn" data-index="${index}">
                                <span class="size-value">${item.selectedSize || "Size"}</span>
                            </button>

                            <button class="move-btn" data-index="${index}">
                                Move to Bag
                            </button>
                        </div>
                    </div>
                `;
            })
            .join("");

        attachHandlers();
    }

    function attachHandlers() {
        document.querySelectorAll(".remove-x").forEach(btn => {
            btn.addEventListener("click", () => {
                savedItems.splice(btn.dataset.index, 1);
                saveToLocal();
                renderList();
            });
        });

        document.querySelectorAll(".move-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.dataset.index;
                const item = savedItems[index];
                const product = products.find(p => p.name === item.name);

                // ⭐ If no size selected → open dropdown and DO NOT close it
                if (!item.selectedSize) {
                    const sizeBtn = document.querySelector(`.size-action-btn[data-index="${index}"]`);
                    openSizeDropdown(sizeBtn, index);
                    return;
                }

                const price = parseFloat(
                    (item.price || product.price).toString().replace(/[^0-9.]/g, "")
                );

                const cartItem = {
                    name: product.name,
                    img: item.img,
                    price,
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor
                };

                let cart = JSON.parse(localStorage.getItem("cartProducts")) || [];
                cart.push(cartItem);
                localStorage.setItem("cartProducts", JSON.stringify(cart));

                savedItems.splice(index, 1);
                saveToLocal();
                renderList();
            });
        });

        document.querySelectorAll(".size-action-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                e.stopPropagation();
                const index = btn.dataset.index;
                openSizeDropdown(btn, index);
            });
        });

        sizeDropdown.addEventListener("click", e => {
            if (e.target.tagName !== "LI") return;

            const index = sizeDropdown.getAttribute("data-for");
            const chosen = e.target.textContent.trim();

            savedItems[index].selectedSize = chosen;
            saveToLocal();

            document.querySelector(
                `.size-action-btn[data-index="${index}"] .size-value`
            ).textContent = chosen;

            sizeDropdown.classList.remove("open");
            setTimeout(() => sizeDropdown.style.display = "none", 180);
        });

        document.querySelectorAll(".swatch").forEach(swatch => {
            swatch.addEventListener("click", () => {
                const index = swatch.dataset.index;
                savedItems[index].selectedColor = swatch.dataset.color;
                saveToLocal();

                document.querySelectorAll(`.swatch[data-index="${index}"]`)
                    .forEach(s => s.classList.remove("selected"));

                swatch.classList.add("selected");
            });
        });

        // ⭐ FIX: dropdown should only close when clicking OUTSIDE AND not during Move to Bag
        document.addEventListener("click", e => {
            const clickedMove = e.target.classList.contains("move-btn");
            if (clickedMove) return; // do NOT close dropdown when clicking Move to Bag

            const clickedInsideDropdown = sizeDropdown.contains(e.target);
            const clickedSizeBtn = e.target.closest(".size-action-btn");

            if (!clickedInsideDropdown && !clickedSizeBtn) {
                sizeDropdown.classList.remove("open");
                setTimeout(() => (sizeDropdown.style.display = "none"), 180);
            }
        });
    }

    function openSizeDropdown(btn, index) {
        const item = savedItems[index];
        const product = products.find(p => p.name === item.name);

        sizeDropdown.querySelector("ul").innerHTML = product.sizes
            .map(size => `<li>${size}</li>`)
            .join("");

        const rect = btn.getBoundingClientRect();
        sizeDropdown.style.left = `${rect.left + rect.width / 2 - 75}px`;
        sizeDropdown.style.top = `${rect.bottom + window.scrollY + 10}px`;
        sizeDropdown.style.display = "block";

        setTimeout(() => sizeDropdown.classList.add("open"), 10);

        sizeDropdown.setAttribute("data-for", index);
    }

    renderList();
});