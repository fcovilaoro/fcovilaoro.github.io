// ====== MENU TOGGLE ======
const menuToggle = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');

menuToggle.addEventListener('click', (e) => {
	e.preventDefault();
	mobileMenu.classList.add('show');
	searchSection.classList.remove('active');
	mobileSearchIcon.style.display = 'inline-block';
});

closeMenu.addEventListener('click', (e) => {
	e.preventDefault();
	mobileMenu.classList.remove('show');
});

// ====== SEARCH ELEMENTS ======
const mobileSearchIcon = document.querySelector('#header .search');
const desktopSearchIcon = document.querySelector('#header .second-search');
const searchSection = document.querySelector('.search-section');
const closeSearch = document.querySelector('.close-search');

// ====== MOBILE SEARCH TOGGLE ======
if (mobileSearchIcon) {
	mobileSearchIcon.addEventListener('click', (e) => {
		e.preventDefault();
		if (window.innerWidth <= 972) {
			searchSection.classList.add('active');
			mobileSearchIcon.style.display = 'none';
		} else {
			searchSection.classList.add('active');
		}
	});
}

// ====== DESKTOP SEARCH TOGGLE ======
if (desktopSearchIcon) {
	desktopSearchIcon.addEventListener('click', (e) => {
		e.preventDefault();
		searchSection.classList.toggle('active');
	});
}

// ====== CLOSE SEARCH BUTTON ======
if (closeSearch) {
	closeSearch.addEventListener('click', (e) => {
		e.preventDefault();
		searchSection.classList.remove('active');

		// Only show mobile search icon on mobile
		if (window.innerWidth <= 972) {
			mobileSearchIcon.style.display = 'inline-block';
		}

		const searchInput = searchSection.querySelector('input');
		if (searchInput) searchInput.value = '';
	});
}

// ====== CLOSE SEARCH WHEN CLICKING OUTSIDE ======
document.addEventListener('click', (e) => {
	if (searchSection && searchSection.classList.contains('active')) {
		const clickedInsideHeader = e.target.closest('#header');
		const clickedSearchIcon = e.target.closest('.search') || e.target.closest('.second-search');
		const clickedInsideSearch = e.target.closest('.search-section');

		if (!clickedInsideHeader && !clickedSearchIcon && !clickedInsideSearch) {
			searchSection.classList.remove('active');

			if (window.innerWidth <= 972 && mobileSearchIcon) {
				mobileSearchIcon.style.display = 'inline-block';
			}

			const searchInput = searchSection.querySelector('input');
			if (searchInput) searchInput.value = '';
		}
	}
});

// ====== WINDOW RESIZE BEHAVIOR ======
window.addEventListener('resize', () => {
	if (window.innerWidth >= 972) {
		searchSection.classList.add('active');
		mobileSearchIcon.style.display = 'none';
	} else {
		searchSection.classList.remove('active');
		mobileSearchIcon.style.display = 'inline-block';
	}
});

// ====== SCROLL HEADER EFFECT ======
window.addEventListener('scroll', () => {
	const header = document.getElementById('header');
	if (window.scrollY > 50) {
		header.classList.add('scrolled');
	} else {
		header.classList.remove('scrolled');
	}
});

// ====== BOOKMARK DOT NOTIFICATION ======
document.addEventListener("DOMContentLoaded", () => {
  const bookmarkDot = document.querySelector(".bookmark-dot");

  if (bookmarkDot) {
    const saved = JSON.parse(localStorage.getItem("savedProducts")) || [];
    if (saved.length > 0) {
      bookmarkDot.style.display = "block";
    }

    window.addEventListener("storage", () => {
      const updated = JSON.parse(localStorage.getItem("savedProducts")) || [];
      bookmarkDot.style.display = updated.length > 0 ? "block" : "none";
    });
  }
});