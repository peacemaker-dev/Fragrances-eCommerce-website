// shop.js (UPDATED WITH SEASON FILTER)

// product grid
const grid = document.getElementById("product-grid");

// UI controls
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("filter-category");
const sortSelect = document.getElementById("sort-options");
const seasonFilter = document.getElementById("filter-season");

// internal state
let masterProducts = [];
let visibleProducts = [];

// Utility: convert price safely
function parsePrice(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^\d.-]/g, "");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

// Load and normalize products
async function loadProducts() {
  try {
    const res = await fetch("products.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch products.json: ${res.status}`);

    const products = await res.json();

    masterProducts = products.map(p => ({
      id: p.id ?? "",
      name: p.name ?? "Unnamed product",
      maker: p.maker ?? "",
      category: (p.category ?? "").toLowerCase(),
      season: (p.season ?? "").toLowerCase(), // SEASON ADDED
      price: parsePrice(p.price),
      image1: p.image1 ?? "",
      image2: p.image2 ?? "",
      description: p.description ?? "",
      topNotes: p.topNotes ?? "",
      middleNotes: p.middleNotes ?? "",
      baseNotes: p.baseNotes ?? ""
    }));

    visibleProducts = [...masterProducts];
    renderProducts(visibleProducts);
  } catch (err) {
    console.error("Error loading products:", err);
    grid.innerHTML = `<p class="load-error">Sorry, we could not load products at the moment.</p>`;
  }
}

// Render product cards
function renderProducts(list) {
  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = `
      <div class="no-results">
        <p>No results found.</p>
      </div>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  list.forEach(p => {
    const article = document.createElement("article");
    article.className = "product-card";

    article.setAttribute("data-id", p.id);
    article.setAttribute("data-name", p.name);
    article.setAttribute("data-category", p.category);
    article.setAttribute("data-season", p.season); // SEASON ADDED TO DOM
    article.setAttribute("data-price", p.price);
    article.setAttribute("data-maker", p.maker);
    article.setAttribute("data-image1", p.image1);
    article.setAttribute("data-image2", p.image2);
    article.setAttribute("data-desc", p.description);
    article.setAttribute("data-top", p.topNotes);
    article.setAttribute("data-middle", p.middleNotes);
    article.setAttribute("data-base", p.baseNotes);

    const img = document.createElement("img");
    img.className = "product-image";
    img.loading = "lazy";
    img.alt = p.name;
    img.src = p.image1 || "images/placeholder.png";

    const info = document.createElement("div");
    info.className = "product-info";

    const h3 = document.createElement("h3");
    h3.textContent = p.name;

    const maker = document.createElement("span");
    maker.className = "product-maker";
    maker.textContent = `By ${p.maker}`;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = `R${p.price.toLocaleString()}`;

    info.appendChild(h3);
    info.appendChild(maker);
    info.appendChild(price);

    article.appendChild(img);
    article.appendChild(info);

    article.style.cursor = "pointer";

    fragment.appendChild(article);
  });

  grid.appendChild(fragment);
}

// Filters + Sorting
function applyFiltersAndSort() {
  const q = (searchInput?.value ?? "").trim().toLowerCase();
  const category = (categorySelect?.value ?? "").toLowerCase();
  const sort = (sortSelect?.value ?? "");
  const season = (seasonFilter?.value ?? "").toLowerCase(); // ACTIVE

  visibleProducts = masterProducts.filter(p => {
    const matchesSearch =
      q === "" ||
      p.name.toLowerCase().includes(q) ||
      p.maker.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);

    const matchesCategory =
      category === "" || category === "all" || p.category === category;

    const matchesSeason =
      season === "" || season === "all" || p.season === season;

    return matchesSearch && matchesCategory && matchesSeason;
  });

  // sort
  if (sort === "low-to-high") {
    visibleProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high-to-low") {
    visibleProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts(visibleProducts);
}

// debounce helper
function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// listeners
function setupListeners() {
  searchInput?.addEventListener("input", debounce(applyFiltersAndSort, 180));
  categorySelect?.addEventListener("change", applyFiltersAndSort);
  sortSelect?.addEventListener("change", applyFiltersAndSort);
  seasonFilter?.addEventListener("change", applyFiltersAndSort);

  searchInput?.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFiltersAndSort();
    }
  });
}

function getProductById(id) {
  return masterProducts.find(p => String(p.id) === String(id));
}

window.getProductById = getProductById;

document.addEventListener("DOMContentLoaded", () => {
  loadProducts().then(() => setupListeners());
});
