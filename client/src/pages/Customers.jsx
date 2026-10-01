import { useEffect, useState } from "react";
import { Search, RefreshCw, Mail, Phone, UserRound } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5001/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/customers`);

      setCustomers(response.data?.data || []);
    } catch (err) {
      console.error("Customers error:", err);
      setError("Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const text = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(text) ||
      customer.email?.toLowerCase().includes(text) ||
      customer.phone?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="management-page">

      <div className="management-header">
        <div>
          <h1>Customers</h1>
          <p>Manage all vehicle service customers.</p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchCustomers}
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
              placeholder="Search customers..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="record-count">
            {filteredCustomers.length} customers
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
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Bookings</th>
                <th>Total Spent</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="6" className="table-message">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-message">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id}>

                    <td>
                      <div className="person-cell">
                        <div className="person-avatar">
                          <UserRound size={17} />
                        </div>

                        <strong>
                          {customer.name || "-"}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <div className="contact-cell">
                        <Mail size={14} />
                        {customer.email || "-"}
                      </div>
                    </td>

                    <td>
                      <div className="contact-cell">
                        <Phone size={14} />
                        {customer.phone || "-"}
                      </div>
                    </td>

                    <td>
                      {customer.totalBookings ?? 0}
                    </td>

                    <td>
                      ₹
                      {Number(
                        customer.totalSpent || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {customer.createdAt
                        ? new Date(
                            customer.createdAt
                          ).toLocaleDateString("en-IN")
                        : "-"}
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

export default Customers;