# 🚗 Instant Mechanic Dashboard

A full-stack mechanic service management dashboard built with **React, Node.js, Express, MongoDB, and Socket.IO**.

The dashboard provides real-time visibility into bookings, mechanics, customers, revenue, analytics, and service activity.

## ✨ Features

- 📊 Dashboard with key business metrics
- 📅 Booking management
- 👨‍🔧 Mechanic management
- 👥 Customer management
- 📈 Booking and revenue analytics
- 🔄 Real-time updates with Socket.IO
- 🔍 Booking search functionality
- 📱 Responsive design for desktop, tablet, and mobile
- 🔐 Environment-based configuration
- 🌐 REST API integration
- 🍃 MongoDB database integration

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Axios
- Recharts
- Lucide React
- Socket.IO Client
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- CORS
- dotenv

## 📁 Project Structure

```text
Instant Mechanic Dashboard/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ashish838380/Instant-Mechanic-Dashboard.git
cd Instant-Mechanic-Dashboard
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` folder:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
```

> Never commit your `.env` file or expose your MongoDB credentials publicly.

### 5. Start the backend

From the `server` folder:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5001
```

### 6. Start the frontend

From the `client` folder:

```bash
npm run dev
```

Open the URL shown by Vite, usually:

```text
http://localhost:5173
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Dashboard statistics |
| GET | `/api/analytics` | Analytics data |
| GET | `/api/bookings` | Get bookings |
| GET | `/api/bookings/:id` | Get booking by ID |
| GET | `/api/mechanics` | Get mechanics |

## 📊 Dashboard Modules

The application includes:

- Total Bookings
- Today's Bookings
- Completed Bookings
- Pending Bookings
- Cancelled Bookings
- Total Revenue
- Active Mechanics
- New Customers
- Booking Trends
- Revenue Trends
- Booking Status Breakdown
- Service Breakdown

## 🔄 Real-Time Updates

Socket.IO is used to provide real-time communication between the backend and frontend.

This allows dashboard information to be updated without requiring a manual page refresh.

## 📱 Responsive Design

The dashboard is designed to work across:

- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

The layout automatically adapts to different screen sizes.

## 🏗️ Production Build

To create a production build of the React application:

```bash
cd client
npm run build
```

The optimized files are generated inside:

```text
client/dist
```

## 🔒 Security

Environment variables are excluded from Git using `.gitignore`.

Do not commit:

```text
.env
.env.*
```

## 👨‍💻 Author

**Ashish Yadav**

Computer Science Undergraduate  
Interested in Full Stack Development, Software Development, and AI-based Applications.

## 📄 License

This project is created for educational and portfolio purposes.