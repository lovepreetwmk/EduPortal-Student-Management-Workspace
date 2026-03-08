// Global State - Persists in Browser
let products = JSON.parse(localStorage.getItem("products")) || [];

// Page Startup
document.addEventListener('DOMContentLoaded', () => {
  updateUI(products);
  initTheme();
  lucide.createIcons();
});

// --- THEME MANAGEMENT ---
const themeToggle = document.getElementById('themeToggle');
function initTheme() {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
});

// --- IMAGE PREVIEW LOGIC ---
function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('image-preview');
  const placeholder = document.getElementById('preview-placeholder');
  const overlay = document.getElementById('edit-overlay');

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.classList.remove('hidden');
      placeholder.classList.add('hidden');
      if (overlay) overlay.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

// --- ADD PRODUCT ---
function addProduct() {
  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  if (!imageFile) {
    alert("Action Required: Please upload a product photo first.");
    return;
  }
  if (!name || !roll) {
    alert("Action Required: Product Name and SKU Code are mandatory.");
    return;
  }

  const autoId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

  const reader = new FileReader();
  reader.onload = function () {
    const product = {
      id: autoId,
      name,
      roll,
      description: desc || "No specifications added.",
      image: reader.result
    };

    products.push(product);
    saveAndRefresh();
    clearForm();
  };
  reader.readAsDataURL(imageFile);
}

// --- UNIVERSAL UI UPDATE ---
function updateUI(data) {
  const container = document.getElementById("productList");
  const countLabel = document.getElementById("stats-count");

  container.innerHTML = "";
  countLabel.innerText = `${products.length} Items`;

  if (data.length === 0) {
    container.innerHTML = `
            <div class="col-span-full text-center py-24 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                <i data-lucide="package-search" class="mx-auto w-12 h-12 mb-3 text-slate-300"></i>
                <p class="text-slate-400 font-medium">No products found in inventory</p>
            </div>`;
  } else {
    data.forEach((product) => {
      const card = `
                <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div class="h-28 bg-slate-100 dark:bg-slate-900/50 p-4 relative flex justify-end items-start overflow-hidden">
                        <img src="${product.image}" class="absolute inset-0 w-full h-full object-cover opacity-20 blur-[2px] group-hover:scale-110 transition-transform duration-500" />
                        <span class="absolute top-4 left-4 z-10 bg-white/60 dark:bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm">
                            ID: ${product.id}
                        </span>
                        <button onclick="deleteProduct(${product.id})" class="relative z-10 p-2.5 bg-white/60 dark:bg-black/40 hover:bg-red-500 hover:text-white rounded-xl backdrop-blur-md transition-all shadow-lg text-slate-600 dark:text-slate-300">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <div class="px-6 pb-8 -mt-10 relative">
                        <div class="relative inline-block mb-4">
                            <img src="${product.image}" class="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-xl group-hover:rotate-2 transition-transform" />
                            <span class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full"></span>
                        </div>
                        
                        <h3 class="text-lg font-black text-slate-800 dark:text-white truncate leading-tight uppercase tracking-tight">
                            ${product.name}
                        </h3>
                        
                        <div class="inline-flex mt-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-black rounded-lg uppercase tracking-widest">
                            SKU: ${product.roll}
                        </div>
                        
                        <p class="mt-5 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                            "${product.description}"
                        </p>
                    </div>
                </div>
            `;
      container.insertAdjacentHTML('beforeend', card);
    });
  }
  // Refresh icons for new content
  lucide.createIcons();
}

// --- SEARCH LOGIC ---
function searchProduct() {
  const kw = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(kw) ||
    p.roll.toLowerCase().includes(kw) ||
    p.id.toString().includes(kw)
  );
  updateUI(filtered);
}

// --- DELETE LOGIC ---
function deleteProduct(id) {
  if (confirm("Confirm permanent removal of this product from inventory?")) {
    products = products.filter(p => p.id !== id);
    saveAndRefresh();
  }
}

// --- HELPERS ---
function saveAndRefresh() {
  localStorage.setItem("products", JSON.stringify(products));
  updateUI(products);
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("roll").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("image").value = "";

  const preview = document.getElementById('image-preview');
  const placeholder = document.getElementById('preview-placeholder');
  const overlay = document.getElementById('edit-overlay');

  preview.src = "";
  preview.classList.add('hidden');
  placeholder.classList.remove('hidden');
  if (overlay) overlay.classList.add('hidden');
}