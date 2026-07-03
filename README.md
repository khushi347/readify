# ⚙️ Readify Backend

Backend API for **Readify**, a full-stack book tracking application. It provides secure authentication, book management, reading progress tracking, ratings, reflections, and integrates with the Google Books API.

---

## 🚀 Features

* 🔐 JWT-based Authentication
* 👤 User Registration & Login
* 📚 Personal Library Management
* 📖 Reading Status Management

  * Want to Read
  * Currently Reading
  * Read
* ⭐ Book Ratings
* ✍️ Reading Reflections
* 🔍 Google Books API Integration
* 🗄️ MongoDB Database
* 🛡️ Protected Routes & Middleware
* ⚡ RESTful API Architecture

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Tokens)
* bcrypt.js
* Axios
* dotenv
* CORS

---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/readify-backend.git
cd readify-backend
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_BOOKS_API_KEY=your_api_key 
CLIENT_URL=http://localhost:5173
```

### Run the server

Development mode:

```bash
npm run dev
```

Production:

```bash
npm start
```

The server will be available at:

```text
http://localhost:5000
```

---

## 📌 API Endpoints

| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| POST   | `/api/auth/register` | Register a new user                          |
| POST   | `/api/auth/login`    | Authenticate user                            |
| GET    | `/api/books/search`  | Search books                                 |
| GET    | `/api/library`       | Get user's library                           |
| POST   | `/api/library`       | Add a book                                   |
| PUT    | `/api/library/:id`   | Update reading status, rating, or reflection |
| DELETE | `/api/library/:id`   | Remove a book                                |

---

## 🔗 Frontend Repository

https://github.com/khushi347/Readify-Frontend

## 🌐 Live Application

https://readify-frontend-phi.vercel.app/

---

## 🔮 Future Improvements

* Refresh Tokens
* Email Verification
* Password Reset
* Book Recommendations
* Reading Statistics
* Admin Dashboard
* API Documentation with Swagger

---

## 👩‍💻 Author

**Khushi Sharma**

If you found this project useful, consider giving it a ⭐ on GitHub!
