// ====== MENU TOGGLE ======
const menuToggle = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const closeMenu = document.querySelector(".close-menu");
const mobileSearchIcon = document.querySelector("#header .search");
const desktopSearchIcon = document.querySelector("#header .second-search");
const searchSection = document.querySelector(".search-section");
const closeSearch = document.querySelector(".close-search");

// ====== MENU ======
if (menuToggle && mobileMenu && closeMenu) {
  menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    mobileMenu.classList.add("show");
    if (searchSection) searchSection.classList.remove("active");
    if (mobileSearchIcon) mobileSearchIcon.style.display = "inline-block";
  });

  closeMenu.addEventListener("click", (e) => {
    e.preventDefault();
    mobileMenu.classList.remove("show");
  });
}

// ====== SEARCH LOGIC ======
if (mobileSearchIcon) {
  mobileSearchIcon.addEventListener("click", (e) => {
    e.preventDefault();
    if (window.innerWidth <= 972) {
      searchSection.classList.add("active");
      mobileSearchIcon.style.display = "none";
    } else {
      searchSection.classList.add("active");
    }
  });
}

if (desktopSearchIcon) {
  desktopSearchIcon.addEventListener("click", (e) => {
    e.preventDefault();
    searchSection.classList.toggle("active");
  });
}

if (closeSearch) {
  closeSearch.addEventListener("click", (e) => {
    e.preventDefault();
    searchSection.classList.remove("active");
    if (window.innerWidth <= 972 && mobileSearchIcon) {
      mobileSearchIcon.style.display = "inline-block";
    }
    const searchInput = searchSection.querySelector("input");
    if (searchInput) searchInput.value = "";
  });
}

document.addEventListener("click", (e) => {
  if (searchSection && searchSection.classList.contains("active")) {
    const insideHeader = e.target.closest("#header");
    const clickedIcon =
      e.target.closest(".search") || e.target.closest(".second-search");
    const insideSearch = e.target.closest(".search-section");

    if (!insideHeader && !clickedIcon && !insideSearch) {
      searchSection.classList.remove("active");
      if (window.innerWidth <= 972 && mobileSearchIcon)
        mobileSearchIcon.style.display = "inline-block";
      const searchInput = searchSection.querySelector("input");
      if (searchInput) searchInput.value = "";
    }
  }
});

window.addEventListener("resize", () => {
  if (!searchSection || !mobileSearchIcon) return;
  if (window.innerWidth >= 972) {
    searchSection.classList.add("active");
    mobileSearchIcon.style.display = "none";
  } else {
    searchSection.classList.remove("active");
    mobileSearchIcon.style.display = "inline-block";
  }
});

// ====== SCROLL HEADER EFFECT ======
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }
});

// ====== BOOKMARK DOT PERSISTENCE ======
function updateBookmarkDot() {
  const bookmarkDot = document.querySelector(".bookmark-dot");
  if (!bookmarkDot) return;
  const saved = JSON.parse(localStorage.getItem("savedProducts")) || [];
  bookmarkDot.style.display = saved.length > 0 ? "block" : "none";
}

// Run when the header loads
updateBookmarkDot();

// Refresh when tab becomes visible again
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    updateBookmarkDot();
  }
});

// Optional defensive: refresh on any click
document.body.addEventListener("click", updateBookmarkDot);