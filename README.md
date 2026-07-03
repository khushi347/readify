# 📚 Readify

A full-stack book tracking platform that helps readers discover books, organize their personal library, track reading progress, rate books, and write personal reflections. Readify integrates with the Google Books API and provides a seamless reading management experience through a modern React frontend and a secure Node.js backend.

🌐 **Live Demo:** https://readify-frontend-phi.vercel.app/

---

## ✨ Features

### 📖 Book Discovery
- 🔍 Search books using the Google Books API
- 📚 View book details and save books to your library

### 📚 Personal Library
- Add and remove books
- Organize books into:
  - Want to Read
  - Currently Reading
  - Read

### 📊 Reading Progress
- Track reading progress
- Update reading status
- Set ratings for completed books
- Write personal reflections and reviews

### 🔐 Authentication
- JWT-based authentication
- User registration & login
- Protected API routes

### 📈 Dashboard
- Reading statistics
- Library summary
- Progress analytics

### 📱 Responsive UI
- Optimized for desktop and mobile devices

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Context API
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
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/khushi347/Readify.git
cd Readify
```

---

## Backend Setup

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

Backend runs on

```
http://localhost:5000
```

---

## Frontend Setup

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

Frontend runs on

```
http://localhost:5173
```

---

# 📌 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/books/search` | Search books |
| GET | `/api/library` | Get user's library |
| POST | `/api/library` | Add a book |
| PUT | `/api/library/:id` | Update status, rating or reflection |
| DELETE | `/api/library/:id` | Remove a book |

---

# 🌐 Live Demo

https://readify-frontend-phi.vercel.app/

---

# 🔮 Future Improvements

- 🌙 Dark Mode
- 📈 Advanced Reading Statistics
- 🔄 Refresh Tokens
- 👥 Social Features
- 🔥 Reading Streaks
- 📄 Swagger API Documentation

---

# 👩‍💻 Author

**Khushi Sharma**

If you found this project helpful, consider giving it a ⭐ on GitHub!
