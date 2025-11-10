// ==================== KONFIGURASI ====================
const config = {
  dataPath: "../data/world_happiness.csv",
  defaultYear: 2019,
  mapId: "map",
  scatterId: "#scatter",
  lineId: "#line",
};

let csvData = [];
let playing = false;
let timer = null;

// ==================== INISIALISASI ELEMEN DOM ====================
const $yearRange = d3.select("#yearRange");
const $yearLabel = d3.select("#yearLabel");
const $regionSelect = d3.select("#regionSelect");
const $playBtn = d3.select("#playBtn");
const $resetBtn = d3.select("#resetBtn");
const $speedSelect = d3.select("#speedSelect");
const $info = d3.select("#info");

// ==================== LEAFLET MAP ====================
const map = L.map(config.mapId, {
  zoomSnap: 0.1,
  minZoom: 1.5,
  worldCopyJump: true,
}).setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
}).addTo(map);

const layerGroup = L.layerGroup().addTo(map);

// ==================== LOAD DATA ====================
d3.csv(config.dataPath).then((data) => {
  data.forEach((d) => {
    d.year = +d.year;
    d.score = +d.score;
    d.gdp = +d.gdp;
    d.lat = +d.lat;
    d.lon = +d.lon;
  });

  csvData = data;
  const years = Array.from(new Set(data.map((d) => d.year))).sort(
    (a, b) => a - b
  );
  const minYear = d3.min(years);
  const maxYear = d3.max(years);

  // Slider
  $yearRange
    .attr("min", minYear)
    .attr("max", maxYear)
    .property("value", maxYear);
  $yearLabel.text(maxYear);

  // Region filter
  const regions = ["All", ...new Set(data.map((d) => d.region))];
  $regionSelect
    .selectAll("option")
    .data(regions)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  initScatter();
  initLine();

  updateAll(maxYear);

  // === Event: Slider ===
  $yearRange.on("input", function () {
    const selectedYear = +this.value;
    $yearLabel.text(selectedYear);
    updateAll(selectedYear);
  });

  // === Event: Region Select ===
  $regionSelect.on("change", () => updateAll(+$yearRange.property("value")));

  // === Event: Play / Pause ===
  $playBtn.on("click", () => {
    if (!playing) {
      playing = true;
      $playBtn.text("⏸ Pause");
      let year = +$yearRange.property("value");
      timer = setInterval(() => {
        if (year < maxYear) {
          year++;
        } else {
          year = minYear;
        }
        $yearRange.property("value", year);
        $yearLabel.text(year);
        updateAll(year);
      }, +$speedSelect.property("value"));
    } else {
      playing = false;
      clearInterval(timer);
      $playBtn.text("▶ Play");
    }
  });

  // === Event: Reset ===
  $resetBtn.on("click", () => {
    playing = false;
    clearInterval(timer);
    $playBtn.text("▶ Play");
    $regionSelect.property("value", "All");
    updateAll(maxYear);
  });
});

// ==================== UPDATE SEMUA ====================
function updateAll(year) {
  const region = $regionSelect.property("value");
  const filtered = csvData.filter(
    (d) => d.year === year && (region === "All" || d.region === region)
  );

  updateMap(filtered);
  updateScatter(filtered);
  updateLine(csvData, year);
  $info.text(`Menampilkan ${filtered.length} negara untuk tahun ${year}`);
}

// ==================== UPDATE MAP ====================
function updateMap(data) {
  layerGroup.clearLayers();

  const color = d3.scaleSequential(
    d3.extent(data, (d) => d.score),
    d3.interpolateYlGnBu
  );

  data.forEach((d) => {
    if (!d.lat || !d.lon) return;

    const circle = L.circleMarker([d.lat, d.lon], {
      radius: 6,
      fillColor: color(d.score),
      fillOpacity: 0.85,
      color: "#1e293b",
      weight: 0.8,
    }).addTo(layerGroup);

    // Tooltip singkat saat hover
    circle.bindTooltip(
      `<strong>${d.country}</strong><br>Skor: ${d.score.toFixed(2)}`
    );

    // Hover effect
    circle.on("mouseover", () => {
      circle.setStyle({ radius: 8, weight: 1.2, color: "#0f172a" });
    });
    circle.on("mouseout", () => {
      circle.setStyle({ radius: 6, weight: 0.8, color: "#1e293b" });
    });

    // Klik negara → tampilkan info + highlight + zoom
    circle.on("click", () => {
      highlightCountry(d.country);
      showCountryInfo(d);

      // Fokus ke negara yang diklik
      map.flyTo([d.lat, d.lon], 4, { duration: 0.8 });

      // Redupkan negara lain
      layerGroup.eachLayer((l) => {
        l.setStyle({ opacity: 0.4, fillOpacity: 0.4 });
      });

      // Sorot negara terpilih
      circle.setStyle({
        radius: 9,
        fillOpacity: 1,
        color: "#facc15",
        weight: 2,
        opacity: 1,
      });
    });
  });
}

