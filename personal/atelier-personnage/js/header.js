
    const menuToggle = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');

    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.add('show');
        searchSection.style.display = 'none';
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
                searchSection.style.display = 'block';
                mobileSearchIcon.style.display = 'none';
            } else {
                searchSection.style.display = 'block';
            }
        });
    }

    // ====== DESKTOP SEARCH TOGGLE ======
    if (desktopSearchIcon) {
        desktopSearchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const currentDisplay = window.getComputedStyle(searchSection).display;
            searchSection.style.display = currentDisplay === 'none' ? 'block' : 'none';
        });
    }

    // ====== CLOSE SEARCH BUTTON ======
    if (closeSearch) {
        closeSearch.addEventListener('click', (e) => {
            e.preventDefault();
            searchSection.style.display = 'none';

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
        // If the search section is visible...
        if (searchSection && searchSection.style.display === 'block') {

            // Check if the click happened *outside* of the header and search icons
            const clickedInsideHeader = e.target.closest('#header');
            const clickedSearchIcon = e.target.closest('.search') || e.target.closest('.second-search');

            if (!clickedInsideHeader && !clickedSearchIcon) {
                searchSection.style.display = 'none';

                // Only show mobile search icon on mobile again
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
            // Desktop
            searchSection.style.display = 'inline-block';
            mobileSearchIcon.style.display = 'none';
        } else {
            // Mobile
            searchSection.style.display = 'none';
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