# 🎓 Video Learning Platform (Laravel)

A backend-powered video learning platform built using **Laravel**, providing authentication, subject and video management, and API support for frontend integration.

---

## 🚀 Features

* 🔐 User Authentication (Laravel Auth)
* 📚 Subject Management (Create, Read, Update, Delete)
* 🎥 Video Management per Subject (CRUD operations)
* 🔗 RESTful APIs for frontend (Angular)
* 🧱 Clean MVC architecture

---

## 🛠️ Tech Stack

* **Backend:** Laravel
* **Database:** MySQL
* **Storage:** Supabase (for video files)

---

## 📂 Project Structure (Overview)

* `Models` → Users, Subjects, Videos
* `Controllers` → Business logic & APIs
* `Routes` → API & web routes
* `Migrations` → Database schema

---

## ⚙️ Setup Instructions

1. Clone the repo:

```bash
git clone https://github.com/tayyab-balti/video-learning-platform-laravel.git
```

2. Install dependencies:

```bash
composer install
```

3. Setup environment:

```bash
cp .env.example .env
php artisan key:generate
```

4. Configure database & Supabase keys in `.env`

5. Run migrations:

```bash
php artisan migrate
```

6. Start server:

```bash
php artisan serve
```

---

## 🎯 Learning Outcome

This project helped me:

* Understand Laravel MVC architecture
* Build RESTful APIs
* Implement CRUD operations for real-world entities
* Integrate third-party storage (Supabase)

---

## 📌 Future Improvements

* Role-based access control
* Video upload dashboard
* API authentication (JWT / Sanctum)
* Pagination & filtering

---

## 📫 Contact

**Syed Tayyab**
📧 [smtayyab110@gmail.com](mailto:smtayyab110@gmail.com)