// ==================== SCATTER ====================
function initScatter() {
  const width = 440,
    height = 380,
    margin = 50;

  const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin},${margin})`);

  window._scatter = { svg, width, height, margin };
}

function updateScatter(data) {
  const { svg, width, height, margin } = window._scatter;
  const innerW = width - margin * 2;
  const innerH = height - margin * 2;

  svg.selectAll("*").remove();

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.gdp))
    .range([0, innerW]);
  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.score))
    .range([innerH, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(5));
  svg.append("g").call(d3.axisLeft(y).ticks(5));

  svg
    .append("text")
    .attr("x", innerW / 2)
    .attr("y", innerH + 40)
    .attr("text-anchor", "middle")
    .text("GDP per Capita");

  svg
    .append("text")
    .attr("x", -innerH / 2)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Happiness Score");

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.gdp))
    .attr("cy", (d) => y(d.score))
    .attr("r", 5)
    .attr("fill", "#4f83ff")
    .attr("opacity", 0.8)
    .on("click", (event, d) => {
      highlightCountry(d.country);
      showCountryInfo(d);
    })
    .append("title")
    .text((d) => `${d.country}: ${d.score.toFixed(2)}`);
}

// ==================== LINE ====================
function initLine() {
  const width = 440,
    height = 240,
    margin = 50;

  const svg = d3
    .select("#line")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin},${margin / 2})`);

  window._line = { svg, width, height, margin };
}

function updateLine(csv, selectedYear, country = null) {
  const { svg, width, height, margin } = window._line;
  svg.selectAll("*").remove();

  if (!country) {
    const grouped = d3.group(csv, (d) => d.year);
    const avgByYear = Array.from(grouped, ([year, values]) => ({
      year: +year,
      avg: d3.mean(values, (d) => d.score),
    })).sort((a, b) => a.year - b.year);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(avgByYear, (d) => d.year))
      .range([0, width - margin * 2]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(avgByYear, (d) => d.avg)])
      .range([height - margin, 0]);

    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d.avg))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(avgByYear)
      .attr("fill", "none")
      .attr("stroke", "#4f83ff")
      .attr("stroke-width", 2)
      .attr("d", line);
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));
    svg.append("g").call(d3.axisLeft(y).ticks(5));
  } else {
    const dataCountry = csv
      .filter((d) => d.country === country)
      .sort((a, b) => a.year - b.year);
    const x = d3
      .scaleLinear()
      .domain(d3.extent(dataCountry, (d) => d.year))
      .range([0, width - margin * 2]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataCountry, (d) => d.score)])
      .range([height - margin, 0]);

    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d.score))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(dataCountry)
      .attr("fill", "none")
      .attr("stroke", "#facc15")
      .attr("stroke-width", 2)
      .attr("d", line);
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));
    svg.append("g").call(d3.axisLeft(y).ticks(5));
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .text(`Tren ${country}`)
      .style("font-weight", "bold");
  }
}

// ==================== HIGHLIGHT NEGARA ====================
function highlightCountry(country) {
  updateLine(csvData, +$yearRange.property("value"), country);
}

// ==================== INFO PANEL (Card Style) ====================
function showCountryInfo(d) {
  const html = `
    <div style="
      background:#f8fafc;
      border-radius:10px;
      padding:12px 14px;
      box-shadow:0 2px 6px rgba(0,0,0,0.1);
      font-family:Poppins,sans-serif;
      transition:all 0.3s ease;
    ">
      <h3 style="margin:0 0 6px;color:#1e293b;">${d.country}</h3>
      <p style="margin:2px 0;color:#475569;"><strong>Region:</strong> ${
        d.region
      }</p>
      <p style="margin:2px 0;color:#475569;"><strong>Tahun:</strong> ${
        d.year
      }</p>
      <p style="margin:2px 0;color:#475569;"><strong>Happiness Score:</strong> ${d.score.toFixed(
        2
      )}</p>
      <p style="margin:2px 0;color:#475569;"><strong>GDP per Capita:</strong> ${d.gdp.toFixed(
        2
      )}</p>
      <div style="margin-top:8px;font-size:12px;color:#64748b;">
        Klik negara lain di peta untuk melihat perbandingan tren.
      </div>
    </div>
  `;
  $info.html(html);
}
