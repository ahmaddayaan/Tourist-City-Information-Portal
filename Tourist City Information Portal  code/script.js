/* ===== API KEYS ===== */
const WEATHERAPI_KEY = "0af5032ad53b46fea3591035253010";
const GNEWS_API_KEY = "6dff4d5f62fe649bc4b1d2d277bc9584";

/* ===== DOM ===== */
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const timeDisplay = document.getElementById("timeDisplay");
const dateDisplay = document.getElementById("dateDisplay");

const wcToggleBtn = document.getElementById("wcToggleBtn");
const wcForecast = document.getElementById("wcForecast");
const wcForecastInner = document.getElementById("wcForecastInner");
const wcError = document.getElementById("wcError");

const wcCity = document.getElementById("wcCity");
const wcCond = document.getElementById("wcCond");
const wcIcon = document.getElementById("wcIcon");
const wcTemp = document.getElementById("wcTemp");
const wcMinMax = document.getElementById("wcMinMax");
const wcHum = document.getElementById("wcHum");
const wcWind = document.getElementById("wcWind");
const wcLocal = document.getElementById("wcLocal");
const wcCard = document.getElementById("wcCard");

const wikiResult = document.getElementById("wikiResult");
const newsResult = document.getElementById("newsResult");
const mapFrame = document.getElementById("mapFrame");
const notesInput = document.getElementById("notesInput");
const saveNotesBtn = document.getElementById("saveNotes");
const addToBucketBtn = document.getElementById("addToBucket");
const bucketListEl = document.getElementById("bucketList");

/* ===== Animate on Scroll ===== */
const cards = document.querySelectorAll('.card[data-animate]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('fade-in'); });
}, { threshold: 0.15 });
cards.forEach(c => observer.observe(c));

/* ===== Clock ===== */
function updateClockLocal() {
  const now = new Date();
  timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  dateDisplay.textContent = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
setInterval(updateClockLocal, 1000);
updateClockLocal();

function animateCard(el) {
  el.classList.remove('fade-in');
  void el.offsetWidth;
  el.classList.add('fade-in');
}

/* ===== Weather API ===== */
function buildDayTile(day) {
  const div = document.createElement('div');
  div.className = 'wc-forecast-day';
  const dt = new Date(day.date);
  const icon = day.day.condition.icon.startsWith('//') ? 'https:' + day.day.condition.icon : day.day.condition.icon;
  div.innerHTML = `
    <div class="fd-date">${dt.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</div>
    <img src="${icon}" alt="${day.day.condition.text}" />
    <div class="fd-temp"><strong>${Math.round(day.day.maxtemp_c)}°</strong> / ${Math.round(day.day.mintemp_c)}°</div>
    <div class="fd-cond muted">${day.day.condition.text}</div>
  `;
  return div;
}

async function loadWeatherFor(city) {
  if (!city) return;
  wcCity.textContent = "Loading...";
  wcForecastInner.innerHTML = "";
  wcForecast.classList.remove("open");

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city)}&days=14`;
    const res = await fetch(url);
    const data = await res.json();

    wcCity.textContent = `${data.location.name}, ${data.location.country}`;
    wcCond.textContent = data.current.condition.text;
    wcTemp.textContent = `${Math.round(data.current.temp_c)}°C`;
    wcMinMax.textContent = `H: ${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}° / L: ${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°`;
    wcHum.textContent = `${data.current.humidity}%`;
    wcWind.textContent = `${(data.current.wind_kph / 3.6).toFixed(1)} m/s`;
    wcIcon.src = data.current.condition.icon.startsWith('//') ? 'https:' + data.current.condition.icon : data.current.condition.icon;

    const days = data.forecast.forecastday;
    const upper = document.createElement("div");
    const lower = document.createElement("div");
    upper.className = "wc-forecast-inner";
    lower.className = "wc-forecast-inner";
    days.slice(0, 7).forEach(d => upper.appendChild(buildDayTile(d)));
    days.slice(7, 14).forEach(d => lower.appendChild(buildDayTile(d)));
    wcForecastInner.append(upper, lower);

    animateCard(wcCard);
    fetchWikipedia(city);
    fetchNews(city);
    loadMap(city);
  } catch (err) {
    wcError.textContent = "Unable to load weather.";
  }
}

wcToggleBtn.addEventListener('click', () => {
  wcForecast.classList.toggle('open');
  wcToggleBtn.textContent = wcForecast.classList.contains('open') ? "Hide 14-Day Forecast ⌃" : "Show 14-Day Forecast ⌄";
});

searchBtn.addEventListener('click', () => {
  const c = cityInput.value.trim();
  if (!c) return alert("Please enter a city name!");
  loadWeatherFor(c);
  localStorage.setItem("lastCity", c);
});

/* ===== Wikipedia ===== */
async function fetchWikipedia(city){
  const target = (city || '').trim();
  if(!target){ wikiResult.innerHTML = '<p class="muted">Enter a city to load information.</p>'; return; }
  wikiResult.innerHTML = '<p class="muted">Fetching city info...</p>';
  try{
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(target)}`);
    const data = await res.json();
    if(data && data.type === 'standard'){
      const thumb = data.thumbnail ? `<img src="${data.thumbnail.source}" alt="${data.title}" class="wiki-image" />` : '';
      wikiResult.innerHTML = `
        <div class="wiki-card">
          ${thumb}
          <div class="wiki-content">
            <h3>${data.title}</h3>
            <p>${data.extract}</p>
            <a href="${data.content_urls.desktop.page}" target="_blank" rel="noopener" class="wiki-link">Read more on Wikipedia →</a>
          </div>
        </div>
      `;
    } else {
      wikiResult.innerHTML = `<p class="muted">No Wikipedia information found for "${target}".</p>`;
    }
    animateCard(wikiResult);
  } catch(err){
    console.error('wiki error', err);
    wikiResult.innerHTML = `<p class="muted">Error fetching Wikipedia info.</p>`;
  }
}

