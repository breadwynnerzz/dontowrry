const state = {
  activeDestination: plannerData.destinations[0].id,
  activeFilter: "All",
  favorites: JSON.parse(localStorage.getItem("vacationFavorites") || "[]"),
  ratings: JSON.parse(localStorage.getItem("vacationRatings") || "{}")
};

const categories = ["All", ...plannerData.filters];
const ratingCategories = ["Fun", "Budget", "Mom Birthday Vibe", "Waterparks", "Activities for Everyone", "Travel Convenience"];

function moneyText(value) {
  return value;
}

function saveFavorites() {
  localStorage.setItem("vacationFavorites", JSON.stringify(state.favorites));
}

function saveRatings() {
  localStorage.setItem("vacationRatings", JSON.stringify(state.ratings));
}

function byId(id) {
  return document.getElementById(id);
}

function destinationById(id) {
  return plannerData.destinations.find((destination) => destination.id === id);
}

function attractionId(destinationId, attractionName) {
  return `${destinationId}:${attractionName}`;
}

function allAttractions() {
  return plannerData.destinations.flatMap((destination) =>
    destination.attractions.map((attraction) => ({ ...attraction, destinationId: destination.id, destinationName: destination.shortName }))
  );
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function imageMarkup(item, className, fallbackText, destinationId) {
  if (!item.image) {
    return `
      <div class="visual-placeholder visual-placeholder--${destinationId}">
        <span>${fallbackText}</span>
      </div>
    `;
  }

  return `
    <figure class="${className}" data-fallback="${escapeAttr(fallbackText)}">
      <img src="${item.image}" alt="${escapeAttr(item.imageAlt || fallbackText)}" loading="lazy" onerror="this.closest('figure').classList.add('image-failed')">
      ${item.imageCredit ? `<figcaption>Photo: <a href="${item.imageCreditUrl}" target="_blank" rel="noopener noreferrer">${item.imageCredit}</a></figcaption>` : ""}
    </figure>
  `;
}

function renderDestinationCards() {
  byId("destinationCards").innerHTML = plannerData.destinations.map((destination) => `
    <article class="destination-card">
      ${imageMarkup(destination, "destination-card__media destination-card__photo", destination.shortName, destination.id)}
      <div class="destination-card__body">
        <span class="pill">${destination.base}</span>
        <h3>${destination.name}</h3>
        <p>${destination.vibe}</p>
        <dl>
          <div><dt>Budget range</dt><dd>${destination.budgetRange}</dd></div>
          <div><dt>Airport options</dt><dd>${destination.airport}</dd></div>
        </dl>
        <div class="card-actions">
          <a class="btn btn-primary" href="#planner" data-jump="${destination.id}">View ${destination.shortName}</a>
          <a class="btn btn-light" href="#compare">Compare</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderFilters() {
  byId("filterBar").innerHTML = categories.map((category) => `
    <button class="${state.activeFilter === category ? "active" : ""}" type="button" data-filter="${category}">${category}</button>
  `).join("");
}

function renderTabs() {
  byId("destinationTabs").innerHTML = plannerData.destinations.map((destination) => `
    <button class="${state.activeDestination === destination.id ? "active" : ""}" type="button" data-destination="${destination.id}">
      ${destination.shortName}
    </button>
  `).join("");
}

function attractionCard(destination, attraction) {
  const id = attractionId(destination.id, attraction.name);
  const isFavorite = state.favorites.includes(id);
  return `
    <article class="attraction-card" data-category="${attraction.category}">
      ${imageMarkup(attraction, "attraction-photo", attraction.name, destination.id)}
      <div class="attraction-body">
        <div class="attraction-topline">
          <span class="category">${attraction.category}</span>
          <button class="favorite ${isFavorite ? "saved" : ""}" type="button" data-favorite="${id}" aria-label="Save ${attraction.name}">
            ${isFavorite ? "Saved" : "Save"}
          </button>
        </div>
        <h4>${attraction.name}</h4>
        <p>${attraction.description}</p>
        <div class="attraction-meta">
          <span>${attraction.location}</span>
          <span>${attraction.drive}</span>
        </div>
        <a class="site-link" href="${attraction.website}" target="_blank" rel="noreferrer">Official website</a>
      </div>
    </article>
  `;
}

function renderDestinationPanels() {
  const panels = plannerData.destinations.map((destination) => {
    const attractions = state.activeFilter === "All"
      ? destination.attractions
      : destination.attractions.filter((attraction) => attraction.category === state.activeFilter);
    return `
      <section class="destination-panel ${state.activeDestination === destination.id ? "active" : ""}" id="panel-${destination.id}">
        <div class="destination-overview">
          <div>
            <p class="eyebrow">${destination.shortName}</p>
            <h3>${destination.name}</h3>
            <p>${destination.vibe}</p>
          </div>
          <div class="overview-grid">
            <div><strong>Suggested base</strong><span>${destination.base}</span></div>
            <div><strong>Budget range</strong><span>${destination.budgetRange}</span></div>
            <div><strong>Drive reality</strong><span>${destination.driveNote}</span></div>
            <div><strong>Airport options</strong><span>${destination.airport}</span></div>
          </div>
        </div>
        <div class="pros-cons">
          <article><h4>Pros</h4><ul>${destination.pros.map((item) => `<li>${item}</li>`).join("")}</ul></article>
          <article><h4>Cons / warnings</h4><ul><li>${destination.warning}</li>${destination.cons.map((item) => `<li>${item}</li>`).join("")}</ul></article>
        </div>
        <div class="source-strip">
          <strong>Sources checked</strong>
          ${destination.sources.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`).join("")}
        </div>
        <div class="attraction-grid">
          ${attractions.length ? attractions.map((attraction) => attractionCard(destination, attraction)).join("") : `<p class="empty">No ${state.activeFilter.toLowerCase()} matches in this destination.</p>`}
        </div>
      </section>
    `;
  }).join("");
  byId("destinationPanels").innerHTML = panels;
}

function renderCompareTable() {
  const rows = Object.keys(plannerData.destinations[0].compare);
  byId("compareTable").innerHTML = `
    <thead>
      <tr>
        <th>Planning question</th>
        ${plannerData.destinations.map((destination) => `<th>${destination.shortName}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${rows.map((row) => `
        <tr>
          <td>${row}</td>
          ${plannerData.destinations.map((destination) => `<td>${destination.compare[row]}</td>`).join("")}
        </tr>
      `).join("")}
    </tbody>
  `;
}

function renderItineraries() {
  byId("itineraryGrid").innerHTML = plannerData.destinations.map((destination) => `
    <article class="itinerary-card">
      <div class="itinerary-visual itinerary-visual--${destination.id}">
        <span>${destination.shortName}</span>
      </div>
      <div class="itinerary-body">
        <span class="pill">${destination.shortName}</span>
        <h3>${destination.shortName} sample plan</h3>
        <div class="timeline">
          ${destination.itineraries.map((item) => `
            <div class="timeline-item">
              <strong>${item.day}</strong>
              <h4>${item.title}</h4>
              <p>${item.plan}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </article>
  `).join("");
}

function renderBudget() {
  byId("budgetGrid").innerHTML = plannerData.destinations.map((destination) => `
    <article class="budget-card">
      <div class="budget-head">
        <span class="pill">${destination.shortName}</span>
        <strong>${moneyText(destination.budgetRange)}</strong>
      </div>
      ${Object.entries(destination.budget).map(([label, amount]) => `
        <div class="budget-row"><span>${label}</span><strong>${amount}</strong></div>
      `).join("")}
    </article>
  `).join("");
}

function renderFavorites() {
  const favoriteAttractions = allAttractions().filter((attraction) =>
    state.favorites.includes(attractionId(attraction.destinationId, attraction.name))
  );
  byId("favoritesGrid").innerHTML = favoriteAttractions.length
    ? favoriteAttractions.map((attraction) => `
      <article class="favorite-card">
        ${imageMarkup(attraction, "favorite-photo", attraction.name, attraction.destinationId)}
        <div>
          <span class="category">${attraction.destinationName}</span>
          <h4>${attraction.name}</h4>
          <p>${attraction.category} - ${attraction.drive}</p>
          <a href="${attraction.website}" target="_blank" rel="noreferrer">Official website</a>
        </div>
      </article>
    `).join("")
    : `<p class="empty">No favorites yet. Save attractions from the destination grids and they will appear here.</p>`;
}

function renderRatings() {
  byId("ratingsGrid").innerHTML = plannerData.destinations.map((destination) => {
    const destinationRatings = state.ratings[destination.id] || {};
    return `
      <article class="rating-card">
        <h3>${destination.shortName}</h3>
        ${ratingCategories.map((category) => {
          const value = destinationRatings[category] || 0;
          return `
            <div class="rating-row">
              <span>${category}</span>
              <div class="stars" data-rate-destination="${destination.id}" data-rate-category="${category}">
                ${[1, 2, 3, 4, 5].map((star) => `
                  <button type="button" class="${star <= value ? "active" : ""}" data-star="${star}" aria-label="${star} stars for ${category}">&#9733;</button>
                `).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </article>
    `;
  }).join("");
}

function renderAll() {
  renderDestinationCards();
  renderFilters();
  renderTabs();
  renderDestinationPanels();
  renderCompareTable();
  renderItineraries();
  renderBudget();
  renderFavorites();
  renderRatings();
}

document.addEventListener("click", (event) => {
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    state.activeFilter = filter.dataset.filter;
    renderFilters();
    renderDestinationPanels();
    return;
  }

  const destinationTab = event.target.closest("[data-destination]");
  if (destinationTab) {
    state.activeDestination = destinationTab.dataset.destination;
    renderTabs();
    renderDestinationPanels();
    return;
  }

  const jump = event.target.closest("[data-jump]");
  if (jump) {
    state.activeDestination = jump.dataset.jump;
    renderTabs();
    renderDestinationPanels();
    return;
  }

  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    const id = favorite.dataset.favorite;
    state.favorites = state.favorites.includes(id)
      ? state.favorites.filter((favoriteId) => favoriteId !== id)
      : [...state.favorites, id];
    saveFavorites();
    renderDestinationPanels();
    renderFavorites();
    return;
  }

  const star = event.target.closest("[data-star]");
  if (star) {
    const group = star.closest(".stars");
    const destinationId = group.dataset.rateDestination;
    const category = group.dataset.rateCategory;
    state.ratings[destinationId] = state.ratings[destinationId] || {};
    state.ratings[destinationId][category] = Number(star.dataset.star);
    saveRatings();
    renderRatings();
  }
});

byId("clearFavorites").addEventListener("click", () => {
  state.favorites = [];
  saveFavorites();
  renderDestinationPanels();
  renderFavorites();
});

document.querySelector(".nav-toggle").addEventListener("click", () => {
  const nav = document.querySelector(".site-nav");
  const open = nav.classList.toggle("open");
  document.querySelector(".nav-toggle").setAttribute("aria-expanded", String(open));
});

renderAll();
