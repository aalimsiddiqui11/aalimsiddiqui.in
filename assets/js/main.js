const typingText = [
    'Full Stack Developer',
    'Frontend Developer',
    'PHP Developer',
    'Web Designer'
];

const typingEl = document.querySelector('.typing');
const progressBar = document.querySelector('.progress-bar');
const loader = document.querySelector('.loader');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const cursor = document.querySelector('.cursor');
const topBtn = document.querySelector('.top-btn');
const hiddenElements = document.querySelectorAll('.hidden');
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const contactForms = document.querySelectorAll('.contact-form');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let count = 0;
let index = 0;
let currentText = '';
let letter = '';

const getLinkHash = (href) => {
    if (!href || !href.includes('#')) {
        return '';
    }

    return href.split('#').pop();
};

const getPageName = (href) => {
    if (!href || href.startsWith('#')) {
        return '';
    }

    return href.split('/').pop().split('#')[0];
};

if (typingEl && !prefersReducedMotion) {
    const type = () => {
        if (count === typingText.length) {
            count = 0;
        }

        currentText = typingText[count];
        letter = currentText.slice(0, ++index);

        typingEl.textContent = letter;

        if (letter.length === currentText.length) {
            count++;
            index = 0;
            setTimeout(type, 1500);
            return;
        }

        setTimeout(type, 120);
    };

    type();
} else if (typingEl) {
    typingEl.textContent = typingText[0];
}

if (hiddenElements.length && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.15 });

    hiddenElements.forEach((el) => observer.observe(el));
} else if (hiddenElements.length) {
    hiddenElements.forEach((el) => el.classList.add('show'));
}

if (progressBar) {
    const updateProgress = () => {
        const scrollTop = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollValue = height > 0 ? (scrollTop / height) * 100 : 0;

        progressBar.style.width = `${scrollValue}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

const MOBILE_NAV_BREAKPOINT = 768;

const closeMobileMenu = () => {
    if (!navLinks || !menuBtn) {
        return;
    }

    navLinks.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation menu');

    const menuIcon = menuBtn.querySelector('i');

    if (menuIcon) {
        menuIcon.className = 'fas fa-bars';
    }
};

if (menuBtn && navLinks) {
    const updateMenuState = () => {
        const isOpen = navLinks.classList.contains('active');
        const menuIcon = menuBtn.querySelector('i');

        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        menuBtn.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);

        if (menuIcon) {
            menuIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        }
    };

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        updateMenuState();
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (event) => {
        if (!navLinks.classList.contains('active')) {
            return;
        }

        const clickedInsideNav = navLinks.contains(event.target) || menuBtn.contains(event.target);

        if (!clickedInsideNav) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
            menuBtn.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > MOBILE_NAV_BREAKPOINT && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    }, { passive: true });
}

if (loader) {
    const hideLoader = () => {
        loader.style.opacity = '0';

        setTimeout(() => {
            loader.style.display = 'none';
        }, prefersReducedMotion ? 0 : 600);
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
}

if (themeToggle) {
    const icon = themeToggle.querySelector('i');

    const updateThemeState = () => {
        const isDark = document.body.classList.contains('dark');

        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }

        themeToggle.setAttribute('aria-pressed', String(isDark));
    };

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        updateThemeState();
    });

    updateThemeState();
}

if (cursor && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
}

const updateActiveNav = () => {
    if (!navItems.length) {
        return;
    }

    let currentSection = '';
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id') || '';
        }
    });

    navItems.forEach((item) => {
        item.classList.remove('active');

        const href = item.getAttribute('href') || '';
        const linkHash = getLinkHash(href);
        const linkPage = getPageName(href) || (href.startsWith('#') ? currentPage : '');

        if (currentSection && linkHash === currentSection) {
            item.classList.add('active');
            return;
        }

        if (!currentSection && linkPage && linkPage === currentPage && !linkHash) {
            item.classList.add('active');
        }
    });
};

if (sections.length && navItems.length) {
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
} else if (navItems.length) {
    updateActiveNav();
}

if (topBtn) {
    const toggleTopBtn = () => {
        const shouldShow = window.scrollY > 320;

        topBtn.classList.toggle('visible', shouldShow);
    };

    topBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });

    window.addEventListener('scroll', toggleTopBtn, { passive: true });
    toggleTopBtn();
}

contactForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
    });
});
/* =========================
   WELCOME SCREEN
========================= */

window.addEventListener("load", ()=>{

    setTimeout(()=>{

        const welcomeScreen =
        document.querySelector(".welcome-screen");

        welcomeScreen.style.opacity = "0";

        welcomeScreen.style.visibility = "hidden";

    },3000);

});