document.addEventListener("DOMContentLoaded", () => {
    const saveButtons = document.querySelectorAll(".product-item .button");

    // --- SAVE BUTTON LOGIC ---
    saveButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

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

            // --- UPDATE DOT IF HEADER IS LOADED ---
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

        // Create .image-slider-inner if missing
        let inner = slider.querySelector(".image-slider-inner");
        if (!inner) {
            inner = document.createElement("div");
            inner.classList.add("image-slider-inner");
            images.forEach((img) => inner.appendChild(img));
            slider.prepend(inner);
        }

        // --- CREATE INDICATORS ---
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

        const updateSlider = (animate = true) => {
            inner.style.transition = animate ? "transform 0.5s ease" : "none";
            inner.style.transform = `translateX(-${current * 100}%)`;
            indicators.forEach((dot, i) =>
                dot.classList.toggle("active", i === current)
            );
        };

        const leftArrow = slider.querySelector(".arrow.left");
        const rightArrow = slider.querySelector(".arrow.right");

        if (leftArrow && rightArrow) {
            leftArrow.addEventListener("click", () => {
                current = (current - 1 + images.length) % images.length;
                updateSlider();
            });
            rightArrow.addEventListener("click", () => {
                current = (current + 1) % images.length;
                updateSlider();
            });
        }

        // --- DESKTOP stays normal ---
        // --- MOBILE/TABLET FINGER DRAG ---
        slider.addEventListener("touchstart", (e) => {
            if (window.innerWidth > 1024) return;
            isDragging = true;
            startX = e.touches[0].clientX;
            position = -current * slider.offsetWidth;
            inner.style.transition = "none";
        });

        slider.addEventListener("touchmove", (e) => {
            if (!isDragging || window.innerWidth > 1024) return;
            const dx = e.touches[0].clientX - startX;
            inner.style.transform = `translateX(${position + dx}px)`;
            e.preventDefault();
        });

        slider.addEventListener("touchend", (e) => {
            if (!isDragging || window.innerWidth > 1024) return;
            isDragging = false;
            const dx = e.changedTouches[0].clientX - startX;
            const threshold = slider.offsetWidth * 0.2;

            if (dx < -threshold && current < images.length - 1) {
                current++;
            } else if (dx > threshold && current > 0) {
                current--;
            }
            updateSlider();
        });

        updateSlider(false);
    });
});