document.addEventListener("DOMContentLoaded", () => {

    // --- FIX: Stop slider clicks from breaking item navigation ---
    document.querySelectorAll(".image-slider, .image-slider *").forEach(el => {
        el.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });

    // --- PRODUCT SAVE BUTTON LOGIC ---
    const saveButtons = document.querySelectorAll(".product-item .button");

    saveButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const item = button.closest(".product-item");
            const name = item.querySelector("h3").textContent;
            const price = item.querySelector("p").textContent;
            const img = item.querySelector("img").src;
            const product = { name, price, img };

            let saved = JSON.parse(localStorage.getItem("savedProducts")) || [];
            const exists = saved.some((p) => p.name === name && p.img === img);

            if (!exists) {
                saved.push(product);
                localStorage.setItem("savedProducts", JSON.stringify(saved));
                button.querySelector("i").classList.replace("fa-regular", "fa-solid");
            } else {
                saved = saved.filter((p) => !(p.name === name && p.img === img));
                localStorage.setItem("savedProducts", JSON.stringify(saved));
                button.querySelector("i").classList.replace("fa-solid", "fa-regular");
            }

            // Update bookmark dot
            const bookmarkDot = document.querySelector(".bookmark-dot");
            if (bookmarkDot) {
                const updated = JSON.parse(localStorage.getItem("savedProducts")) || [];
                bookmarkDot.style.display = updated.length > 0 ? "block" : "none";
            }
        });
    });

    // --- SLIDER LOGIC ---
    document.querySelectorAll(".image-slider").forEach((slider) => {

        const images = slider.querySelectorAll("img");

        // Create .image-slider-inner container if needed
        let inner = slider.querySelector(".image-slider-inner");
        if (!inner) {
            inner = document.createElement("div");
            inner.classList.add("image-slider-inner");
            images.forEach((img) => inner.appendChild(img));
            slider.prepend(inner);
        }

        // --- INDICATORS ---
        const indicatorContainer =
            slider.querySelector(".slider-indicators") ||
            (() => {
                const div = document.createElement("div");
                div.classList.add("slider-indicators");
                slider.appendChild(div);
                return div;
            })();

        indicatorContainer.innerHTML = "";
        images.forEach((_, index) => {
            const bar = document.createElement("span");
            if (index === 0) bar.classList.add("active");
            indicatorContainer.appendChild(bar);
        });
        const indicators = indicatorContainer.querySelectorAll("span");

        let current = 0;
        let position = 0;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let isHorizontalSwipe = false;

        const updateSlider = (animate = true) => {
            inner.style.transition = animate ? "transform 0.5s ease" : "none";
            inner.style.transform = `translateX(-${current * 100}%)`;
            indicators.forEach((dot, i) =>
                dot.classList.toggle("active", i === current)
            );
        };

        // --- ARROWS ---
        const leftArrow = slider.querySelector(".arrow.left");
        const rightArrow = slider.querySelector(".arrow.right");

        if (leftArrow && rightArrow) {

            leftArrow.addEventListener("click", (e) => {
                e.stopPropagation();
                e.preventDefault();
                current = (current - 1 + images.length) % images.length;
                updateSlider();
            });

            rightArrow.addEventListener("click", (e) => {
                e.stopPropagation();
                e.preventDefault();
                current = (current + 1) % images.length;
                updateSlider();
            });

            // Extra: fully block arrow bubbling
            slider.querySelectorAll(".arrow").forEach((arrow) => {
                arrow.addEventListener("click", (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                });
            });
        }

        // --- TOUCH DRAG ---
        slider.addEventListener("touchstart", (e) => {
            if (window.innerWidth > 1024) return;

            isDragging = true;
            isHorizontalSwipe = false;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;

            position = -current * slider.offsetWidth;
            inner.style.transition = "none";
        });

        slider.addEventListener("touchmove", (e) => {
            if (!isDragging || window.innerWidth > 1024) return;

            const dx = e.touches[0].clientX - startX;
            const dy = Math.abs(e.touches[0].clientY - startY);

            if (Math.abs(dx) > dy) {
                isHorizontalSwipe = true;
            } else {
                isHorizontalSwipe = false;
            }

            if (isHorizontalSwipe) {
                inner.style.transform = `translateX(${position + dx}px)`;
                e.preventDefault();
            }
        });

        slider.addEventListener("touchend", (e) => {
            if (!isDragging || window.innerWidth > 1024) return;

            isDragging = false;

            const dx = e.changedTouches[0].clientX - startX;
            const threshold = slider.offsetWidth * 0.2;

            if (dx < -threshold) {
                current = (current + 1) % images.length;
            } else if (dx > threshold) {
                current = (current - 1 + images.length) % images.length;
            }

            updateSlider();
        });

        updateSlider(false);
    });
});