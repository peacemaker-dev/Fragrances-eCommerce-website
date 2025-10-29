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
          <button class="btn btn-primary add-to-cart" data-product-id="${p.id}" data-price="${p.price}">
            Add to Cart
          </button>
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