const grid = document.getElementById("product-grid");
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");
const closeModal = document.querySelector(".close-modal");

// Fetch and render products
async function loadProducts() {
  try {
    const res = await fetch("products.json");
    const products = await res.json();
    renderProducts(products);
    setupModal(products);
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

function renderProducts(list) {
  grid.innerHTML = "";
  list.forEach(p => {
    const card = `
      <article class="product-card" data-category="${p.category}" data-id="${p.id}">
        <img src="${p.image1}" alt="${p.name}" class="product-image" loading="lazy">
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <span class="product-maker">By ${p.maker}</span>
          <p class="product-price">R${p.price.toLocaleString()}</p>
        </div>
      </article>
    `;
    grid.insertAdjacentHTML("beforeend", card);
  });
}

function setupModal(products) {
  grid.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    if (!card) return;
    const productId = card.dataset.id;
    const product = products.find(p => p.id === productId);
    if (product) {
      modalImg.src = product.image;
      modalName.textContent = product.name;
      modalDesc.textContent = product.description;
      modalPrice.textContent = `R${product.price.toLocaleString()}`;
      modal.classList.add("active");
    }
  });

  closeModal.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });
}

loadProducts();
// ==================== ADD TO CART CONNECTION ====================

// Load existing cart or create an empty one
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  showCartNotification();
}

// Show quick toast when added
function showCartNotification() {
  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.textContent = "Added to cart!";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

// Listen for Add to Cart button clicks (inside product grid)
grid.addEventListener("click", e => {
if (product) {
  document.getElementById("modal-image1").src = product.image1;
  document.getElementById("modal-image2").src = product.image2;
  document.getElementById("modal-name").textContent = product.name;
  document.getElementById("modal-desc").textContent = product.description;
  document.getElementById("modal-top").textContent = product.topNotes;
  document.getElementById("modal-middle").textContent = product.middleNotes;
  document.getElementById("modal-base").textContent = product.baseNotes;
  document.getElementById("modal-maker").textContent = product.maker;
  document.getElementById("modal-price").textContent = `R${product.price.toLocaleString()}`;
  modal.classList.add("active");
}

});

// Handle Add to Cart from Modal
document.querySelector(".modal-cart-btn").addEventListener("click", () => {
  const productName = document.getElementById("modal-name").textContent;
  const productPrice = parseFloat(
    document.getElementById("modal-price").textContent.replace(/[^\d.]/g, "")
  );
  const productImage = document.getElementById("modal-image1").src;
  const quantity = parseInt(document.getElementById("quantity-value").value);

  const cartItem = { name: productName, price: productPrice, image: productImage, quantity };

  // Load existing cart or create new one
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already exists in cart
  const existing = cart.find(item => item.name === cartItem.name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push(cartItem);
  }

  // Save updated cart
  localStorage.setItem("cart", JSON.stringify(cart));

  // Give feedback
  //alert(`${productName} added to cart!`);
  modal.classList.remove("active");
});

