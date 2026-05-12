// Initialize AOS Animation Library
AOS.init({
    once: true,
    offset: 50,
    duration: 800,
    easing: 'ease-out-cubic',
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
        navbar.classList.remove('py-2');
    } else {
        navbar.classList.remove('nav-scrolled');
        navbar.classList.add('py-2');
    }
});

// Parallax Effect for Hero Background
const parallaxBg = document.querySelector('.parallax-bg');
window.addEventListener('scroll', () => {
    // Only apply parallax if screen is wide enough (optional performance optimization)
    if (window.innerWidth > 768) {
        const scrollPosition = window.pageYOffset;
        if(scrollPosition < window.innerHeight) {
            parallaxBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
    }
});

// Interior Gallery Carousel
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-indicators');
    const dots = Array.from(dotsNav.children);
    
    let currentIndex = 0;
    
    const updateCarousel = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('bg-softGold', 'w-8');
            dot.classList.add('bg-cream/50', 'w-3');
        });
        dots[index].classList.remove('bg-cream/50', 'w-3');
        dots[index].classList.add('bg-softGold', 'w-8');
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel(currentIndex);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(currentIndex);
    };

    nextButton.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
            resetInterval();
        });
    });

    // Auto-play
    let slideInterval = setInterval(nextSlide, 5000);

    const resetInterval = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    };

    // Initialize first dot width
    dots[0].classList.add('w-8');
    dots[0].classList.remove('w-3');

    // Exterior Gallery Auto-Slide
    const exteriorTrack = document.querySelector('.exterior-track');
    const exteriorSlides = Array.from(exteriorTrack.children);
    let extCurrentIndex = 0;

    setInterval(() => {
        extCurrentIndex = (extCurrentIndex + 1) % exteriorSlides.length;
        exteriorTrack.style.transform = `translateX(-${extCurrentIndex * 100}%)`;
    }, 4000);
});
