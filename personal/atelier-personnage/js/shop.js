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
        });
    });

    // --- IMAGE SLIDER ARROWS (with slide animation on desktop) ---
    document.querySelectorAll(".image-slider").forEach(slider => {
        const images = slider.querySelectorAll("img");

        // Create inner container for sliding if it doesn’t exist
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
    });
});