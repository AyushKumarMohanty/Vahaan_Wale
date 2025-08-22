/* ======================
   Single JS file for all pages
   Handles:
   - Site data
   - Home grid rendering
   - Search page rendering
   - Car page details + 3D model src wiring
   - Previously viewed + Selected + Compare (localStorage)
   - EMI/on-road calculator
   - Dark mode persistence
   ====================== */

/* ---------- Data ---------- */
/* Prices are demo ex-showroom INR (numbers for calculations). Images are public host links. Model uses shared Car.glb */
const cars = {
  swift: {
    name: "Maruti Swift",
    price: 650000,
    mileage: "22 km/l",
    power: "89 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/53823/marutisuzuki-swift-exterior-right-front-three-quarter-49.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  creta: {
    name: "Hyundai Creta",
    price: 1120000,
    mileage: "17 km/l",
    power: "113 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/141783/hyundai-creta-facelift-right-front-three-quarter12.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  thar: {
    name: "Mahindra Thar",
    price: 1450000,
    mileage: "15 km/l",
    power: "130 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/121999/mahindra-thar-right-front-three-quarter7.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  baleno: {
    name: "Maruti Baleno",
    price: 780000,
    mileage: "22 km/l",
    power: "90 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/115295/maruti-suzuki-baleno-right-front-three-quarter0.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  brezza: {
    name: "Maruti Brezza",
    price: 980000,
    mileage: "20 km/l",
    power: "103 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/137451/maruti-suzuki-brezza-right-front-three-quarter7.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  harrier: {
    name: "Tata Harrier",
    price: 1650000,
    mileage: "16 km/l",
    power: "167 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/143123/tata-harrier-right-front-three-quarter10.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  nexon: {
    name: "Tata Nexon",
    price: 990000,
    mileage: "21 km/l",
    power: "118 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/144517/tata-nexon-right-front-three-quarter0.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  verna: {
    name: "Hyundai Verna",
    price: 1180000,
    mileage: "18 km/l",
    power: "115 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/135381/hyundai-verna-right-front-three-quarter10.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  venue: {
    name: "Hyundai Venue",
    price: 830000,
    mileage: "20 km/l",
    power: "118 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/144283/hyundai-venue-right-front-three-quarter1.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  xuv700: {
    name: "Mahindra XUV700",
    price: 1750000,
    mileage: "15 km/l",
    power: "197 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/118993/mahindra-xuv700-right-front-three-quarter0.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  fortuner: {
    name: "Toyota Fortuner",
    price: 3250000,
    mileage: "12 km/l",
    power: "201 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/137657/toyota-fortuner-right-front-three-quarter5.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  },
  ciaz: {
    name: "Maruti Ciaz",
    price: 920000,
    mileage: "21 km/l",
    power: "103 bhp",
    img: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/141849/maruti-suzuki-ciaz-right-front-three-quarter3.jpeg",
    model: "https://modelviewer.dev/shared-assets/models/Car.glb"
  }
};

/* ---------- Utilities ---------- */
const inr = n => "₹" + Number(n).toLocaleString("en-IN");
function computeEMI(principal, annualRate = 10, years = 5) {
  const r = (annualRate / 100) / 12;
  const n = years * 12;
  if (principal <= 0) return 0;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}
const cityFactor = { delhi: 1.05, mumbai: 1.08, bangalore: 1.10, chennai: 1.07, kolkata: 1.06 };

/* ---------- Dark mode (persist) ---------- */
(function initTheme() {
  const saved = localStorage.getItem("vw-theme");
  const toggle = document.getElementById("modeToggle");
  if (saved === "dark") document.body.classList.add("dark");
  if (toggle) toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("vw-theme", document.body.classList.contains("dark") ? "dark" : "light");
    toggle.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
})();

/* ---------- Splash ---------- */
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  const main = document.getElementById("mainContent");
  if (splash && main) {
    setTimeout(() => { splash.style.display = "none"; main.style.display = "block"; }, 1800);
  }
});

