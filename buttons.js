// Modal favourite toggle
document.addEventListener("click", e => {
  const favBtn = e.target.closest(".fav-btn");
  if (!favBtn) return;

  const icon = favBtn.querySelector("i");

  // Toggle between filled and outline heart
  if (icon.classList.contains("fa-regular")) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
    favBtn.title = "Remove from Favourites";
  } else {
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
    favBtn.title = "Add to Favourites";
  }
});

// Testimonial slider
const track = document.querySelector('.testimonial-track');
const slides = document.querySelectorAll('.testimonial');
const dotsContainer = document.querySelector('.slider-dots');

let index = 0;

// Create dots dynamically
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('button');

function updateSlider() {
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

// Auto-slide every 5 seconds
setInterval(() => {
  index = (index + 1) % slides.length;
  updateSlider();
}, 5000);

// Dot navigation
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    index = i;
    updateSlider();
  });
});

