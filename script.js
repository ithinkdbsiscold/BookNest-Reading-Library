const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        document.body.classList.toggle("menu-open", isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            document.body.classList.remove("menu-open");
        });
    });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    const delay = Number(carousel.dataset.autoplay || 0);
    let index = 0;
    let timer;

    if (!track || slides.length === 0) return;

    const dots = slides.map((_, dotIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", `Show photo ${dotIndex + 1}`);
        button.addEventListener("click", () => {
            setSlide(dotIndex);
            restart();
        });
        dotsWrap?.appendChild(button);
        return button;
    });

    const setSlide = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
        });
    };

    const restart = () => {
        if (!delay) return;
        window.clearInterval(timer);
        timer = window.setInterval(() => setSlide(index + 1), delay);
    };

    prev?.addEventListener("click", () => {
        setSlide(index - 1);
        restart();
    });

    next?.addEventListener("click", () => {
        setSlide(index + 1);
        restart();
    });

    setSlide(0);
    restart();
});
