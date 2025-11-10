# Visualisasi-Data_World-Happiness
# 🌍 World Happiness Interactive Visualization

Sebuah visualisasi data interaktif dan animatif yang mengeksplorasi tingkat kebahagiaan global di berbagai negara dan sepanjang waktu, berdasarkan dataset *World Happiness Report* dari *United Nations Sustainable Development Solutions Network (UNSDSN)*.

# Tujuan

1. **Pemetaan Geografis Kebahagiaan** – Memahami bagaimana tingkat kebahagiaan berbeda di berbagai wilayah/negara.
2. **Analisis Korelasi GDP & Kebahagiaan** – Menilai hubungan antara kekayaan suatu negara dan skor kebahagiaannya.
3. **Analisis Tren Waktu** – Mengidentifikasi perubahan skor kebahagiaan dari tahun ke tahun.

# Eksplorasi Data
Tipe Variabel & Perannya:
• **Kategorikal (Nominal)**: *country*, *region* — digunakan untuk filtering, grouping, dan pemetaan ke geografi.
• **Temporal (Ordinal)**: *year* — digunakan sebagai penggerak utama animasi dan slider waktu.
• **Numerik (Continuous)**: *score*, *gdp*, *life_expectancy*, *corruption* — digunakan untuk sumbu, skala warna, dan nilai metrik yang diukur.

# Kualitas & Distribusi Data (Poin Kritis):
• **Pembersihan Data**: Ditemukan beberapa nilai *region* yang hilang (misalnya Tunisia). Nilai tersebut perlu diisi ulang secara manual sesuai daftar resmi WHR agar fitur filter wilayah berfungsi dengan benar.

• **Distribusi Score**: Variabel *score* berkisar dari sekitar **2.5** (contoh: Afghanistan 2019) hingga **7.8** (contoh: Finlandia 2019), dengan nilai rata-rata sekitar **5.4**.

• **Distribusi Year & Region**: Dataset memiliki **5 tahun unik** (2015–2019) dan **10 region unik**, yang menjadi dasar analisis temporal dan geografis.

# Hubungan Antar Variabel
• **Korelasi Positif Kuat**: Scatter plot menunjukkan hubungan positif yang signifikan antara *GDP per capita (gdp)* dan *Skor Kebahagiaan (score)*.
• **Korelasi Tidak Sempurna**: Hubungan gdp–score tidak membentuk garis lurus; masih terdapat varians yang cukup besar.
• **Varians & Outlier**: Banyak data menyimpang dari tren umum, menandakan faktor lain turut memengaruhi kebahagiaan.
• **Pengecualian Menarik**:
– Negara dengan PDB tinggi tetapi skor kebahagiaan “sedang”.
– Negara dengan PDB sedang namun skor kebahagiaan “sangat tinggi”.
• **PDB Bukan Satu-satunya Faktor**: Variabel lain dalam *world_happiness.csv* membantu menjelaskan variasi kebahagiaan antarnegara.
• **Harapan Hidup Sehat (life_expectancy)**: Menunjukkan korelasi positif yang kuat; semakin tinggi kesehatan populasi, semakin tinggi skor kebahagiaan.
• **Persepsi Korupsi (corruption)**: Berkorelasi negatif; tingginya persepsi korupsi cenderung menurunkan skor kebahagiaan.


---

## 🧠 Project Overview

Visualisasi ini memungkinkan pengguna untuk menjelajahi tren kebahagiaan global dan memahami bagaimana faktor ekonomi, sosial, dan kesehatan berkontribusi terhadap kesejahteraan di berbagai negara dari tahun ke tahun.

Dengan teknik visual interaktif dan animatif, pengguna dapat:
- Membandingkan skor kebahagiaan antarnegara melalui peta koroplet interaktif
- Mengamati tren dari waktu ke waktu melalui grafik garis animatif
- Menjelajahi detail tiap negara dengan tooltip saat hover dan interaksi klik
- Berpindah antar tahun menggunakan slider dengan transisi yang halus

---

## 🎯 Goals

* Membantu pengguna memahami **ketimpangan kebahagiaan global**
* Memvisualisasikan **pola temporal dan spasial** dalam data kebahagiaan
* Mendorong eksplorasi tentang bagaimana **faktor seperti PDB, harapan hidup, dan dukungan sosial** memengaruhi tingkat kebahagiaan

---

## 🗂 Dataset Information

