import { useEffect, useState } from "react";
import {
  getDashboard,
  getBookings,
  getMechanics,
  getAnalytics,
} from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          dashboardResponse,
          bookingsResponse,
          mechanicsResponse,
          analyticsResponse,
        ] = await Promise.all([
          getDashboard(),
          getBookings({ page: 1, limit: 10 }),
          getMechanics(),
          getAnalytics(),
        ]);

        setDashboard(dashboardResponse.data.data);
        setBookings(bookingsResponse.data.data);
        setMechanics(mechanicsResponse.data.data);
        setAnalytics(analyticsResponse.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Instant Mechanic Dashboard</h1>

      <h2>Overview</h2>

      <pre>{JSON.stringify(dashboard, null, 2)}</pre>

      <h2>Bookings</h2>

      <pre>{JSON.stringify(bookings, null, 2)}</pre>

      <h2>Mechanics</h2>

      <pre>{JSON.stringify(mechanics, null, 2)}</pre>

      <h2>Analytics</h2>

      <pre>{JSON.stringify(analytics, null, 2)}</pre>
    </div>
  );
}

export default Dashboard;