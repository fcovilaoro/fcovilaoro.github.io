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

    // --- IMAGE SLIDER ARROWS ---
    document.querySelectorAll(".image-slider").forEach(slider => {
        const images = slider.querySelectorAll("img");
        let current = 0;

        const showImage = index => {
            images.forEach((img, i) => img.classList.toggle("active", i === index));
        };

        // 🔹 Check if arrows exist (only desktop)
        const leftArrow = slider.querySelector(".arrow.left");
        const rightArrow = slider.querySelector(".arrow.right");

        if (leftArrow && rightArrow) {
            leftArrow.addEventListener("click", () => {
                current = (current - 1 + images.length) % images.length;
                showImage(current);
            });

            rightArrow.addEventListener("click", () => {
                current = (current + 1) % images.length;
                showImage(current);
            });
        }
    });
});