/* ===== News ===== */
async function fetchNews(city) {
  newsResult.innerHTML = "<p class='muted'>Fetching latest news...</p>";
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(city)}&lang=en&max=5&apikey=${GNEWS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.articles?.length) {
      newsResult.innerHTML = `<p class='muted'>No news found for ${city}.</p>`;
      return;
    }
    newsResult.innerHTML = "";
    data.articles.forEach(a => {
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `<h4>${a.title}</h4><p>${a.description || ""}</p><a href="${a.url}" target="_blank">Read more →</a>`;
      newsResult.appendChild(div);
    });
  } catch {
    newsResult.innerHTML = `<p class='muted'>Error loading news.</p>`;
  }
}

/* ===== Map ===== */
function loadMap(city) {
  mapFrame.innerHTML = `
    <iframe
      width="100%"
      height="400"
      style="border:0"
      loading="lazy"
      src="https://www.google.com/maps?q=${encodeURIComponent(city)}&output=embed">
    </iframe>`;
}

/* ===== Notes & Bucket List ===== */
function renderBucket() {
  bucketListEl.innerHTML = "";
  const items = JSON.parse(localStorage.getItem("bucketList") || "[]");
  items.forEach((i, idx) => {
    const li = document.createElement("li");
    li.textContent = i;
    const del = document.createElement("button");
    del.textContent = "✕";
    del.onclick = () => {
      items.splice(idx, 1);
      localStorage.setItem("bucketList", JSON.stringify(items));
      renderBucket();
    };
    li.appendChild(del);
    bucketListEl.appendChild(li);
  });
}

addToBucketBtn.addEventListener("click", () => {
  const v = notesInput.value.trim();
  if (!v) return;
  const items = JSON.parse(localStorage.getItem("bucketList") || "[]");
  items.push(v);
  localStorage.setItem("bucketList", JSON.stringify(items));
  notesInput.value = "";
  renderBucket();
});

saveNotesBtn.addEventListener("click", () => {
  localStorage.setItem("notesText", notesInput.value);
  alert("Notes saved!");
});

notesInput.value = localStorage.getItem("notesText") || "";
renderBucket();

/* ===== Auto-load last city ===== */
const lastCity = localStorage.getItem("lastCity");
if (lastCity) loadWeatherFor(lastCity);
