## Bengkel + Carwash dengan Cafe Sebagai Supporting Service

---

# 1. Perubahan Konsep Bisnis

Pada konsep awal, cafe menjadi bagian utama yang terintegrasi langsung dengan:
- service kendaraan,
- carwash,
- dan sistem booking utama.

Namun setelah dianalisis lebih dalam, konsep tersebut memiliki beberapa kelemahan operasional dan logika bisnis.

Karena itu, konsep direvisi menjadi:

```text
Cafe bukan layanan utama,
melainkan layanan pendukung (supporting service)
```

Artinya:
- fokus utama bisnis tetap pada bengkel dan carwash,
- sedangkan cafe hanya menjadi fasilitas tambahan untuk customer yang sedang menunggu kendaraan diproses.

---

# 2. Alasan Perubahan Konsep Cafe

## A. Customer Datang Karena Kendaraan, Bukan Cafe

Core business sebenarnya adalah:
- service kendaraan,
- dan carwash.

Cafe hanya berfungsi untuk:
- meningkatkan kenyamanan,
- memperbaiki waiting experience,
- dan menambah peluang penjualan tambahan.

Jika cafe diposisikan setara dengan service utama, maka fokus bisnis menjadi tidak jelas.

---

# 3. Konsep Bisnis Setelah Revisi

## Core Business
- Bengkel kendaraan
- Carwash

---

## Supporting Business
- Cafe / waiting area

---

# 4. Peran Cafe Dalam Sistem

Cafe sekarang berfungsi sebagai:

```text
Waiting Experience Support System
```

Bukan:
```text
main transactional service
```

---

# 5. Perubahan Sistem Website

## Sebelumnya
Customer dapat:
- booking cafe,
- memesan makanan sebagai layanan utama.

---

## Sekarang
Cafe tidak menjadi layanan booking utama.

Cafe hanya muncul ketika:
- customer sudah melakukan booking,
- atau kendaraan sedang diproses.

---

# 6. Alur Sistem Baru

## Alur Customer

```text
Masuk Website
       ↓
Booking Service / Carwash
       ↓
Pilih Jadwal
       ↓
Checkout
       ↓
Datang ke Lokasi
       ↓
Kendaraan Diproses
       ↓
Status: Waiting
       ↓
Customer Mendapat Akses Cafe
       ↓
Customer Bisa Memesan Makanan/Minuman
       ↓
Kendaraan Selesai
```

---

# 7. Konsep Cafe Setelah Revisi

## Fungsi Cafe
- Tempat tunggu nyaman
- Tempat bekerja sementara
- Tempat customer beristirahat
- Sarana tambahan customer experience

---

# 8. Perubahan Fitur Website

# A. Fokus Utama Website

Website sekarang fokus pada:
- booking service,
- booking carwash,
- manajemen antrian,
- monitoring kendaraan.

---

# B. Cafe Menjadi Secondary Feature

Cafe hanya dapat diakses:
- setelah customer booking,
- atau saat status kendaraan sedang diproses.

---

# 9. Sistem Cafe yang Lebih Realistis

## Customer Tidak Bisa:
- booking meja cafe,
- booking makanan jauh hari,
- memesan cafe tanpa layanan kendaraan.

Karena itu akan membuat:
- operasional tidak fokus,
- konsep bisnis membingungkan,
- dan sistem terlalu kompleks.

---

# 10. Sistem Cafe Baru

## Saat Customer Waiting

Ketika status kendaraan:
```text
Waiting / On Service / Washing
```

maka website menampilkan:
```text
"Pesan makanan & minuman?"
```

---

# 11. Alur Pemesanan Cafe

```text
Customer Sedang Waiting
          ↓
Sistem Menampilkan Menu Cafe
          ↓
Customer Memesan Minuman/Makanan
          ↓
Pesanan Masuk ke Dashboard Cafe
          ↓
Barista Menyiapkan Pesanan
          ↓
Pesanan Diantar / Dipanggil
```

---

# 12. Keuntungan Perubahan Ini

## A. Fokus Bisnis Lebih Jelas

Core bisnis tetap:
- automotive service.

Cafe hanya mendukung pengalaman customer.

---

## B. Sistem Website Lebih Sederhana

Karena website tidak perlu:
- sistem reservasi cafe,
- manajemen meja kompleks,
- sistem dine-in rumit.

---

## C. Operasional Lebih Masuk Akal

Customer cafe berasal dari:
- customer bengkel,
- customer carwash.

Bukan customer umum.

---

## D. Mengurangi Kompleksitas MVP

Ini penting.

Karena untuk tahap awal:
- scheduling service,
- antrian kendaraan,
- dan monitoring pengerjaan

sudah cukup kompleks.

Kalau cafe ikut dijadikan sistem utama:
- development jadi lebih berat,
- risiko bug meningkat,
- fokus sistem pecah.

---

# 13. Struktur Website Setelah Revisi

```text
HOME
│
├── Booking
│     ├── Service Bengkel
│     ├── Carwash
│     └── Bundling Package
│
├── Tracking Kendaraan
│
├── Promo
│
├── Membership
│
├── Login/Register
│
└── Cafe Menu
      (akses saat waiting)
```

---

# 14. Perubahan Value Proposition

## Sebelumnya
```text
Bengkel + Carwash + Cafe
```

---

## Sekarang
```text
Automotive Service dengan Waiting Experience yang Nyaman
```

Ini jauh lebih kuat dan realistis.

Karena customer membeli:
- efisiensi,
- kenyamanan,
- dan kepastian waktu.

Bukan datang khusus untuk cafe.

---

# 15. Fokus Pengembangan Website Setelah Revisi

## Fokus Utama
- Booking online
- Scheduling system
- Queue management
- Status kendaraan
- Dashboard admin

---

## Fokus Secondary
- Menu cafe
- Ordering cafe saat waiting
- Promo tambahan

---

# 16. Sistem yang Menjadi Prioritas

## A. Scheduling Engine
Mengatur:
- slot service,
- kapasitas teknisi,
- estimasi durasi.

---

## B. Queue Management
Mengatur:
- antrean kendaraan,
- status pengerjaan,
- monitoring operasional.

---

## C. Vehicle Tracking
Customer dapat melihat:
- progress kendaraan,
- estimasi selesai,
- status pengerjaan.

---

# 17. Kesimpulan

Setelah direvisi, konsep bisnis menjadi lebih:
- realistis,
- fokus,
- dan mudah diimplementasikan.

Cafe tidak lagi menjadi layanan utama, melainkan:
```text
supporting service untuk meningkatkan customer experience
```

Dengan konsep ini:
- fokus bisnis tetap jelas,
- sistem website lebih efisien,
- dan operasional lebih mudah dikontrol.

Website akan lebih difokuskan pada:
- sistem booking kendaraan,
- manajemen antrian,
- monitoring pengerjaan,
- dan efisiensi operasional.

Sedangkan cafe menjadi fasilitas tambahan yang aktif ketika customer sedang menunggu kendaraan diproses.