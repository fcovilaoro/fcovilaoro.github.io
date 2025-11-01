document.addEventListener("DOMContentLoaded", () => {
    // --- SAVE BUTTON LOGIC ---
    const saveButtons = document.querySelectorAll(".product-item .button");

    saveButtons.forEach(button => {
        button.addEventListener("click", e => {
            e.preventDefault();

            const item = button.closest(".product-item");
            const name = item.querySelector("h3").textContent;
            const price = item.querySelector("p").textContent;
            const img = item.querySelector("img").src;
            const product = { name, price, img };

            let saved = JSON.parse(localStorage.getItem("savedProducts")) || [];
            const exists = saved.some(p => p.name === name && p.img === img);

            if (!exists) {
                saved.push(product);
                localStorage.setItem("savedProducts", JSON.stringify(saved));
                button.querySelector("i").classList.replace("fa-regular", "fa-solid");
            } else {
                saved = saved.filter(p => !(p.name === name && p.img === img));
                localStorage.setItem("savedProducts", JSON.stringify(saved));
                button.querySelector("i").classList.replace("fa-solid", "fa-regular");
            }

            // 🔴 --- UPDATE HEADER BOOKMARK DOT LIVE ---
            const bookmarkDot = document.querySelector(".bookmark-dot");
            if (bookmarkDot) {
                const updated = JSON.parse(localStorage.getItem("savedProducts")) || [];
                bookmarkDot.style.display = updated.length > 0 ? "block" : "none";
            }
        });
    });

    // --- IMAGE SLIDER ARROWS (desktop slide) ---
    document.querySelectorAll(".image-slider").forEach(slider => {
        const images = slider.querySelectorAll("img");

        // Wrap images for desktop sliding
        let inner = slider.querySelector(".image-slider-inner");
        if (!inner) {
            inner = document.createElement("div");
            inner.classList.add("image-slider-inner");
            images.forEach(img => inner.appendChild(img));
            slider.prepend(inner);
        }

        let current = 0;

        const updateSlider = () => {
            inner.style.transform = `translateX(-${current * 100}%)`;
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

        // --- MOBILE SWIPE LOOPING ---
        let startX = 0;
        let endX = 0;

        slider.addEventListener("touchstart", e => {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener("touchend", e => {
            endX = e.changedTouches[0].clientX;
            const diff = endX - startX;

            // Only trigger if swipe is meaningful
            if (Math.abs(diff) > 50) {
                if (diff < 0) {
                    // Swiped left → next image
                    current = (current + 1) % images.length;
                } else {
                    // Swiped right → previous image
                    current = (current - 1 + images.length) % images.length;
                }

                // Smoothly scroll to the new image on mobile
                slider.scrollTo({
                    left: current * slider.clientWidth,
                    behavior: "smooth"
                });
            }
        });
    });
});