const form = document.getElementById("productForm");
const container = document.getElementById("container");
const searchInput = document.getElementById("search");
const imageInput = document.getElementById("image");
const themeBtn = document.getElementById('themeToggle');

// Global Data State
let products = JSON.parse(localStorage.getItem("products")) || [];

// --- 1. IMAGE PREVIEW LOGIC ---
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  const dropZone = document.querySelector(".drop-zone");

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Apply the background preview
      dropZone.style.backgroundImage = `url(${e.target.result})`;
      dropZone.style.backgroundSize = "cover";
      dropZone.style.backgroundPosition = "center";
      // Hide the default upload icons
      dropZone.querySelector("i").style.display = "none";
      dropZone.querySelector("p").style.display = "none";
      dropZone.classList.add("has-image");
    };
    reader.readAsDataURL(file);
  }
});

const resetPreview = () => {
  const dropZone = document.querySelector(".drop-zone");
  dropZone.style.backgroundImage = "none";
  dropZone.querySelector("i").style.display = "block";
  dropZone.querySelector("p").style.display = "block";
  dropZone.classList.remove("has-image");
};

// --- 2. DISPLAY PRODUCTS ---
function displayProducts(data) {
  container.innerHTML = "";

  // Show newest first for better UX
  [...data].reverse().forEach((product, index) => {
    const actualIndex = data.length - 1 - index;

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="card-content">
                <span class="card-brand">${product.name}</span>
                <h4>${product.title}</h4>
                <p>${product.desc}</p>
                <div class="card-footer">
                    <button class="delete-btn" onclick="deleteProduct(${actualIndex})">
                        <i class="fa-solid fa-trash-can"></i> Remove
                    </button>
                </div>
            </div>
        `;
    container.appendChild(card);
  });
}

// --- 3. DELETE PRODUCT ---
window.deleteProduct = (index) => {
  if (confirm("Permanently remove this item from inventory?")) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts(products);
  }
};

// --- 4. THEME TOGGLE ---
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  localStorage.setItem('dashboard-theme', isDark ? 'dark' : 'light');
});

// Load saved theme preference
if (localStorage.getItem('dashboard-theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

// --- 5. ADD PRODUCT ---
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const imageFile = imageInput.files[0];
  const name = document.getElementById("name").value;
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Quality optimization: 400x400 Square
      canvas.width = 400;
      canvas.height = 400;
      ctx.drawImage(img, 0, 0, 400, 400);

      const product = {
        image: canvas.toDataURL("image/jpeg", 0.75),
        name,
        title,
        desc
      };

      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));

      displayProducts(products);
      form.reset();
      resetPreview();
    };
  };
  reader.readAsDataURL(imageFile);
});

// --- 6. SEARCH FUNCTION ---
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value) ||
    p.title.toLowerCase().includes(value)
  );
  displayProducts(filtered);
});

// Initial Render
displayProducts(products);