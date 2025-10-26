document.addEventListener("DOMContentLoaded", function () {
    //Menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");
    });

    //Auto Dynamic Change
    const slides = document.querySelectorAll(".hero-slide");
    let currentSlide = 0;
    const slideInterval = 5000;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            slide.style.opacity = "0";
        });

        slides[index].classList.add("active");
        slides[index].style.opacity = "1";
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    showSlide(currentSlide);
    setInterval(nextSlide, slideInterval);

    // Scroll Down Indicator
    const scrollDown = document.querySelector(".scroll-down");
    const footer = document.querySelector("footer");

    if (!footer) return;

    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop < windowHeight) {
        scrollDown.style.opacity = "0";
    } else {
        scrollDown.style.opacity = "1";
    }
});

// Header Scroll Effect
window.addEventListener("scroll", () => {
    const header = document.querySelector(".site-header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});