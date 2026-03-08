let students = JSON.parse(localStorage.getItem("students")) || [];

document.addEventListener('DOMContentLoaded', () => {
  updateUI(students);
  initTheme();
  lucide.createIcons();
});

// --- THEME LOGIC ---
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

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove('hidden');
      preview.classList.add('scale-100');
      placeholder.classList.add('hidden');
    }
    reader.readAsDataURL(file);
  }
}

// --- ADD STUDENT ---
function addStudent() {
  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (!name || !roll || !imageFile) {
    alert("Name, Roll Number, and Photo are required!");
    return;
  }

  const autoId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

  const reader = new FileReader();
  reader.onload = function () {
    const student = {
      id: autoId,
      name,
      roll,
      description: desc || "Professional student record.",
      image: reader.result
    };

    students.push(student);
    saveAndRefresh();
    clearForm();
  };
  reader.readAsDataURL(imageFile);
}

function updateUI(data) {
  const container = document.getElementById("studentList");
  const countLabel = document.getElementById("stats-count");

  container.innerHTML = "";
  countLabel.innerText = `${students.length} Students Registered`;

  if (data.length === 0) {
    container.innerHTML = `
            <div class="col-span-full text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <i data-lucide="users" class="mx-auto w-12 h-12 mb-2 text-slate-300"></i>
                <p class="text-slate-400">Database is empty</p>
            </div>`;
  } else {
    data.forEach((student) => {
      const card = `
                <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                    <div class="h-28 bg-gradient-to-r from-blue-600 to-blue-400 p-4 flex justify-end">
                        <button onclick="deleteStudent(${student.id})" class="p-2 bg-white/20 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-all shadow-lg self-start">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <div class="px-8 pb-8 -mt-12 relative">
                        <img src="${student.image}" class="w-24 h-24 rounded-[2rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl mb-4 group-hover:rotate-3 transition-transform" />
                        <h3 class="text-xl font-black text-slate-800 dark:text-white truncate">${student.name}</h3>
                        <div class="flex gap-2 mt-2">
                            <span class="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-md uppercase tracking-widest">ID: ${student.id}</span>
                            <span class="text-[10px] font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 rounded-md uppercase">Roll: ${student.roll}</span>
                        </div>
                        <p class="mt-4 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            "${student.description}"
                        </p>
                    </div>
                </div>
            `;
      container.insertAdjacentHTML('beforeend', card);
    });
  }
  lucide.createIcons();
}

function searchStudent() {
  const kw = document.getElementById("search").value.toLowerCase();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(kw) || s.roll.toLowerCase().includes(kw)
  );
  updateUI(filtered);
}

function deleteStudent(id) {
  if (confirm("Delete this student permanently?")) {
    students = students.filter(s => s.id !== id);
    saveAndRefresh();
  }
}

function saveAndRefresh() {
  localStorage.setItem("students", JSON.stringify(students));
  updateUI(students);
}

function clearForm() {
  ["name", "roll", "desc", "image"].forEach(f => document.getElementById(f).value = "");

  // Reset Preview
  const preview = document.getElementById('image-preview');
  const placeholder = document.getElementById('preview-placeholder');
  preview.src = "";
  preview.classList.add('hidden');
  placeholder.classList.remove('hidden');
}