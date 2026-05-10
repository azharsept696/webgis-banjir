/* ================================================
   WebGIS Analisis Risiko Banjir - app.js
   File utama yang mengatur semua logika peta
   ================================================ */

// ================================================
// KONFIGURASI GLOBAL
// Ubah nilai di sini untuk menyesuaikan peta
// ================================================
const CONFIG = {
  mapCenter: [-7.005, 110.420],  // Koordinat pusat peta (lat, lng) - Semarang
  mapZoom: 13,                    // Zoom awal peta
  minZoom: 11,
  maxZoom: 18,

  // Warna untuk tiap tingkat risiko
  riskColors: {
    tinggi: '#ef4444',
    sedang: '#f59e0b',
    rendah: '#22c55e'
  },

  // Transparansi fill polygon (0 = transparan, 1 = solid)
  fillOpacity: 0.45,
  strokeOpacity: 0.9
};


// ================================================
// VARIABEL GLOBAL
// ================================================
let map;           // Objek peta Leaflet
let geoJsonLayer;  // Layer GeoJSON zona banjir
let allFeatures;   // Semua data feature dari GeoJSON
let activeLayer = 'all';  // Filter layer aktif

// Elemen DOM yang sering digunakan
const DOM = {
  mapElement:    document.getElementById('map'),
  searchInput:   document.getElementById('search-input'),
  searchResults: document.getElementById('search-results'),
  infoEmpty:     document.getElementById('info-empty'),
  infoDetail:    document.getElementById('info-detail'),
  coordLat:      document.getElementById('coord-lat'),
  coordLng:      document.getElementById('coord-lng'),
  zoomLevel:     document.getElementById('zoom-level'),
  loadingOverlay: document.getElementById('loading-overlay')
};


// ================================================
// INISIALISASI PETA
// Fungsi utama yang dijalankan pertama kali
// ================================================
function initMap() {
  // Buat objek peta Leaflet
  map = L.map('map', {
    center: CONFIG.mapCenter,
    zoom: CONFIG.mapZoom,
    minZoom: CONFIG.minZoom,
    maxZoom: CONFIG.maxZoom,
    zoomControl: false  // Kita buat tombol zoom sendiri
  });

  // Tambahkan tile layer (gambar latar peta)
  // Menggunakan CartoDB Dark Matter untuk tema gelap
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Update info koordinat saat mouse bergerak di peta
  map.on('mousemove', function(e) {
    DOM.coordLat.textContent = e.latlng.lat.toFixed(5);
    DOM.coordLng.textContent = e.latlng.lng.toFixed(5);
  });

  // Update info zoom saat zoom berubah
  map.on('zoomend', function() {
    DOM.zoomLevel.textContent = map.getZoom();
  });

  // Set nilai zoom awal
  DOM.zoomLevel.textContent = CONFIG.mapZoom;

  // Muat data GeoJSON
  loadGeoJSON();
}


// ================================================
// MUAT DATA GEOJSON
// Membaca file GeoJSON dan menampilkannya di peta
// ================================================
function loadGeoJSON() {
  fetch('data/flood_zones.geojson')
    .then(function(response) {
      // Cek apakah request berhasil
      if (!response.ok) {
        throw new Error('Gagal memuat data GeoJSON: ' + response.statusText);
      }
      return response.json();  // Ubah response ke format JSON
    })
    .then(function(data) {
      allFeatures = data;
      renderGeoJSON(data);
      updateStatistik(data);
      hideLoading();
    })
    .catch(function(error) {
      console.error('Error:', error);
      // Tampilkan pesan error jika gagal load
      alert('⚠️ Gagal memuat data peta.\n\nPastikan Anda menjalankan project menggunakan Live Server, bukan membuka file HTML langsung.\n\nError: ' + error.message);
      hideLoading();
    });
}


// ================================================
// RENDER GEOJSON KE PETA
// Menampilkan polygom zona risiko di atas peta
// ================================================
function renderGeoJSON(data) {
  // Hapus layer lama jika sudah ada
  if (geoJsonLayer) {
    map.removeLayer(geoJsonLayer);
  }

  // Buat layer GeoJSON baru
  geoJsonLayer = L.geoJSON(data, {

    // Fungsi style: mengatur warna tiap polygon
    style: function(feature) {
      return getPolygonStyle(feature.properties.risk_level);
    },

    // Fungsi onEachFeature: menambahkan event ke tiap polygon
    onEachFeature: function(feature, layer) {
      const props = feature.properties;

      // === Popup saat klik polygon ===
      layer.bindPopup(createPopupContent(props), {
        maxWidth: 280,
        className: 'custom-popup-wrapper'
      });

      // === Event mouse over: highlight polygon ===
      layer.on('mouseover', function(e) {
        layer.setStyle({
          weight: 2.5,
          fillOpacity: 0.65
        });
        layer.bringToFront();
      });

      // === Event mouse out: kembali ke style normal ===
      layer.on('mouseout', function(e) {
        geoJsonLayer.resetStyle(layer);
      });

      // === Event klik: tampilkan info di sidebar ===
      layer.on('click', function(e) {
        showInfoPanel(props);
      });
    }
  }).addTo(map);
}


