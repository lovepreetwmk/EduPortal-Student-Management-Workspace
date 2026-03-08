let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
  updateDisplay(inventory);
  setupTheme();
});

// --- THEME LOGIC ---
const themeToggle = document.getElementById('themeToggle');
function setupTheme() {
  const savedTheme = localStorage.getItem('materialTheme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
  let current = document.documentElement.getAttribute('data-theme');
  let next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('materialTheme', next);
});

// --- IMAGE PREVIEW ---
function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('img-preview');
  const placeholder = document.getElementById('upload-placeholder');

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.classList.remove('hidden-img');
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
}

// --- ADD ITEM ---
function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const code = document.getElementById("itemCode").value.trim();
  const desc = document.getElementById("itemDesc").value.trim();
  const imgFile = document.getElementById("imageInput").files[0];

  if (!name || !code || !imgFile) {
    alert("Please provide Name, SKU, and a Photo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const newItem = {
      id: Date.now(),
      name,
      code,
      description: desc || "No description provided.",
      image: reader.result
    };
    inventory.push(newItem);
    saveAndRefresh();
    resetForm();
  };
  reader.readAsDataURL(imgFile);
}

// --- UI UPDATE ---
function updateDisplay(data) {
  const grid = document.getElementById("productGrid");
  const stats = document.getElementById("stats-display");

  grid.innerHTML = "";
  stats.innerText = `${inventory.length} Items In Stock`;

  if (data.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; opacity: 0.5;">Warehouse empty. Add items to see them here.</div>`;
    return;
  }

  data.forEach(item => {
    const card = `
            <div class="item-card">
                <div class="card-header">
                    <span class="card-id">#${item.id.toString().slice(-4)}</span>
                    <button class="del-btn" onclick="deleteItem(${item.id})">Del</button>
                    <img src="${item.image}">
                </div>
                <div class="card-content">
                    <h4>${item.name}</h4>
                    <span class="sku-badge">${item.code}</span>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
    grid.insertAdjacentHTML('beforeend', card);
  });
}

// --- ACTIONS ---
function searchItems() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(query) || i.code.toLowerCase().includes(query)
  );
  updateDisplay(filtered);
}

function deleteItem(id) {
  if (confirm("Permanently remove this item from inventory?")) {
    inventory = inventory.filter(item => item.id !== id);
    saveAndRefresh();
  }
}

function saveAndRefresh() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  updateDisplay(inventory);
}

function resetForm() {
  document.getElementById("itemName").value = "";
  document.getElementById("itemCode").value = "";
  document.getElementById("itemDesc").value = "";
  document.getElementById("imageInput").value = "";
  document.getElementById("img-preview").src = "";
  document.getElementById("img-preview").classList.add('hidden-img');
  document.getElementById("upload-placeholder").style.display = 'block';
}