/* ---------- Home rendering (used on index.html) ---------- */
(function renderHomeGrid() {
  const grid = document.getElementById("homeGrid");
  if (!grid) return;
  // create cards from cars data
  Object.entries(cars).forEach(([key, c]) => {
    const a = document.createElement("a");
    a.className = "car-card";
    a.href = `car.html?car=${encodeURIComponent(key)}&city=delhi`;
    a.innerHTML = `
      <img src="${c.img}" alt="${c.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22160%22><rect width=%22300%22 height=%22160%22 fill=%22%23ddd%22/><text x=%2240%22 y=%2288%22 font-size=%2216%22>Image unavailable</text></svg>';">
      <h2>${c.name}</h2>
      <p>${inr(c.price)} • ${c.mileage}</p>
    `;
    // track viewed on click
    a.addEventListener("click", () => {
      const viewed = JSON.parse(localStorage.getItem("vw-viewed") || "[]");
      if (!viewed.includes(key)) viewed.unshift(key);
      localStorage.setItem("vw-viewed", JSON.stringify(viewed.slice(0, 20)));
    });
    grid.appendChild(a);
  });

  // render recent viewed pills
  const recentRoot = document.getElementById("recentViewed");
  if (recentRoot) {
    const viewed = JSON.parse(localStorage.getItem("vw-viewed") || "[]");
    recentRoot.innerHTML = "";
    viewed.slice(0, 8).forEach(k => {
      const d = document.createElement("div");
      d.className = "pill";
      d.textContent = cars[k] ? cars[k].name : k;
      recentRoot.appendChild(d);
    });
  }
})();

/* ---------- Search page logic ---------- */
(function initSearch() {
  const qEl = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const cityEl = document.getElementById("citySelect");
  const pillsWrap = document.getElementById("comparePills");
  const goCompare = document.getElementById("goCompare");
  const clearCompare = document.getElementById("clearCompare");
  if (!results || !qEl) return;

  function renderPills() {
    if (!pillsWrap) return;
    const set = new Set(JSON.parse(localStorage.getItem("vw-compare") || "[]"));
    pillsWrap.innerHTML = "";
    set.forEach(k => {
      const pill = document.createElement("div");
      pill.className = "pill";
      pill.innerHTML = `${cars[k]?.name || k} <span style="margin-left:.4rem;cursor:pointer" data-k="${k}">×</span>`;
      pillsWrap.appendChild(pill);
    });
    pillsWrap.querySelectorAll("span").forEach(x => x.addEventListener("click", () => {
      const k = x.getAttribute("data-k");
      const set = new Set(JSON.parse(localStorage.getItem("vw-compare") || "[]"));
      set.delete(k); localStorage.setItem("vw-compare", JSON.stringify([...set]));
      renderPills(); renderResults(qEl.value);
    }));
  }

  function makeCard(k, c) {
    const wrapper = document.createElement("div");
    wrapper.className = "car-card";
    wrapper.innerHTML = `
      <a href="car.html?car=${encodeURIComponent(k)}&city=${encodeURIComponent(cityEl?.value||'delhi')}" class="card-link">
        <img src="${c.img}" alt="${c.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22160%22><rect width=%22300%22 height=%22160%22 fill=%22%23ddd%22/><text x=%2240%22 y=%2288%22 font-size=%2216%22>Image unavailable</text></svg>';">
        <h2>${c.name}</h2>
        <p>${inr(c.price)} • ${c.mileage}</p>
      </a>
      <div style="margin-top:.5rem;">
        <label><input type="checkbox" class="cmpBox" data-k="${k}"> Add to Compare</label>
        <button class="btn-ghost selBtn" data-k="${k}">❤️ Save</button>
      </div>`;
    return wrapper;
  }

  function renderResults(q = "") {
    results.innerHTML = "";
    const query = String(q || "").trim().toLowerCase();
    Object.entries(cars).forEach(([k, c]) => {
      if (query && !c.name.toLowerCase().includes(query)) return;
      results.appendChild(makeCard(k, c));
    });

    // wire controls
    results.querySelectorAll(".cmpBox").forEach(cb => {
      cb.addEventListener("change", () => {
        const k = cb.dataset.k;
        const set = new Set(JSON.parse(localStorage.getItem("vw-compare") || "[]"));
        if (cb.checked) set.add(k); else set.delete(k);
        localStorage.setItem("vw-compare", JSON.stringify([...set]));
        renderPills();
      });
    });
    results.querySelectorAll(".selBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const k = btn.dataset.k;
        const sel = new Set(JSON.parse(localStorage.getItem("vw-selected") || "[]"));
        sel.add(k); localStorage.setItem("vw-selected", JSON.stringify([...sel]));
        btn.textContent = "✓ Saved";
      });
    });
  }

  qEl.addEventListener("input", e => renderResults(e.target.value));
  cityEl?.addEventListener("change", () => renderResults(qEl.value));
  goCompare?.addEventListener("click", () => location.href = "compare.html");
  clearCompare?.addEventListener("click", () => { localStorage.setItem("vw-compare", "[]"); renderPills(); renderResults(qEl.value); });

  renderPills(); renderResults();
})();

