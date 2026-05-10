# 🌊 WebGIS Analisis Risiko Banjir
### Kota Semarang, Jawa Tengah

> **Tugas Pemrograman Komputer** — Aplikasi WebGIS sederhana berbasis Leaflet.js untuk analisis risiko banjir berbasis spasial.

---

## 📁 Struktur Folder Project

```
flood-risk-webgis/
│
├── index.html              ← Halaman utama aplikasi
├── README.md               ← Dokumentasi project ini
│
├── css/
│   └── style.css           ← Semua styling tampilan
│
├── js/
│   └── app.js              ← Logika JavaScript & Leaflet
│
└── data/
    └── flood_zones.geojson ← Data spasial zona risiko banjir
```

---

## 📄 Penjelasan Fungsi Tiap File

### `index.html`
File utama aplikasi. Berisi:
- Struktur HTML halaman (header, sidebar, peta, footer)
- Import library Leaflet.js dan Font Awesome dari CDN
- Import file CSS dan JavaScript kita sendiri
- Semua elemen HTML yang dimanipulasi oleh JavaScript (tombol, panel, peta)

### `css/style.css`
File styling seluruh tampilan. Berisi:
- **CSS Variables** → Warna-warna tema disimpan di sini agar mudah diubah
- **Layout** → Mengatur posisi header, sidebar, dan peta
- **Komponen** → Styling untuk card, tombol, badge risiko, popup, dll
- **Animasi** → Loading spinner dan efek pulse

### `js/app.js`
Otak aplikasi. Berisi fungsi-fungsi utama:

| Fungsi | Kegunaan |
|---|---|
| `initMap()` | Menginisialisasi peta Leaflet dan tile basemap |
| `loadGeoJSON()` | Membaca file GeoJSON menggunakan `fetch()` |
| `renderGeoJSON()` | Menampilkan polygon zona risiko ke peta |
| `getPolygonStyle()` | Menentukan warna polygon berdasarkan tingkat risiko |
| `createPopupContent()` | Membuat HTML untuk popup saat polygon diklik |
| `showInfoPanel()` | Menampilkan detail zona di sidebar kiri |
| `searchLocation()` | Mencari zona berdasarkan nama kecamatan/kelurahan |
| `flyToFeature()` | Zoom ke zona tertentu dan membuka popupnya |
| `filterLayer()` | Menampilkan/menyembunyikan zona berdasarkan kategori |
| `updateStatistik()` | Menghitung dan menampilkan jumlah zona per kategori |

### `data/flood_zones.geojson`
Data spasial dalam format GeoJSON. Berisi 12 polygon zona risiko banjir
di Kota Semarang dengan properties:
- `id` → Nomor unik zona
- `kecamatan` → Nama kecamatan
- `kelurahan` → Nama kelurahan
- `risk_level` → Tingkat risiko: `rendah` / `sedang` / `tinggi`
- `curah_hujan` → Curah hujan rata-rata (mm/tahun)
- `elevasi` → Ketinggian dari permukaan laut (mdpl)
- `luas_ha` → Luas area dalam hektar
- `keterangan` → Deskripsi kondisi wilayah

---

## ✨ Fitur Aplikasi

| Fitur | Keterangan |
|---|---|
| 🗺️ Peta Interaktif | Zoom, pan, klik menggunakan Leaflet.js |
| 🔴🟡🟢 Layer Zona | Polygon warna merah/kuning/hijau per tingkat risiko |
| 💬 Popup Klik | Klik polygon → tampil info detail |
| 📋 Panel Sidebar | Info detail zona di panel kiri |
| 🔍 Search Lokasi | Cari kecamatan/kelurahan, klik → peta fly to |
| 🔀 Toggle Layer | Checkbox untuk nyalakan/matikan tiap kategori |
| 📊 Statistik | Jumlah zona per kategori risiko |
| 📍 Koordinat Live | Koordinat kursor tampil di status bar bawah |

---

## 🚀 Cara Menjalankan Project

