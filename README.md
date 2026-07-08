# 📚 Readify

Readify is a full-stack book tracking platform that helps readers discover books, organize their personal library, track reading progress, rate books, and write personal reflections. It integrates with the Google Books API to provide rich book information and offers a clean, responsive user experience backed by a secure RESTful API.

🌐 **Live Demo:** https://readify-frontend-phi.vercel.app/

---

## ✨ Features

### 🔐 Authentication
- Secure JWT-based authentication
- User Registration & Login
- Protected Routes & Middleware

### 🔍 Book Discovery
- Search books using the Google Books API
- View detailed book information
- Fast and responsive search experience

### 📚 Personal Library
- Add books to your personal library
- Remove books anytime
- Organize books into:
  - 📖 Want to Read
  - 📚 Currently Reading
  - ✅ Read

### 📈 Reading Progress
- Track reading progress
- Update reading status
- Rate completed books
- Write and edit personal reading reflections

### 📊 Dashboard
- Library overview
- Reading progress tracking
- Personalized reading analytics

### 📱 Responsive Design
- Mobile-friendly interface
- Smooth animations and modern UI

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Framer Motion
- GSAP

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcrypt
- Axios
- dotenv
- CORS

---

# 📂 Project Structure

```
Readify/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── app.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/khushi347/Readify.git
cd Readify
```

---

# ⚙️ Backend Setup

Install backend dependencies

```bash
npm install
```

Create a `.env` file in the project root

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
CLIENT_URL=http://localhost:5173
```

Run the backend

Development

```bash
npm run dev
```

Production

```bash
npm start
```

Backend runs at

```
http://localhost:5000
```

---

# 🎨 Frontend Setup

Move to the frontend directory

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 📌 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/books/search` | Search books using Google Books API |
| GET | `/api/library` | Fetch user's library |
| POST | `/api/library` | Add a book |
| PUT | `/api/library/:id` | Update reading status, rating or reflection |
| DELETE | `/api/library/:id` | Remove a book |

---

# 📸 Screenshots

> Add screenshots here after uploading them to the repository.

### 🏠 Home Page
<img width="1907" height="912" alt="Screenshot 2026-07-04 013132" src="https://github.com/user-attachments/assets/daedf3ac-7e12-4d47-a69f-93b28f570e7c" />

### 📚 Bookshelf

<img width="1887" height="911" alt="Screenshot 2026-07-04 013333" src="https://github.com/user-attachments/assets/41e47eb9-3c91-41f9-b7b8-75d45282f476" />

### 📊 Dashboard
<img width="1893" height="898" alt="Screenshot 2026-07-04 013641" src="https://github.com/user-attachments/assets/aba0b864-a9b8-477e-9e98-c51329950885" />


### 📖 Recommendations
<img width="1891" height="903" alt="Screenshot 2026-07-04 013833" src="https://github.com/user-attachments/assets/ba3cd6f4-5aa2-4f56-a622-4d2544a6a3cc" />

---

# 🌐 Live Demo

**Frontend:** https://readify-frontend-phi.vercel.app/

---

# 🚀 Future Improvements

- 🌙 Dark Mode
- 📈 Advanced Reading Analytics
- 🎯 Reading Goals & Streaks
- 🤖 AI-powered Book Recommendations
- 🔄 Refresh Token Authentication
- 📧 Email Verification
- 🔑 Forgot Password & Password Reset
- 👥 Social Reading Features
- 📄 Swagger API Documentation

---

# 👩‍💻 Author

**Khushi Sharma**

- GitHub: https://github.com/khushi347
- LinkedIn: https://www.linkedin.com/in/khushi-sharma-165b40293/
---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub. 
