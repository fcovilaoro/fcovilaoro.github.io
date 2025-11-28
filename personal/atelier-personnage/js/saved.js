document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("saved-items-container");
    const sizeDropdown = document.getElementById("sizeDropdown");

    let savedItems = JSON.parse(localStorage.getItem("savedProducts")) || [];

    // Map your product names to real CSS color values
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
        if (!savedItems.length) {
            showEmpty();
            return;
        }

        container.innerHTML = savedItems
            .map((item, index) => {
                const productData = products.find(p => p.name === item.name);

                if (productData) {
                    if (productData.sizes?.length === 1 && !item.selectedSize) {
                        item.selectedSize = productData.sizes[0];
                    }
                    if (productData.colors?.length === 1 && !item.selectedColor) {
                        item.selectedColor = productData.colors[0];
                    }
                }

                saveToLocal();

                const swatchesHTML = productData.colors
                    .map(color => {
                        const cssColor = colorMap[color] || color;
                        const selectedClass = item.selectedColor === color ? "selected" : "";
                        return `
                            <div class="swatch ${selectedClass}" 
                                 style="background:${cssColor};" 
                                 data-color="${color}" 
                                 data-index="${index}"></div>
                        `;
                    })
                    .join("");

                return `
                    <div class="saved-card">
                        <div class="remove-x" data-index="${index}">
                            <i class="fa-solid fa-xmark"></i>
                        </div>

                        <div class="saved-thumb">
                            <img src="${item.img}" alt="${item.name}" />
                        </div>

                        <div class="saved-info">
                            <h4>${item.name}</h4>
                            <p>${item.price}</p>
                        </div>

                        <div class="color-swatches">
                            ${swatchesHTML}
                        </div>

                        <div class="saved-actions">
                            <button class="size-action-btn" data-index="${index}">
                                Size <span class="size-value">${item.selectedSize || ""}</span>
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
        // REMOVE
        document.querySelectorAll(".remove-x").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.dataset.index);
                savedItems.splice(index, 1);
                saveToLocal();
                renderList();
            });
        });

        // MOVE TO BAG
        document.querySelectorAll(".move-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.dataset.index);
                const item = savedItems[index];
                const productData = products.find(p => p.name === item.name);

                if (!item.selectedSize) {
                    const sizeBtn = document.querySelector(`.size-action-btn[data-index="${index}"]`);
                    sizeBtn.style.borderColor = "red";
                    setTimeout(() => sizeBtn.style.borderColor = "black", 800);
                    sizeBtn.click();
                    return;
                }

                const numericPrice = parseFloat(
                    (item.price || productData.price || "0").toString().replace(/[^0-9.]/g, "")
                );

                const cartItem = {
                    id: productData.id || item.id,
                    name: productData.name,
                    price: numericPrice,
                    img: item.img,
                    selectedColor: item.selectedColor,
                    selectedSize: item.selectedSize
                };

                let cartItems = JSON.parse(localStorage.getItem("cartProducts")) || [];
                cartItems.push(cartItem);
                localStorage.setItem("cartProducts", JSON.stringify(cartItems));

                savedItems.splice(index, 1);
                saveToLocal();
                renderList();
            });
        });

        // SIZE DROPDOWN
        document.querySelectorAll(".size-action-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();

                const index = parseInt(btn.dataset.index);
                const savedItem = savedItems[index];
                const productData = products.find(p => p.name === savedItem.name);

                sizeDropdown.querySelector("ul").innerHTML = "";

                productData.sizes.forEach(size => {
                    const li = document.createElement("li");
                    li.textContent = size;
                    if (size === savedItem.selectedSize) li.classList.add("selected");
                    sizeDropdown.querySelector("ul").appendChild(li);
                });

                const rect = btn.getBoundingClientRect();
                sizeDropdown.style.display = "block";
                sizeDropdown.style.left = `${rect.left + rect.width / 2 - 75}px`;
                sizeDropdown.style.top = `${rect.bottom + window.scrollY + 10}px`;

                sizeDropdown.setAttribute("data-for", index);
            });
        });

        sizeDropdown.addEventListener("click", (e) => {
            if (e.target.tagName !== "LI") return;

            const index = parseInt(sizeDropdown.getAttribute("data-for"));
            const selected = e.target.textContent.trim();

            savedItems[index].selectedSize = selected;
            saveToLocal();

            document.querySelector(`.size-action-btn[data-index="${index}"] .size-value`).textContent = selected;

            sizeDropdown.style.display = "none";
        });

        // COLOR SWATCHES CLICK
        document.querySelectorAll(".swatch").forEach(swatch => {
            swatch.addEventListener("click", () => {
                const index = parseInt(swatch.dataset.index);
                const colorName = swatch.dataset.color;

                savedItems[index].selectedColor = colorName;
                saveToLocal();

                document.querySelectorAll(`.swatch[data-index="${index}"]`)
                    .forEach(s => s.classList.remove("selected"));

                swatch.classList.add("selected");
            });
        });

        document.addEventListener("click", () => {
            sizeDropdown.style.display = "none";
        });
    }

    renderList();
});