### Prasyarat
Pastikan kamu sudah menginstal:
- [VS Code](https://code.visualstudio.com/)
- Extension **Live Server** oleh Ritwick Dey

### Langkah-langkah

1. **Buka folder project di VS Code**
   ```
   File → Open Folder → pilih folder flood-risk-webgis
   ```

2. **Jalankan dengan Live Server**
   - Klik kanan `index.html` di Explorer
   - Pilih **"Open with Live Server"**
   - Browser akan otomatis membuka `http://127.0.0.1:5500`

3. **Atau dari status bar VS Code**
   - Klik tombol **"Go Live"** di pojok kanan bawah VS Code

### ⚠️ PENTING: Jangan buka index.html langsung!
Karena aplikasi menggunakan `fetch()` untuk membaca GeoJSON, file
**HARUS** dijalankan melalui server HTTP (Live Server), bukan dibuka
langsung sebagai file `file:///...` di browser. Ini akan menyebabkan
error CORS.

---

## 🔧 Cara Mengganti Data dengan GeoJSON dari QGIS Kamu

1. Di QGIS, selesaikan analisis risiko banjir kamu
2. Klik kanan layer → **Export → Save Features As**
3. Format: **GeoJSON**, CRS: **EPSG:4326 (WGS84)**
4. Simpan sebagai `flood_zones.geojson`
5. **Pastikan properties GeoJSON-mu mengandung kolom berikut:**
   ```
   risk_level  → "rendah" / "sedang" / "tinggi"
   kecamatan   → nama kecamatan
   kelurahan   → nama kelurahan
   curah_hujan → angka (mm)
   elevasi     → angka (mdpl)
   luas_ha     → angka (hektar)
   keterangan  → teks deskripsi
   ```
6. Ganti file `data/flood_zones.geojson` dengan file baru kamu
7. Refresh browser

---

## 🌐 Deploy ke GitHub Pages

### Langkah 1 — Buat Repository GitHub
1. Buka [github.com](https://github.com) → Login
2. Klik **"New repository"**
3. Nama repo: `webgis-risiko-banjir` (atau terserah)
4. Set ke **Public**
5. Klik **"Create repository"**

### Langkah 2 — Upload File Project
```bash
# Di terminal VS Code (Ctrl+`)
git init
git add .
git commit -m "🌊 Initial commit: WebGIS Risiko Banjir"
git branch -M main
git remote add origin https://github.com/USERNAME/webgis-risiko-banjir.git
git push -u origin main
```
> Ganti `USERNAME` dengan username GitHub kamu

### Langkah 3 — Aktifkan GitHub Pages
1. Buka repository di GitHub
2. Klik tab **"Settings"**
3. Scroll ke bagian **"Pages"** di sidebar kiri
4. Di "Source", pilih **"Deploy from a branch"**
5. Branch: **main**, folder: **/ (root)**
6. Klik **"Save"**

### Langkah 4 — Akses Website
Tunggu 1-2 menit, lalu akses:
```
https://USERNAME.github.io/webgis-risiko-banjir/
```

---

## 🎨 Kustomisasi Mudah

### Mengubah warna risiko
Edit di `js/app.js` bagian `CONFIG`:
```javascript
riskColors: {
  tinggi: '#ef4444',  // ← Ganti warna merah
  sedang: '#f59e0b',  // ← Ganti warna kuning
  rendah: '#22c55e'   // ← Ganti warna hijau
}
```

### Mengubah lokasi pusat peta
```javascript
mapCenter: [-7.005, 110.420],  // ← Ganti lat, lng
mapZoom: 13,                    // ← Ganti zoom awal
```

### Mengubah transparansi polygon
```javascript
fillOpacity: 0.45,  // 0.0 = transparan, 1.0 = solid
```

---

## 📚 Library yang Digunakan

| Library | Versi | Fungsi |
|---|---|---|
| [Leaflet.js](https://leafletjs.com/) | 1.9.4 | Peta interaktif |
| [Font Awesome](https://fontawesome.com/) | 6.5.0 | Ikon-ikon UI |
| [CartoDB Basemap](https://carto.com/basemaps/) | — | Tile peta gelap |
| [Google Fonts](https://fonts.google.com/) | — | Font Plus Jakarta Sans |

Semua library diload dari CDN (internet), tidak perlu install apapun!

---

## 👨‍💻 Catatan untuk Mahasiswa

- Kode ini ditulis **sesederhana mungkin** dengan komentar di setiap bagian
- Pelajari alur utama: `HTML → CSS → JavaScript → Leaflet → GeoJSON`
- Untuk menambah fitur baru, fokus pada file `js/app.js`
- Untuk mengubah tampilan, fokus pada file `css/style.css`
- GeoJSON adalah jembatan antara QGIS dan aplikasi web kamu

---

*Dibuat untuk tugas mata kuliah Pemrograman Komputer — Semester 2025*
