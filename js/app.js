// js/app.js

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. FUNCTION TO LOAD HEADER AND FOOTER ---
    const loadComponent = (selector, url) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.querySelector(selector).innerHTML = data;
                // After loading the header, re-attach the theme toggle event
                if (selector === '#header-placeholder') {
                    attachThemeToggle();
                }
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    };

    loadComponent('#header-placeholder', 'partials/header.html');
    loadComponent('#footer-placeholder', 'partials/footer.html');

    // --- 2. THEME TOGGLE FUNCTIONALITY ---
    const attachThemeToggle = () => {
        const themeToggleButton = document.getElementById('theme-toggle-btn');
        if (themeToggleButton) {
            themeToggleButton.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');

                // Save the user's preference in their browser
                if (document.body.classList.contains('dark-theme')) {
                    localStorage.setItem('theme', 'dark');
                } else {
                    localStorage.setItem('theme', 'light');
                }
            });
        }
    };
    
    // --- 3. APPLY SAVED THEME ON PAGE LOAD ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});
