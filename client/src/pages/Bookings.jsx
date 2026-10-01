import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Edit3,
  X,
  Save,
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5001/api";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    limit: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingBooking, setEditingBooking] =
    useState(null);

  const [newStatus, setNewStatus] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/bookings`,
        {
          params: {
            page,
            limit: 10,
            search,
            status,
          },
        }
      );

      setBookings(response.data.data || []);

      setPagination(
        response.data.pagination || {
          total: 0,
          pages: 1,
          limit: 10,
        }
      );
    } catch (err) {
      console.error("Bookings error:", err);
      setError("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search, status]);

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClass = (value) => {
    return (
      value
        ?.toLowerCase()
        .replace(/\s+/g, "-") ||
      "unknown"
    );
  };

  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setNewStatus(booking.status);
  };

  const closeEditModal = () => {
    setEditingBooking(null);
    setNewStatus("");
  };

  const updateBookingStatus = async () => {
    if (!editingBooking || !newStatus) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      await axios.patch(
        `${API_URL}/bookings/${editingBooking.bookingId}`,
        {
          status: newStatus,
        }
      );

      closeEditModal();

      await fetchBookings();
    } catch (err) {
      console.error(
        "Update booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update booking."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div>
          <h1>Bookings Management</h1>

          <p>
            Manage and monitor all vehicle service
            bookings.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchBookings}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="bookings-card">
        <div className="booking-filters">
          <div className="booking-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search booking ID..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">
              All Statuses
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}

        <div className="table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Mechanic</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="table-message"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="table-message"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <strong>
                        {booking.bookingId}
                      </strong>
                    </td>

                    <td>
                      <div className="customer-cell">
                        <strong>
                          {booking.customer?.name ||
                            "-"}
                        </strong>

                        <span>
                          {booking.customer?.email ||
                            "-"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="vehicle-cell">
                        <strong>
                          {booking.vehicle?.brand ||
                            ""}{" "}
                          {booking.vehicle?.model ||
                            ""}
                        </strong>

                        <span>
                          {booking.vehicle
                            ?.registrationNumber ||
                            "-"}
                        </span>
                      </div>
                    </td>

                    <td>
                      {booking.service?.name ||
                        booking.service?.category ||
                        "-"}
                    </td>

                    <td>
                      {booking.mechanic?.name ||
                        "Unassigned"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {formatCurrency(
                          booking.amount
                        )}
                      </strong>
                    </td>

                    <td>
                      {formatDate(
                        booking.bookingDate
                      )}
                    </td>

                    <td>
                      <button
                        className="edit-booking-button"
                        onClick={() =>
                          openEditModal(
                            booking
                          )
                        }
                        title="Update booking status"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {bookings.length} of{" "}
            {pagination.totalBookings || 0}{" "}
            bookings
          </span>

          <div className="pagination-controls">
            <button
              disabled={page <= 1}
              onClick={() =>
                setPage(page - 1)
              }
            >
              <ChevronLeft size={17} />
            </button>

            <span>
              Page {page} of{" "}
              {pagination.totalPages || 1}
            </span>

            <button
              disabled={
                page >=
                (pagination.totalPages || 1)
              }
              onClick={() =>
                setPage(page + 1)
              }
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {editingBooking && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <div className="modal-header">
              <div>
                <h2>Update Booking</h2>

                <p>
                  {editingBooking.bookingId}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeEditModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="booking-detail">
                <span>Customer</span>

                <strong>
                  {editingBooking.customer?.name ||
                    "-"}
                </strong>
              </div>

              <div className="booking-detail">
                <span>Vehicle</span>

                <strong>
                  {editingBooking.vehicle?.brand ||
                    ""}{" "}
                  {editingBooking.vehicle?.model ||
                    ""}
                </strong>
              </div>

              <label className="status-label">
                Booking Status
              </label>

              <select
                className="status-select"
                value={newStatus}
                onChange={(event) =>
                  setNewStatus(
                    event.target.value
                  )
                }
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={closeEditModal}
                  disabled={updating}
                >
                  Cancel
                </button>

                <button
                  className="save-button"
                  onClick={
                    updateBookingStatus
                  }
                  disabled={updating}
                >
                  <Save size={16} />

                  {updating
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;