// ================================================
// STYLE POLYGON
// Menentukan warna berdasarkan tingkat risiko
// ================================================
function getPolygonStyle(riskLevel) {
  const color = CONFIG.riskColors[riskLevel] || '#888888';

  return {
    fillColor:   color,
    color:       color,      // warna garis tepi
    weight:      1.5,        // ketebalan garis tepi
    opacity:     CONFIG.strokeOpacity,
    fillOpacity: CONFIG.fillOpacity
  };
}


// ================================================
// BUAT KONTEN POPUP
// HTML yang ditampilkan saat polygon diklik
// ================================================
function createPopupContent(props) {
  const riskLabel  = getRiskLabel(props.risk_level);
  const riskColor  = CONFIG.riskColors[props.risk_level];

  return `
    <div class="custom-popup">
      <div class="popup-header">
        <div>
          <div class="popup-title">📍 ${props.kecamatan}</div>
          <div class="popup-subtitle">Kel. ${props.kelurahan}</div>
        </div>
        <div class="risk-badge ${props.risk_level}">
          ${riskLabel}
        </div>
      </div>

      <div class="popup-params">
        <div class="popup-param">
          <div class="popup-param-label">🌧 Curah Hujan</div>
          <div class="popup-param-val">${props.curah_hujan}<span class="popup-param-unit"> mm</span></div>
        </div>
        <div class="popup-param">
          <div class="popup-param-label">⛰ Elevasi</div>
          <div class="popup-param-val">${props.elevasi}<span class="popup-param-unit"> mdpl</span></div>
        </div>
        <div class="popup-param">
          <div class="popup-param-label">📐 Luas Area</div>
          <div class="popup-param-val">${props.luas_ha}<span class="popup-param-unit"> ha</span></div>
        </div>
        <div class="popup-param">
          <div class="popup-param-label">🔢 ID Zona</div>
          <div class="popup-param-val">#${String(props.id).padStart(3, '0')}</div>
        </div>
      </div>

      <div class="popup-note">
        💡 ${props.keterangan}
      </div>
    </div>
  `;
}


// ================================================
// INFO PANEL SIDEBAR
// Menampilkan detail zona di panel kiri
// ================================================
function showInfoPanel(props) {
  DOM.infoEmpty.style.display = 'none';
  DOM.infoDetail.classList.add('active');

  const riskLabel = getRiskLabel(props.risk_level);

  document.getElementById('info-kecamatan').textContent = props.kecamatan;
  document.getElementById('info-kelurahan').textContent = 'Kel. ' + props.kelurahan;

  const badge = document.getElementById('info-risk-badge');
  badge.textContent = riskLabel;
  badge.className = 'risk-badge ' + props.risk_level;

  document.getElementById('info-curah-hujan').textContent = props.curah_hujan;
  document.getElementById('info-elevasi').textContent = props.elevasi;
  document.getElementById('info-luas').textContent = props.luas_ha;
  document.getElementById('info-keterangan').textContent = props.keterangan;
}


// ================================================
// FUNGSI PEMBANTU (HELPER FUNCTIONS)
// ================================================

// Mengubah kode risk_level menjadi label yang mudah dibaca
function getRiskLabel(riskLevel) {
  const labels = {
    tinggi: '🔴 Tinggi',
    sedang:  '🟡 Sedang',
    rendah:  '🟢 Rendah'
  };
  return labels[riskLevel] || riskLevel;
}

// Sembunyikan loading overlay
function hideLoading() {
  DOM.loadingOverlay.classList.add('fade-out');
  setTimeout(function() {
    DOM.loadingOverlay.style.display = 'none';
  }, 500);
}


// ================================================
// UPDATE STATISTIK
// Menghitung dan menampilkan jumlah zona per kategori
// ================================================
function updateStatistik(data) {
  let tinggi = 0, sedang = 0, rendah = 0;

  data.features.forEach(function(feature) {
    const level = feature.properties.risk_level;
    if (level === 'tinggi') tinggi++;
    else if (level === 'sedang') sedang++;
    else if (level === 'rendah') rendah++;
  });

  document.getElementById('stat-tinggi').textContent = tinggi;
  document.getElementById('stat-sedang').textContent = sedang;
  document.getElementById('stat-rendah').textContent = rendah;

  // Update juga jumlah di layer control
  document.getElementById('count-tinggi').textContent = tinggi + ' zona';
  document.getElementById('count-sedang').textContent  = sedang + ' zona';
  document.getElementById('count-rendah').textContent  = rendah + ' zona';
  document.getElementById('count-all').textContent     = data.features.length + ' zona';
}


