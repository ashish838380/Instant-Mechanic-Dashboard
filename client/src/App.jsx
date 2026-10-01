import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  LayoutDashboard,
  CalendarDays,
  Users,
  Wrench,
  Settings,
  Car,
  Activity,
  CheckCircle2,
  Clock3,
  XCircle,
  IndianRupee,
  UserRound,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { io } from "socket.io-client";

import { getDashboard, getAnalytics } from "./services/api";
import Bookings from "./pages/Bookings";
import Customers from "./pages/Customers";
import Mechanics from "./pages/Mechanics";
import SettingsPage from "./pages/Settings";

const API_BASE_URL = "http://localhost:5001/api";
const SOCKET_URL = "http://localhost:5001";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLive, setIsLive] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, analyticsResponse] =
        await Promise.all([
          getDashboard(),
          getAnalytics(),
        ]);

      setDashboard(dashboardResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("🔴 Live server connected:", socket.id);
      setIsLive(true);
    });

    socket.on("connected", (data) => {
      console.log("✅", data.message);
    });

    socket.on("dashboard:update", (data) => {
      console.log("📊 Dashboard update received:", data);

      loadDashboard();
    });

    socket.on("booking:created", (booking) => {
      console.log("🚗 New booking received:", booking);

      loadDashboard();
    });

    socket.on("booking:updated", (booking) => {
      console.log("🔄 Booking updated:", booking);

      loadDashboard();
    });

    socket.on("disconnect", () => {
      console.log("⚪ Live server disconnected");
      setIsLive(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setIsLive(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const searchBookings = async () => {
      const query = search.trim();

      if (!query) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      try {
        setSearchLoading(true);
        setShowSearchResults(true);

        const response = await axios.get(
          `${API_BASE_URL}/bookings`,
          {
            params: {
              search: query,
              page: 1,
              limit: 10,
            },
          }
        );

        setSearchResults(response.data?.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timer = setTimeout(searchBookings, 400);

    return () => clearTimeout(timer);
  }, [search]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div>
          <RefreshCw
            className="loading-icon"
            size={40}
          />

          <h2>Loading Dashboard...</h2>

          <p>
            Connecting to MongoDB and Express API
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div>
          <XCircle size={50} />

          <h2>Dashboard Connection Error</h2>

          <p>{error}</p>

          <button
            className="retry-button"
            onClick={loadDashboard}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statusData =
    analytics?.statusBreakdown?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const bookingTrend =
    analytics?.bookingTrend?.map((item) => ({
      date: item._id,
      bookings: item.count,
    })) || [];

  const revenueTrend =
    analytics?.revenueTrend?.map((item) => ({
      date: item._id,
      revenue: item.revenue,
    })) || [];

  const serviceBreakdown =
    analytics?.serviceBreakdown?.map((item) => ({
      category: item._id,
      bookings: item.count,
      revenue: item.revenue,
    })) || [];

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const renderDashboard = () => (
    <>
      <header className="topbar">
        <div>
          <h1>Operations Dashboard</h1>

          <p>
            Monitor vehicle service operations in real time.
          </p>
        </div>

        <div className="topbar-actions">
          <div className="search-wrapper">
            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search bookings..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                onFocus={() => {
                  if (search.trim()) {
                    setShowSearchResults(true);
                  }
                }}
              />
            </div>

            {showSearchResults &&
              search.trim() && (
                <div className="search-results">
                  {searchLoading && (
                    <div className="search-message">
                      Searching bookings...
                    </div>
                  )}

                  {!searchLoading &&
                    searchResults.length === 0 && (
                      <div className="search-message">
                        No bookings found.
                      </div>
                    )}

                  {!searchLoading &&
                    searchResults.map((booking) => (
                      <div
                        className="search-result-item"
                        key={
                          booking._id ||
                          booking.bookingId
                        }
                        onClick={() => {
                          setSearch(
                            booking.bookingId
                          );

                          setShowSearchResults(
                            false
                          );
                        }}
                      >
                        <div className="search-result-icon">
                          <Car size={18} />
                        </div>

                        <div className="search-result-content">
                          <strong>
                            {booking.bookingId}
                          </strong>

                          <span>
                            {booking.customer?.name ||
                              "Unknown Customer"}
                          </span>

                          <small>
                            {booking.vehicle?.brand ||
                              ""}{" "}
                            {booking.vehicle?.model ||
                              ""}
                            {" • "}
                            {booking.status || ""}
                          </small>
                        </div>

                        <strong className="search-result-amount">
                          {formatCurrency(
                            booking.amount
                          )}
                        </strong>
                      </div>
                    ))}
                </div>
              )}
          </div>

          <button
            className="icon-button"
            title="Notifications"
          >
            <Bell size={18} />
          </button>

          <div className="profile">
            <div className="avatar">AY</div>

            <div>
              <strong>Admin</strong>

              <span>
                Operations Manager
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="metrics-grid">
        <div className="metric-card">
          <Activity size={22} />

          <span>Total Bookings</span>

          <strong>
            {dashboard.totalBookings}
          </strong>

          <small>All bookings</small>
        </div>

        <div className="metric-card">
          <CalendarDays size={22} />

          <span>Today's Bookings</span>

          <strong>
            {dashboard.todayBookings}
          </strong>

          <small>Scheduled today</small>
        </div>

        <div className="metric-card">
          <CheckCircle2 size={22} />

          <span>Completed</span>

          <strong>
            {dashboard.completedBookings}
          </strong>

          <small>Completed services</small>
        </div>

        <div className="metric-card">
          <Clock3 size={22} />

          <span>Pending</span>

          <strong>
            {dashboard.pendingBookings}
          </strong>

          <small>Awaiting service</small>
        </div>

        <div className="metric-card">
          <XCircle size={22} />

          <span>Cancelled</span>

          <strong>
            {dashboard.cancelledBookings}
          </strong>

          <small>Cancelled bookings</small>
        </div>

        <div className="metric-card">
          <IndianRupee size={22} />

          <span>Total Revenue</span>

          <strong>
            {formatCurrency(
              dashboard.totalRevenue
            )}
          </strong>

          <small>Completed revenue</small>
        </div>

        <div className="metric-card">
          <Wrench size={22} />

          <span>Active Mechanics</span>

          <strong>
            {dashboard.activeMechanics}
          </strong>

          <small>Currently active</small>
        </div>

        <div className="metric-card">
          <UserRound size={22} />

          <span>Customers</span>

          <strong>
            {dashboard.newCustomers}
          </strong>

          <small>Total customers</small>
        </div>
      </section>

      <section className="analytics-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Bookings Over Time</h2>

            <span>
              Daily booking activity
            </span>
          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={bookingTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Revenue Over Time</h2>

            <span>
              Completed booking revenue
            </span>
          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={revenueTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="revenue"
                fill="#16a34a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Booking Status</h2>

            <span>
              Status distribution
            </span>
          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                label
              >
                {statusData.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#ef4444",
                          "#22c55e",
                          "#3b82f6",
                          "#f59e0b",
                          "#8b5cf6",
                        ][index % 5]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Service Categories</h2>

            <span>
              Bookings by service category
            </span>
          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={serviceBreakdown}
              layout="vertical"
              margin={{
                left: 30,
                right: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="category"
                width={110}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="bookings"
                fill="#7c3aed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="welcome-card">
        <div className="system-status-header">
          <div>
            <h2>
              Live Vehicle Service Operations
            </h2>

            <p>
              Dashboard connected to the Express
              API and MongoDB database.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadDashboard}
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>

        <div className="system-online-box">
          {isLive ? (
            <Wifi size={18} />
          ) : (
            <WifiOff size={18} />
          )}

          <span
            className={`live-dot ${
              isLive ? "" : "offline"
            }`}
          ></span>

          <strong>
            {isLive
              ? "Live connection active"
              : "Live connection offline"}
          </strong>

          <span>
            {isLive
              ? "Socket.IO • MongoDB • Express • React"
              : "Trying to reconnect..."}
          </span>
        </div>
      </section>
    </>
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <Car size={22} />
          </div>

          <div>
            <h2>Instant Mechanic</h2>

            <span>Operations</span>
          </div>
        </div>

        <nav className="navigation">
          <button
            className={`nav-item ${
              currentPage === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("dashboard")
            }
          >
            <LayoutDashboard size={18} />

            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "bookings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("bookings")
            }
          >
            <CalendarDays size={18} />

            <span>Bookings</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "customers"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("customers")
            }
          >
            <Users size={18} />

            <span>Customers</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "mechanics"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("mechanics")
            }
          >
            <Wrench size={18} />

            <span>Mechanics</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("settings")
            }
          >
            <Settings size={18} />

            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div>Live Operations</div>

          <div className="live-status">
            <span
              className={`live-dot ${
                isLive ? "" : "offline"
              }`}
            ></span>

            {isLive
              ? "System Online"
              : "Reconnecting..."}
          </div>
        </div>
      </aside>

      <main className="main-content">
        {currentPage === "dashboard" &&
          renderDashboard()}

        {currentPage === "bookings" && (
          <Bookings />
        )}

        {currentPage === "customers" && (
          <Customers />
        )}

        {currentPage === "mechanics" && (
          <Mechanics />
        )}

        {currentPage === "settings" && (
          <SettingsPage />
        )}
      </main>
    </div>
  );
}

export default App;
