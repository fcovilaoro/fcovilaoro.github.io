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

    // --- CREATE INDICATORS (progress lines or dots) ---
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

    const updateSlider = () => {
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

    // --- MOBILE SWIPE SUPPORT ---
    let startX = 0;
    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });
    slider.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 80) {
        current =
          diff < 0
            ? (current + 1) % images.length
            : (current - 1 + images.length) % images.length;
        updateSlider();
      }
    });
  });
});