// ================================================
// FILTER LAYER
// Tampilkan/sembunyikan zona berdasarkan kategori
// ================================================
function filterLayer(riskLevel) {
  if (!allFeatures) return;

  let filteredData;

  if (riskLevel === 'all') {
    // Tampilkan semua zona
    filteredData = allFeatures;
  } else {
    // Filter hanya zona yang sesuai
    filteredData = {
      type: 'FeatureCollection',
      features: allFeatures.features.filter(function(f) {
        return f.properties.risk_level === riskLevel;
      })
    };
  }

  renderGeoJSON(filteredData);
}


// ================================================
// TOGGLE LAYER (checkbox on/off)
// ================================================
function toggleLayerVisibility(riskLevel, isVisible) {
  if (!geoJsonLayer) return;

  geoJsonLayer.eachLayer(function(layer) {
    const level = layer.feature.properties.risk_level;

    if (level === riskLevel || riskLevel === 'all') {
      if (isVisible) {
        map.addLayer(layer);
      } else {
        map.removeLayer(layer);
      }
    }
  });
}


// ================================================
// ZOOM KE SELURUH DATA
// ================================================
function zoomToAll() {
  if (geoJsonLayer) {
    map.fitBounds(geoJsonLayer.getBounds(), { padding: [30, 30] });
  }
}


// ================================================
// FITUR SEARCH LOKASI
// Mencari kecamatan/kelurahan dari GeoJSON
// ================================================
function searchLocation(query) {
  if (!allFeatures || query.length < 2) {
    DOM.searchResults.classList.remove('visible');
    return;
  }

  query = query.toLowerCase().trim();

  // Cari fitur yang namanya cocok dengan query
  const results = allFeatures.features.filter(function(f) {
    const props = f.properties;
    return (
      props.kecamatan.toLowerCase().includes(query) ||
      props.kelurahan.toLowerCase().includes(query)
    );
  });

  // Tampilkan hasil atau sembunyikan jika kosong
  if (results.length === 0) {
    DOM.searchResults.classList.remove('visible');
    return;
  }

  // Bangun HTML untuk dropdown hasil
  let html = '';
  results.forEach(function(feature) {
    const props = feature.properties;
    const color = CONFIG.riskColors[props.risk_level];
    const label = props.risk_level.charAt(0).toUpperCase() + props.risk_level.slice(1);

    html += `
      <div class="search-result-item" onclick="flyToFeature(${props.id})">
        <div class="result-dot" style="background: ${color}"></div>
        <div class="result-info">
          <div class="result-name">${props.kecamatan}</div>
          <div class="result-sub">Kel. ${props.kelurahan}</div>
        </div>
        <div class="result-badge risk-badge ${props.risk_level}" style="font-size:9px; padding: 2px 6px;">
          ${label}
        </div>
      </div>
    `;
  });

  DOM.searchResults.innerHTML = html;
  DOM.searchResults.classList.add('visible');
}


// ================================================
// FLY TO FEATURE
// Zoom dan highlight ke zona tertentu berdasarkan ID
// ================================================
function flyToFeature(featureId) {
  if (!geoJsonLayer) return;

  // Tutup dropdown search
  DOM.searchResults.classList.remove('visible');
  DOM.searchInput.value = '';

  // Cari layer yang sesuai dengan ID
  geoJsonLayer.eachLayer(function(layer) {
    if (layer.feature.properties.id === featureId) {
      // Zoom ke polygon tersebut
      map.fitBounds(layer.getBounds(), { padding: [60, 60], maxZoom: 15 });

      // Buka popup
      layer.openPopup();

      // Tampilkan info di sidebar
      showInfoPanel(layer.feature.properties);
    }
  });
}


// ================================================
// EVENT LISTENER
// Menghubungkan elemen HTML dengan fungsi JavaScript
// ================================================
document.addEventListener('DOMContentLoaded', function() {

  // --- Inisialisasi peta ---
  initMap();

  // --- Search input ---
  DOM.searchInput.addEventListener('input', function() {
    searchLocation(this.value);
  });

  // --- Tutup search dropdown saat klik di luar ---
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-wrapper')) {
      DOM.searchResults.classList.remove('visible');
    }
  });

  // --- Tombol zoom in ---
  document.getElementById('btn-zoom-in').addEventListener('click', function() {
    map.zoomIn();
  });

  // --- Tombol zoom out ---
  document.getElementById('btn-zoom-out').addEventListener('click', function() {
    map.zoomOut();
  });

  // --- Tombol zoom ke semua data ---
  document.getElementById('btn-zoom-all').addEventListener('click', function() {
    zoomToAll();
  });

  // --- Toggle checkbox layer ---
  document.querySelectorAll('.layer-toggle').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      const riskLevel = this.dataset.risk;
      const isVisible = this.checked;
      toggleLayerVisibility(riskLevel, isVisible);
    });
  });

});
