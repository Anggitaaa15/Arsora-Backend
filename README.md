# Arsora Backend

Arsora Backend adalah REST API yang dikembangkan untuk mendukung aplikasi mobile Arsora. Aplikasi Arsora merupakan platform katalog dan penjualan lukisan yang dapat digunakan untuk mencari, melihat, dan mengelola produk lukisan.

## Teknologi yang Digunakan

- **Node.js** – Runtime JavaScript.
- **Express.js** – Framework untuk membangun REST API.
- **TypeScript** – Bahasa pemrograman dengan sistem tipe data.
- **PostgreSQL** – Database untuk menyimpan data aplikasi.
- **Drizzle ORM** – ORM untuk mengelola database.
- **JWT (JSON Web Token)** – Autentikasi pengguna.
- **Bcrypt** – Enkripsi hash password.
- **Multer** – Middleware untuk menangani upload file.
- **Cloudinary** – Penyimpanan gambar secara online.
- **Zod** – Validasi data request.

## Fitur

- Registrasi dan login pengguna.
- Autentikasi menggunakan JWT.
- Pengelolaan data profil pengguna.
- Pengelolaan kategori lukisan.
- CRUD produk lukisan (Create, Read, Update, Delete).
- Upload dan pengelolaan gambar produk menggunakan Cloudinary.
- Pengelolaan keranjang belanja.
- Validasi data menggunakan Zod.

## Struktur Project

```text
arsora-backend/
├── drizzle/          # File migrasi database
├── src/
│   ├── config/       # Konfigurasi database dan layanan
│   ├── controllers/  # Logika pengolahan request
│   ├── middleware/   # Middleware autentikasi dan upload
│   ├── routes/       # Endpoint API
│   ├── service/      # Layanan pendukung aplikasi
│   ├── validations/  # Validasi data request
│   └── index.ts      # File utama server
├── .env              # Konfigurasi environment
├── package.json
└── tsconfig.json
```

## Instalasi

1. Clone repository:

```bash
git clone URL_REPOSITORY
```

2. Masuk ke folder project:

```bash
cd arsora-backend
```

3. Install dependencies:

```bash
npm install
```

4. Buat file `.env` pada folder utama project dan isi konfigurasi yang dibutuhkan:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Jalankan server dalam mode development:

```bash
npm run dev
```

## Base URL API

```text
http://localhost:5000/api/v1
```

Endpoint API dikelompokkan berdasarkan fitur, seperti autentikasi, produk, dan keranjang belanja.

## Database

Arsora Backend menggunakan PostgreSQL sebagai database dan Drizzle ORM untuk mengelola struktur serta operasi database.

File migrasi database disimpan di dalam folder `drizzle/`.

## Pengembang

**Arsora** – Backend Development

