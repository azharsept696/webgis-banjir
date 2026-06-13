# Analisis Risiko Banjir
### Kota Semarang, Jawa Tengah

## Arsitektur Sistem

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
Data spasial dalam format GeoJSON. Berisi 16 polygon zona risiko banjir
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

## 📚 Library yang Digunakan

| Library | Versi | Fungsi |
|---|---|---|
| [Leaflet.js](https://leafletjs.com/) | 1.9.4 | Peta interaktif |
| [Font Awesome](https://fontawesome.com/) | 6.5.0 | Ikon-ikon UI |
| [CartoDB Basemap](https://carto.com/basemaps/) | — | Tile peta gelap |
| [Google Fonts](https://fonts.google.com/) | — | Font Plus Jakarta Sans |

