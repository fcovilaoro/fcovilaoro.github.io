document.addEventListener("DOMContentLoaded", () => {

    // utils
    const colorMap = {
        "White": "#ffffff",
        "Black": "#000000",
        "Gray": "#bfbfbf",
        "Navy": "#001f3f",
        // add more named colors if you use them
    };

    // read product id
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        console.error("No product ID in URL");
        document.querySelector("main").innerHTML = "<h2>Product not found.</h2>";
        return;
    }

    // products is global from js/products.js
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error("Product not found:", productId);
        document.querySelector("main").innerHTML = "<h2>Product not found.</h2>";
        return;
    }

    // DOM refs
    const mainImage = document.getElementById("main-image");
    const thumbnailContainer = document.getElementById("thumbnail-container");
    const indicators = document.getElementById("slider-indicators");
    const arrowLeft = document.getElementById("arrow-left");
    const arrowRight = document.getElementById("arrow-right");

    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productCategory = document.getElementById("product-category");
    const productDescription = document.getElementById("product-description");

    const colorSwatchesWrap = document.getElementById("color-swatches");
    const sizeOptionsWrap = document.getElementById("size-options");

    const addToBagBtn = document.getElementById("add-to-bag");
    const saveBtn = document.getElementById("save-item");

    // state
    let currentIndex = 0;
    let lastWheelTime = 0;
    const wheelDebounceMs = 200;

    // populate basic info
    productName.textContent = product.name;
    productPrice.textContent = "$" + product.price.toString();
    productCategory.textContent = product.category || "";
    productDescription.textContent = product.description || "";

    // build thumbnails (vertical)
    thumbnailContainer.innerHTML = "";
    (product.images || []).forEach((src, i) => {
        const t = document.createElement("img");
        t.src = src;
        t.alt = product.name + " " + (i + 1);
        t.dataset.index = i;
        t.classList.add("thumb-item");
        if (i === 0) t.classList.add("active");

        t.addEventListener("click", (e) => {
            e.stopPropagation();
            setIndex(i, true);
        });

        t.addEventListener("mouseover", () => {
            t.style.borderColor = "#000";
        });

        t.addEventListener("mouseout", () => {
            if (!t.classList.contains("active")) t.style.borderColor = "transparent";
        });

        thumbnailContainer.appendChild(t);
    });

    // build indicators (small dots) — optional
    indicators.innerHTML = "";
    (product.images || []).forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "indicator-dot";
        if (i === 0) dot.classList.add("active");
        indicators.appendChild(dot);

        dot.addEventListener("click", (e) => {
            e.stopPropagation();
            setIndex(i, true);
        });
    });

    // set main image
    function setIndex(i, fromUser = false) {
        const images = product.images || [];
        if (!images.length) return;
        currentIndex = ((i % images.length) + images.length) % images.length;
        mainImage.src = images[currentIndex];

        // thumbnail active
        thumbnailContainer.querySelectorAll("img").forEach(img => {
            img.classList.toggle("active", Number(img.dataset.index) === currentIndex);
            img.style.borderColor = img.classList.contains("active") ? "#000" : "transparent";
        });

        // indicators active
        indicators.querySelectorAll(".indicator-dot").forEach((d, idx) => {
            d.classList.toggle("active", idx === currentIndex);
        });

        // small hover/animation on main
        mainImage.style.transform = "scale(1.01)";
        setTimeout(() => mainImage.style.transform = "scale(1)", 160);
    }

    setIndex(0);

    // arrows
    arrowLeft.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIndex(currentIndex - 1, true);
    });

    arrowRight.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIndex(currentIndex + 1, true);
    });

    // wheel to change images on the main-image area
    mainImage.addEventListener("wheel", (e) => {
        const now = Date.now();
        if (now - lastWheelTime < wheelDebounceMs) return;
        lastWheelTime = now;

        if (e.deltaY > 0) {
            // scroll down -> next
            setIndex(currentIndex + 1, true);
        } else if (e.deltaY < 0) {
            // scroll up -> prev
            setIndex(currentIndex - 1, true);
        }
    }, { passive: true });

    // touch drag - allow swipe-like behavior on mobile for main image
    let touchStartX = 0;
    mainImage.addEventListener("touchstart", (e) => {
        if (!e.touches || !e.touches[0]) return;
        touchStartX = e.touches[0].clientX;
    });

    mainImage.addEventListener("touchend", (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const threshold = 40;
        if (dx > threshold) {
            setIndex(currentIndex - 1, true);
        } else if (dx < -threshold) {
            setIndex(currentIndex + 1, true);
        }
    });

    // build color swatches (reuse saved style)
    colorSwatchesWrap.innerHTML = "";
    const currentColorDefault = (product.colors && product.colors[0]) || null;
    let selectedColor = currentColorDefault;

    (product.colors || []).forEach((c) => {
        const sw = document.createElement("div");
        sw.className = "swatch";
        sw.dataset.color = c;
        sw.title = c;
        sw.style.background = colorMap[c] || c;

        if (c === selectedColor) sw.classList.add("selected");

        sw.addEventListener("click", (e) => {
            e.stopPropagation();
            selectedColor = c;
            colorSwatchesWrap.querySelectorAll(".swatch").forEach(s => s.classList.remove("selected"));
            sw.classList.add("selected");
        });

        colorSwatchesWrap.appendChild(sw);
    });

    // build sizes (buttons)
    sizeOptionsWrap.innerHTML = "";
    let selectedSize = null;

    (product.sizes || []).forEach(s => {
        const b = document.createElement("button");
        b.textContent = s;
        b.className = "size-btn";
        b.dataset.size = s;

        b.addEventListener("click", (e) => {
            e.stopPropagation();
            sizeOptionsWrap.querySelectorAll("button").forEach(x => x.classList.remove("active"));
            b.classList.add("active");
            selectedSize = s;
        });

        sizeOptionsWrap.appendChild(b);
    });

    // Save (wishlist) logic — reuse savedProducts
    function getSavedProducts() {
        return JSON.parse(localStorage.getItem("savedProducts")) || [];
    }

    function setSavedProducts(arr) {
        localStorage.setItem("savedProducts", JSON.stringify(arr));
    }

    function updateSaveButton() {
        const saved = getSavedProducts();
        const exists = saved.some(p => p.name === product.name && p.img === (product.images && product.images[0]));
        const icon = saveBtn.querySelector("i");
        if (exists) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        }
    }

    saveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const saved = getSavedProducts();
        const firstImg = product.images && product.images[0];
        const foundIndex = saved.findIndex(p => p.name === product.name && p.img === firstImg);

        if (foundIndex === -1) {
            saved.push({ name: product.name, price: `$${product.price}`, img: firstImg, selectedSize: selectedSize, selectedColor });
            setSavedProducts(saved);
        } else {
            saved.splice(foundIndex, 1);
            setSavedProducts(saved);
        }

        updateSaveButton();
        // update header dot if header loaded
        const bookmarkDot = document.querySelector(".bookmark-dot");
        if (bookmarkDot) {
            const updated = getSavedProducts();
            bookmarkDot.style.display = updated.length > 0 ? "block" : "none";
        }
    });

    updateSaveButton();

    // Add to bag logic
    addToBagBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const chosenSize = selectedSize || null;
        const chosenColor = selectedColor || null;

        if (!chosenSize) {
            // highlight sizes briefly to indicate user should choose a size
            sizeOptionsWrap.querySelectorAll("button").forEach(b => {
                b.classList.add("pulse");
                setTimeout(() => b.classList.remove("pulse"), 700);
            });
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

        cart.push({
            id: product.id,
            name: product.name,
            img: product.images && product.images[0],
            price: parseFloat(product.price),
            selectedSize: chosenSize,
            selectedColor: chosenColor,
            qty: 1
        });

        localStorage.setItem("cartProducts", JSON.stringify(cart));

        // give quick feedback
        addToBagBtn.textContent = "Added ✓";
        setTimeout(() => addToBagBtn.textContent = "Add to Bag", 900);
    });

    // accessibility: keyboard nav for arrows
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") setIndex(currentIndex - 1, true);
        if (e.key === "ArrowRight") setIndex(currentIndex + 1, true);
    });

    // prevent clicks on arrows from bubbling to any parent links
    document.querySelectorAll(".arrow").forEach(a => {
        a.addEventListener("click", (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
        });
    });
});