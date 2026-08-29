let projects = [];
let currentFilter = "all";
let currentProject = null;


/* ==============================
   DOM
============================== */

const projectsList = document.getElementById("projectsList");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const projectModal = document.getElementById("projectModal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

const refreshBtn = document.getElementById("refreshBtn");

const toast = document.getElementById("toast");


/* ==============================
   INIT
============================== */

document.addEventListener("DOMContentLoaded", () => {

  loadProjects();

  setupEvents();

});


/* ==============================
   EVENTS
============================== */

function setupEvents() {

  searchInput.addEventListener("input", renderProjects);

  statusFilter.addEventListener("change", () => {

    currentFilter = statusFilter.value;

    updateMenuActive();

    renderProjects();

  });


  refreshBtn.addEventListener("click", loadProjects);


  document.querySelectorAll(".menu-item").forEach(button => {

    button.addEventListener("click", () => {

      currentFilter = button.dataset.filter;

      statusFilter.value = currentFilter;

      updateMenuActive();

      renderProjects();

    });

  });


  modalClose.addEventListener("click", closeModal);


  document.querySelector(".modal-overlay").addEventListener(
    "click",
    closeModal
  );


  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeModal();
    }

  });

}


/* ==============================
   LOAD PROJECTS
============================== */

async function loadProjects() {

  loading.classList.remove("hidden");
  projectsList.innerHTML = "";
  emptyState.classList.add("hidden");


  try {

  const auth = sessionStorage.getItem("adminAuth");

if (!auth) {
  window.location.href = "/admin/login.html";
  return;
}

const response = await fetch("/api/projects", {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "Authorization": "Basic " + auth
  }
});

    const data = await response.json();


    if (!response.ok || !data.success) {

      throw new Error(
        data.message || "دریافت اطلاعات انجام نشد."
      );

    }


    projects = Array.isArray(data.projects)
      ? data.projects
      : [];


    updateStats();

    renderProjects();


  } catch (error) {

    console.error(error);

    showToast(
      error.message || "خطا در دریافت درخواست‌ها."
    );

    projectsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>خطا در دریافت اطلاعات</h3>
        <p>لطفاً دوباره تلاش کنید.</p>
      </div>
    `;

  } finally {

    loading.classList.add("hidden");

  }

}


/* ==============================
   STATS
============================== */

function updateStats() {

  const total = projects.length;

  const newProjects = projects.filter(
    project => project.status === "new"
  ).length;

  const reviewing = projects.filter(
    project => project.status === "reviewing"
  ).length;

  const completed = projects.filter(
    project => project.status === "completed"
  ).length;


  document.getElementById("allCount").textContent = total;
  document.getElementById("newCount").textContent = newProjects;
  document.getElementById("reviewingCount").textContent = reviewing;
  document.getElementById("completedCount").textContent = completed;


  document.getElementById("totalStat").textContent = total;
  document.getElementById("newStat").textContent = newProjects;
  document.getElementById("reviewingStat").textContent = reviewing;
  document.getElementById("completedStat").textContent = completed;

}


/* ==============================
   FILTER + SEARCH
============================== */

function getFilteredProjects() {

  const search = searchInput.value
    .trim()
    .toLowerCase();


  return projects.filter(project => {

    const matchesStatus =
      currentFilter === "all" ||
      project.status === currentFilter;


    const searchableText = [

      project.full_name,
      project.phone,
      project.brand,
      project.project_type,
      project.description,
      project.instagram,
      project.website

    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();


    const matchesSearch =
      !search ||
      searchableText.includes(search);


    return matchesStatus && matchesSearch;

  });

}


/* ==============================
   RENDER
============================== */

function renderProjects() {

  const filtered = getFilteredProjects();


  projectsList.innerHTML = "";


  if (filtered.length === 0) {

    emptyState.classList.remove("hidden");

    return;

  }


  emptyState.classList.add("hidden");


  filtered.forEach(project => {

    const card = document.createElement("div");

    card.className = "project-card";


    card.innerHTML = `

      <div class="project-info">

        <div class="project-name">
          ${escapeHTML(project.full_name || "بدون نام")}
        </div>

        <div class="project-meta">

          <span>
            📞
            ${escapeHTML(project.phone || "-")}
          </span>

          <span>
            🏢
            ${escapeHTML(project.brand || "بدون برند")}
          </span>

          <span>
            🎬
            ${escapeHTML(project.project_type || "نوع پروژه مشخص نشده")}
          </span>

        </div>

      </div>


      <div class="project-date">
        ${formatDate(project.created_at)}
      </div>


      <div>
        ${statusBadge(project.status)}
      </div>


      <button
        class="view-btn"
        data-id="${project.id}"
      >
        مشاهده
      </button>

    `;


    card.querySelector(".view-btn")
      .addEventListener("click", () => {

        openProject(project.id);

      });


    projectsList.appendChild(card);

  });

}


/* ==============================
   OPEN PROJECT
============================== */

function openProject(id) {

  const project = projects.find(
    item => Number(item.id) === Number(id)
  );


  if (!project) {
    return;
  }


  currentProject = project;


  modalContent.innerHTML = `

    <div class="modal-title">
      جزئیات درخواست پروژه
    </div>


    <div class="details-grid">

      ${detail(
        "نام و نام خانوادگی",
        project.full_name
      )}

      ${detail(
        "شماره تماس",
        project.phone,
        project.phone
          ? `<a href="tel:${escapeHTML(project.phone)}">${escapeHTML(project.phone)}</a>`
          : "-"
      )}


      ${detail(
        "نام برند / کسب‌وکار",
        project.brand
      )}

      ${detail(
        "نوع پروژه",
        project.project_type
      )}


      ${detail(
        "بودجه",
        project.budget
      )}

      ${detail(
        "زمان شروع",
        project.start_time
      )}


      ${detail(
        "اینستاگرام",
        project.instagram,
        project.instagram
          ? `<a href="${safeExternalUrl(project.instagram)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.instagram)}</a>`
          : "-"
      )}


      ${detail(
        "وب‌سایت",
        project.website,
        project.website
          ? `<a href="${safeExternalUrl(project.website)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.website)}</a>`
          : "-"
      )}


      ${detail(
        "تاریخ ثبت",
        formatDate(project.created_at)
      )}


      ${detail(
        "شناسه درخواست",
        project.id
      )}


      <div class="detail-item full">

        <div class="detail-label">
          توضیحات مشتری
        </div>

        <div class="detail-value description">
          ${escapeHTML(project.description || "توضیحی ثبت نشده است.")}
        </div>

      </div>

    </div>


    <div class="modal-actions">

      <select id="modalStatus">

        <option value="new"
          ${project.status === "new" ? "selected" : ""}>
          جدید
        </option>

        <option value="reviewing"
          ${project.status === "reviewing" ? "selected" : ""}>
          در حال بررسی
        </option>

        <option value="completed"
          ${project.status === "completed" ? "selected" : ""}>
          تکمیل شده
        </option>

      </select>


      <button
        class="action-btn save-btn"
        id="saveStatusBtn"
      >
        ذخیره وضعیت
      </button>


      <button
        class="action-btn delete-btn"
        id="deleteProjectBtn"
      >
        حذف درخواست
      </button>

    </div>

  `;


  projectModal.classList.remove("hidden");


  document
    .getElementById("saveStatusBtn")
    .addEventListener(
      "click",
      saveStatus
    );


  document
    .getElementById("deleteProjectBtn")
    .addEventListener(
      "click",
      deleteProject
    );

}


/* ==============================
   DETAIL
============================== */

function detail(label, value, customHTML = null) {

  return `

    <div class="detail-item">

      <div class="detail-label">
        ${escapeHTML(label)}
      </div>

      <div class="detail-value">

        ${
          customHTML !== null
            ? customHTML
            : escapeHTML(value || "-")
        }

      </div>

    </div>

  `;

}


/* ==============================
   SAVE STATUS
============================== */

async function saveStatus() {

  if (!currentProject) {
    return;
  }


  const statusElement =
    document.getElementById("modalStatus");


  const status = statusElement.value;


  try {

    const response = await fetch(
      "/api/projects/status",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          id: currentProject.id,
          status
        })
      }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

      throw new Error(
        data.message || "تغییر وضعیت انجام نشد."
      );

    }


    currentProject.status = status;


    const index = projects.findIndex(
      item => Number(item.id) === Number(currentProject.id)
    );


    if (index !== -1) {
      projects[index].status = status;
    }


    updateStats();

    renderProjects();

    closeModal();


    showToast(
      "وضعیت درخواست با موفقیت تغییر کرد."
    );


  } catch (error) {

    console.error(error);

    showToast(
      error.message || "خطا در تغییر وضعیت."
    );

  }

}


/* ==============================
   DELETE
============================== */

async function deleteProject() {

  if (!currentProject) {
    return;
  }


  const confirmed = confirm(
    "آیا مطمئن هستید که می‌خواهید این درخواست را حذف کنید؟ این عملیات قابل بازگشت نیست."
  );


  if (!confirmed) {
    return;
  }


  try {

    const response = await fetch(
      `/api/projects?id=${encodeURIComponent(currentProject.id)}`,
      {
        method: "DELETE"
      }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

      throw new Error(
        data.message || "حذف درخواست انجام نشد."
      );

    }


    projects = projects.filter(
      project =>
        Number(project.id) !==
        Number(currentProject.id)
    );


    updateStats();

    renderProjects();

    closeModal();


    showToast(
      "درخواست با موفقیت حذف شد."
    );


  } catch (error) {

    console.error(error);

    showToast(
      error.message || "خطا در حذف درخواست."
    );

  }

}


/* ==============================
   STATUS BADGE
============================== */

function statusBadge(status) {

  const labels = {

    new: "جدید",

    reviewing: "در حال بررسی",

    completed: "تکمیل شده"

  };


  const label =
    labels[status] || "نامشخص";


  return `
    <span class="status status-${escapeHTML(status || "new")}">
      ${label}
    </span>
  `;

}


/* ==============================
   DATE
============================== */

function formatDate(dateString) {

  if (!dateString) {
    return "-";
  }


  const date = new Date(
    dateString.replace(" ", "T") + "Z"
  );


  if (Number.isNaN(date.getTime())) {
    return dateString;
  }


  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);

}


/* ==============================
   MENU
============================== */

function updateMenuActive() {

  document
    .querySelectorAll(".menu-item")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.filter === currentFilter
      );

    });

}


/* ==============================
   MODAL
============================== */

function closeModal() {

  projectModal.classList.add("hidden");

  currentProject = null;

}


/* ==============================
   TOAST
============================== */

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");


  clearTimeout(window.toastTimer);


  window.toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);

}


/* ==============================
   SECURITY HELPERS
============================== */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }


  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function safeExternalUrl(value) {

  if (!value) {
    return "#";
  }


  let url = String(value).trim();


  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {

    url = "https://" + url;

  }


  try {

    const parsed = new URL(url);


    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      return "#";
    }


    return parsed.href;

  } catch {

    return "#";

  }

}
