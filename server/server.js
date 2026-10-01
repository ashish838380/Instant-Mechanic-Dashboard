const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");

const dashboardRoutes = require("./routes/dashboardRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const customerRoutes = require("./routes/customerRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());
app.set("io", io);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Instant Mechanic Dashboard Backend Running 🚗",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.emit("connected", {
    message: "Connected to Instant Mechanic live server",
    timestamp: new Date().toISOString(),
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(
      `🚗 Server running on http://localhost:${PORT}`
    );
    console.log(
      `🔴 Socket.IO running on http://localhost:${PORT}`
    );
  });
};

startServer();

module.exports = {
  app,
  server,
  io,
};