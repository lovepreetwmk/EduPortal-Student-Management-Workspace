let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay(inventory);
    setupTheme();
});

// --- THEME LOGIC ---
function setupTheme() {
    const savedTheme = localStorage.getItem('materialTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

document.getElementById('themeToggle').addEventListener('click', () => {
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

// --- UPDATED ADD ITEM (Registration Logic) ---
function addItem() {
    // 1. Grab elements
    const nameInput = document.getElementById("itemName");
    const codeInput = document.getElementById("itemCode");
    const descInput = document.getElementById("itemDesc");
    const fileInput = document.getElementById("imageInput");
    const submitBtn = document.querySelector(".submit-btn");

    // 2. Extract values
    const name = nameInput.value.trim();
    const code = codeInput.value.trim();
    const desc = descInput.value.trim();
    const imgFile = fileInput.files[0];

    // 3. Validation - Ensure mandatory fields are present
    if (!name || !code || !imgFile) {
        alert("Registration Failed: Please provide Name, SKU, and a Product Photo.");
        return;
    }

    // 4. Visual Feedback
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    // 5. Read file and save
    const reader = new FileReader();
    
    reader.onload = function (e) {
        try {
            const newItem = {
                id: Date.now(),
                name: name,
                code: code,
                description: desc || "No description provided.",
                image: e.target.result // The base64 data
            };

            inventory.push(newItem);
            
            // Save to LocalStorage
            localStorage.setItem("inventory", JSON.stringify(inventory));
            
            // Update the UI
            updateDisplay(inventory);
            
            // Reset Form
            resetForm();
            
            // Reset Button
            submitBtn.innerText = "Add to Inventory";
            submitBtn.disabled = false;
            
        } catch (error) {
            console.error("Storage Error:", error);
            alert("Storage full or error occurred. Try a smaller image.");
            submitBtn.innerText = "Add to Inventory";
            submitBtn.disabled = false;
        }
    };

    reader.onerror = function() {
        alert("Could not read the image file.");
        submitBtn.disabled = false;
    };

    reader.readAsDataURL(imgFile);
}

// --- UI UPDATE ---
function updateDisplay(data) {
    const grid = document.getElementById("productGrid");
    const stats = document.getElementById("stats-display");
    
    grid.innerHTML = "";
    if (stats) stats.innerText = `${inventory.length} Items In Stock`;

    if (data.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; opacity: 0.5;">No items found.</div>`;
        return;
    }

    data.forEach(item => {
        const card = `
            <div class="item-card">
                <div class="card-header">
                    <span class="card-id">ID: ${item.id.toString().slice(-4)}</span>
                    <button class="del-btn" onclick="deleteItem(${item.id})">Remove</button>
                    <img src="${item.image}" alt="${item.name}">
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
    if (confirm("Permanently remove this item?")) {
        inventory = inventory.filter(item => item.id !== id);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        updateDisplay(inventory);
    }
}

function resetForm() {
    document.getElementById("itemName").value = "";
    document.getElementById("itemCode").value = "";
    document.getElementById("itemDesc").value = "";
    document.getElementById("imageInput").value = "";
    const preview = document.getElementById("img-preview");
    preview.src = "";
    preview.classList.add('hidden-img');
    document.getElementById("upload-placeholder").style.display = 'block';
}