/* ---------- Car details page logic ---------- */
(function initCarPage() {
  if (!window.location.pathname.includes("car.html")) return;
  const params = new URLSearchParams(location.search);
  const key = params.get("car");
  const cityParam = (params.get("city") || "delhi").toLowerCase();
  const car = cars[key];
  const nameEl = document.getElementById("carName");
  const modelEl = document.getElementById("carModel");
  const imgEl = document.getElementById("carImage");
  const priceEl = document.getElementById("carPrice");
  const mileageEl = document.getElementById("carMileage");
  const powerEl = document.getElementById("carPower");
  const citySelect = document.getElementById("citySelectDetails");
  const onRoadEl = document.getElementById("carOnRoad");
  const emiOut = document.getElementById("carEMI");
  const dpInput = document.getElementById("downPayment");
  const tenureInput = document.getElementById("tenure");
  const rateInput = document.getElementById("rate");
  const calcBtn = document.getElementById("calcBtn");
  const dpButtons = document.querySelectorAll(".dpBtn");
  const modelViewer = document.getElementById("carModel3D");
  const saveBtn = document.getElementById("saveSelected");
  const toggleCompareBtn = document.getElementById("toggleCompare");
  const historyList = document.getElementById("historyList");
  const compareList = document.getElementById("compareList");
  const compareTable = document.getElementById("compareTable");

  if (!car) {
    nameEl.textContent = "Car not found";
    return;
  }

  // populate fields
  nameEl.textContent = car.name;
  modelEl.textContent = car.name;
  imgEl.src = car.img;
  priceEl.textContent = inr(car.price);
  mileageEl.textContent = car.mileage;
  powerEl.textContent = car.power;
  if (modelViewer) modelViewer.src = car.model;

  // on-road price
  function updateOnRoad() {
    const city = (citySelect.value || cityParam || "delhi").toLowerCase();
    const factor = cityFactor[city] || 1.06;
    const onroad = Math.round(car.price * factor);
    onRoadEl.textContent = inr(onroad);
    return onroad;
  }
  citySelect.value = cityParam;
  let currentOnRoad = updateOnRoad();
  citySelect.addEventListener("change", () => currentOnRoad = updateOnRoad());

  // EMI calc
  function updateEMI() {
    const dp = Math.max(0, Number(dpInput.value || 0));
    const years = Math.max(1, Number(tenureInput.value || 5));
    const rate = Math.max(0.1, Number(rateInput.value || 10));
    const principal = Math.max(0, currentOnRoad - dp);
    emiOut.textContent = inr(computeEMI(principal, rate, years));
  }
  calcBtn?.addEventListener("click", updateEMI);
  updateEMI();

  dpButtons.forEach(btn => btn.addEventListener("click", () => {
    const pct = Number(btn.dataset.p) || 0;
    dpInput.value = Math.round(currentOnRoad * pct);
    updateEMI();
  }));

  // save viewed history
  const viewed = JSON.parse(localStorage.getItem("vw-viewed") || "[]");
  if (!viewed.includes(key)) viewed.unshift(key);
  localStorage.setItem("vw-viewed", JSON.stringify(viewed.slice(0, 20)));
  if (historyList) {
    historyList.innerHTML = "";
    JSON.parse(localStorage.getItem("vw-viewed") || "[]").forEach(k => {
      const li = document.createElement("li");
      li.textContent = cars[k]?.name || k;
      historyList.appendChild(li);
    });
  }

  // compare list render
  function renderCompareList() {
    if (!compareList) return;
    compareList.innerHTML = "";
    const set = new Set(JSON.parse(localStorage.getItem("vw-compare") || "[]"));
    set.forEach(k => { const li = document.createElement("li"); li.textContent = cars[k]?.name || k; compareList.appendChild(li); });
    toggleCompareBtn.textContent = set.has(key) ? "⚖ Remove from Compare" : "⚖ Add to Compare";
  }
  toggleCompareBtn?.addEventListener("click", () => {
    const set = new Set(JSON.parse(localStorage.getItem("vw-compare") || "[]"));
    if (set.has(key)) set.delete(key); else set.add(key);
    localStorage.setItem("vw-compare", JSON.stringify([...set]));
    renderCompareList();
  });
  renderCompareList();

  // save selected
  saveBtn?.addEventListener("click", () => {
    const sel = new Set(JSON.parse(localStorage.getItem("vw-selected") || "[]"));
    sel.add(key); localStorage.setItem("vw-selected", JSON.stringify([...sel]));
    saveBtn.textContent = "✓ Added to Selected";
  });

  // quick compare table overview (all cars)
  if (compareTable) {
    Object.values(cars).forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${c.name}</td><td>${inr(c.price)}</td><td>${c.mileage}</td><td>${c.power}</td>`;
      compareTable.appendChild(tr);
    });
  }
})();

/* ---------- Compare page logic ---------- */
(function initComparePage() {
  const body = document.getElementById("comparePageBody");
  const citySel = document.getElementById("compareCity");
  const clearBtn = document.getElementById("clearComparePage");
  if (!body || !citySel) return;

  function render() {
    const list = JSON.parse(localStorage.getItem("vw-compare") || "[]");
    const f = cityFactor[citySel.value] || 1.06;
    body.innerHTML = "";
    if (!list.length) {
      body.innerHTML = `<tr><td colspan="5">No cars selected for compare. Add from Search or Car page.</td></tr>`;
      return;
    }
    list.forEach(k => {
      const c = cars[k]; if (!c) return;
      const onr = Math.round(c.price * f);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${c.name}</td><td>${inr(c.price)}</td><td>${inr(onr)}</td><td>${c.mileage}</td><td>${c.power}</td>`;
      body.appendChild(tr);
    });
  }
  render();
  citySel.addEventListener("change", render);
  clearBtn?.addEventListener("click", () => { localStorage.setItem("vw-compare", "[]"); render(); });
})();

