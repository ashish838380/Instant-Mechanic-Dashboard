import { useEffect, useState } from "react";
import {
  Wrench,
  RefreshCw,
  Search,
  Phone,
  Mail,
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5001/api";

function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMechanics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/mechanics`);

      setMechanics(response.data?.data || []);
    } catch (err) {
      console.error("Mechanics error:", err);
      setError("Unable to load mechanics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  const filteredMechanics = mechanics.filter((mechanic) => {
    const searchText = search.toLowerCase();

    return (
      mechanic.name?.toLowerCase().includes(searchText) ||
      mechanic.email?.toLowerCase().includes(searchText) ||
      mechanic.phone?.includes(searchText) ||
      mechanic.specialization
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  const getStatusClass = (status) => {
    if (!status) {
      return "unknown";
    }

    return status.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Mechanics</h1>
          <p>
            Monitor mechanics and their service operations.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchMechanics}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="management-card">
        <div className="management-toolbar">
          <div className="management-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search mechanics..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="record-count">
            {filteredMechanics.length} mechanics
          </div>
        </div>

        {error && (
          <div className="management-error">
            {error}
          </div>
        )}

        <div className="table-container">
          <table className="management-table">
            <thead>
              <tr>
                <th>Mechanic</th>
                <th>Contact</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Jobs Completed</th>
                <th>Current Booking</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="table-message"
                  >
                    Loading mechanics...
                  </td>
                </tr>
              ) : filteredMechanics.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="table-message"
                  >
                    No mechanics found.
                  </td>
                </tr>
              ) : (
                filteredMechanics.map((mechanic) => (
                  <tr key={mechanic._id}>
                    <td>
                      <div className="person-cell">
                        <div className="person-avatar mechanic-avatar">
                          <Wrench size={17} />
                        </div>

                        <div>
                          <strong>
                            {mechanic.name || "-"}
                          </strong>

                          <span>
                            ID: {mechanic._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <div className="contact-cell">
                          <Mail size={14} />
                          {mechanic.email || "-"}
                        </div>

                        <div
                          className="contact-cell"
                          style={{ marginTop: "6px" }}
                        >
                          <Phone size={14} />
                          {mechanic.phone || "-"}
                        </div>
                      </div>
                    </td>

                    <td>
                      {mechanic.specialization || "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          mechanic.status
                        )}`}
                      >
                        {mechanic.status || "Unknown"}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {mechanic.jobsCompleted ?? 0}
                      </strong>
                    </td>

                    <td>
                      {mechanic.currentBooking ? (
                        <div className="booking-info-cell">
                          <strong>
                            {
                              mechanic.currentBooking
                                .bookingId
                            }
                          </strong>

                          <span>
                            {
                              mechanic.currentBooking
                                .status
                            }
                          </span>
                        </div>
                      ) : (
                        <span className="muted-text">
                          No active booking
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Mechanics;