**Dataset:** [World Happiness Report – Kaggle](https://www.kaggle.com/datasets/unsdsn/world-happiness)  
**Source:** United Nations Sustainable Development Solutions Network (UNSDSN)  
**File Used:** `data/world_happiness.csv`

**Main Columns:**
- `Country` — Country name  
- `Year` — Observation year  
- `Happiness Score` — Overall well-being index  
- `GDP per capita` — Economic indicator  
- `Social Support` — Strength of social connections  
- `Healthy life expectancy` — Health indicator  
- `Freedom` — Freedom to make life choices  
- `Generosity` — Charitable giving  
- `Corruption` — Perceived corruption levels

---

## 🧩 Key Features

| Feature | Description |
|----------|--------------|
| 🌍 **Interactive Map (Choropleth)** | Color-coded world map showing happiness scores per country |
| 🧭 **Hover Tooltips** | Show details such as GDP, social support, and corruption index |
| 📈 **Animated Line Chart** | Displays happiness trends of a selected country across years |
| 🎚 **Year Slider** | Dynamically updates the map and chart for different years |
| 🧮 **Smooth Transitions & Zoom** | Provides an engaging and intuitive data exploration experience |

---

## 🧠 Design Rationale

Kami memilih **peta koroplet** karena distribusi geografis memberikan pemahaman yang alami dan intuitif terhadap pola global.
**Grafik garis** melengkapi peta tersebut dengan menampilkan **perubahan temporal** di setiap negara.

**Pilihan Desain:**

* **Skala Warna:** Berurutan dari merah (rendah) → kuning (sedang) → biru (tinggi) untuk memberikan kesan emosional yang intuitif
* **Tooltip:** Mendukung *details-on-demand* tanpa menimbulkan kekacauan visual
* **Slider & Animasi:** Memperkuat pemahaman terhadap perubahan dari waktu ke waktu

**Alternatif yang Dipertimbangkan:**

* Scatter plot (PDB vs. Kebahagiaan) — informatif, tetapi kurang bermakna secara spasial
* Diagram batang perbandingan — kurang menarik untuk eksplorasi temporal

---

## 🧭 Interactivity & Animation Techniques

- **Dynamic Query Filters:** Adjust year using the slider to dynamically update visuals  
- **Details on Demand:** Hover over countries to see their details  
- **Coordinated Views:** Clicking a country updates the linked line chart  
- **Smooth Transitions:** Animated color changes and chart updates maintain visual continuity  

---

## 👥 Team Members & Responsibilities

| Name | Role | Responsibilities |
|------|------|------------------|
| **Haifan Rahmah** | 🧩 Team Leader & Developer | Data cleaning, D3 integration, animation synchronization & Slider|
| **Nur Fitriana Shalihah** | 🎨 UI/UX Designer | Visual design, layout & slider |
| **Berliana Mahadewi** | ⚙️ Interaction Developer | Slider, zoom/pan, video editing |
| **Siti Rhofiah** | 📊 Data Analyst & Presentation | trend analysis |
| **Mirza Helga Prabatanadi** | 🗒️ Documentation & Developer | map interactivity, video narration, peer review |

---

## 🛠 Development Process

1. **Data Cleaning & Preparation**  
   Removed missing values and standardized country names across years.  
2. **Base Map Setup**  
   Used [TopoJSON World Atlas](https://github.com/topojson/world-atlas) for the geographic layout.  
3. **D3 Visualization**  
   Implemented choropleth map, line chart, and interactivity.  
4. **Animations**  
   Added smooth transitions when switching years or countries.  
5. **Styling & UI**  
   Applied clean, modern visuals using soft colors and typography.  


---

## 🧾 Development Notes

- **Frameworks:** D3.js v7, TopoJSON v3    
- **Data Loading:** Local CSV file (`data/world_happiness.csv`)  
- **Browser Support:** Chrome, Edge, Firefox  

---

## 🎥 Presentation Video Outline (5 Minutes)

| Section | Duration | Presenter | Content |
|----------|-----------|------------|----------|
| Introduction | 1 min | Haifan | Dataset, project goals, and importance of happiness data |
| Deskripsi & tujuan | 1 min | Nur Fitriana | Deskripsi Dataset & tujuan |
| Eksplorasi  | 1 min | Berliana | Eksplorasi |
| Analisis & Hubungan Antar Viariabel | 1 min | Mirza Helga | Analisis & Hubungan Antar Viariabel |
| Visualiasai & Conclusion  | 1 min | Siti Rhofiah |Visualiasai & Conclusion |



## 📚 References & Credits

- **Dataset:** [World Happiness Report – Kaggle](https://www.kaggle.com/datasets/unsdsn/world-happiness)
- **Base Map:** [Natural Earth + TopoJSON](https://github.com/topojson/world-atlas)
- **Libraries:** [D3.js](https://d3js.org/), [TopoJSON](https://github.com/topojson/topojson)
- **Inspiration:** NameGrapher & HomeFinder dynamic query interactions

---

## 🧩 Repository Structure