/* ---------- Selected page logic ---------- */
(function initSelectedPage() {
  const grid = document.getElementById("selectedCards");
  const clearBtn = document.getElementById("clearSelected");
  if (!grid) return;

  function render() {
    const list = JSON.parse(localStorage.getItem("vw-selected") || "[]");
    grid.innerHTML = "";
    if (!list.length) { grid.innerHTML = `<div class="car-card">No selected cars yet.</div>`; return; }
    list.forEach(k => {
      const c = cars[k]; if (!c) return;
      const a = document.createElement("a");
      a.href = `car.html?car=${encodeURIComponent(k)}`;
      a.className = "car-card";
      a.innerHTML = `<img src="${c.img}" alt="${c.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22160%22><rect width=%22300%22 height=%22160%22 fill=%22%23ddd%22/><text x=%2240%22 y=%2288%22 font-size=%2216%22>Image unavailable</text></svg>';"><h2>${c.name}</h2><p>${inr(c.price)} • ${c.mileage}</p>`;
      grid.appendChild(a);
    });
  }
  render();
  clearBtn?.addEventListener("click", () => { localStorage.setItem("vw-selected", "[]"); render(); });
})();

/* ---------- Utility: Show selected/compare counts in header (optional) ---------- */
(function headerCounts() {
  // This is simple, updates counts if elements exist
  function update() {
    // could add badges; left as future tweak
  }
  update();
})();
