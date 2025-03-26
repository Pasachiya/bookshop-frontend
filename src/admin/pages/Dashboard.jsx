import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Add styles for the calendar
import {
  Users,
  BookOpen,
  ShoppingCart,
  DollarSign,
  Package,
  AlertCircle,
  Heart,
  Layers, // Replace 'Category' with 'Layers' which is available in lucide-react
} from "lucide-react";
import "./Dashboard.css";
import Sidebar from "../components/sidebar";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockBooks: [],
    topSellingBooks: [],
    mostWishedBooks: [],
    mostWishedCategories: [],
    chartData: {},
    orderDates: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await response.json();
      
      // Extract dates from recent orders for the calendar
      const orderDates = data.recentOrders.map(order =>
        new Date(order.createdAt).toLocaleDateString()
      );

      setStats({ ...data, orderDates });
    } catch (err) {
      setError("Unable to load some dashboard data");
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <>
      <Sidebar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="skeleton skeleton-text" style={{width: "200px"}}></div>
          <div className="skeleton skeleton-text short"></div>
        </header>
  
        <div className="dashboard-content">
          <div className="stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card skeleton skeleton-stat"></div>
            ))}
          </div>
  
          <div className="chart-calendar-container">
            <div className="dashboard-chart">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-chart"></div>
            </div>
            <div className="dashboard-calendar">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton" style={{height: "300px"}}></div>
            </div>
          </div>
  
          <div className="dashboard-grid">
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="dashboard-card skeleton-card">
                <div className="skeleton skeleton-text"></div>
                {[1, 2, 3, 4].map((row) => (
                  <div key={row} className="skeleton-table-row">
                    <div className="skeleton skeleton-table-cell"></div>
                    <div className="skeleton skeleton-table-cell"></div>
                    <div className="skeleton skeleton-table-cell"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Sidebar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p>Welcome to your admin dashboard</p>
          {error && (
            <div className="error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </header>

        <div className="dashboard-content">
          {/* Chart and Calendar Container */}
          <div className="chart-calendar-container">
            <div className="dashboard-chart">
              <h2>Orders Over Time</h2>
              {stats.chartData.labels ? (
                <Line data={stats.chartData} />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>

            {/* Calendar */}
            <div className="dashboard-calendar">
              <h2>Order Dates</h2>
              <ReactCalendar
                value={new Date()} // Current date selected by default
                tileClassName={({ date }) => {
                  // Highlight the dates with orders
                  if (stats.orderDates.includes(date.toLocaleDateString())) {
                    return 'highlight-order-date';
                  }
                  return null;
                }}
              />
            </div>
          </div>

          <div className="stats-grid">
            {[{
                icon: <Users size={24} />,
                label: "Total Users",
                value: stats.totalUsers,
              },
              {
                icon: <BookOpen size={24} />,
                label: "Total Stock",
                value: stats.totalBooks,
              },
              {
                icon: <ShoppingCart size={24} />,
                label: "Total Orders",
                value: stats.totalOrders,
              },
              {
                icon: <DollarSign size={24} />,
                label: "Total Revenue",
                value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
              }].map((item, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{item.icon}</div>
                <div className="stat-details">
                  <h3>{item.label}</h3>
                  <p>{item.value !== undefined ? item.value : "N/A"}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card recent-orders">
              <div className="card-header-recent-orders">
                <h2><Package size={20} /> Recent Orders</h2>
              </div>
              <div className="card-content">
                {stats.recentOrders.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>{order.shippingDetails.firstName} {order.shippingDetails.lastName}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>Rs. {order.totalAmount}</td>
                          <td>
                            <span className={`status-badge status-${order.status}`}>{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">No recent orders</p>
                )}
              </div>
            </div>

            <div className="dashboard-card low-stock">
              <div className="card-header-low-stock">
                <h2><AlertCircle size={20} /> Low Stock Alert</h2>
              </div>
              <div className="card-content">
                {stats.lowStockBooks.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.lowStockBooks.map((book) => (
                        <tr key={book._id}>
                          <td>{book.title}</td>
                          <td>{book.count}</td>
                          <td>
                            <span className="status-badge status-warning">Low Stock</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">No low-stock items</p>
                )}
              </div>
            </div>
            
            <div className="dashboard-card top-selling">
              <div className="card-header-top-seller">
                <h2><BookOpen size={20} /> Top Selling Books</h2>
              </div>
              <div className="card-content">
                {stats.topSellingBooks.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Total Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topSellingBooks.map((book) => (
                        <tr key={book.bookId}>
                          <td>{book.title}</td>
                          <td>{book.totalSold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">No top-selling books</p>
                )}
              </div>
            </div>
            
            
            <div className="dashboard-card most-wished-books">
              <div className="card-header-wishlist">
                <h2><Heart size={20} /> Most Wished Books</h2>
              </div>
              <div className="card-content">
                {stats.mostWishedBooks && stats.mostWishedBooks.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Author</th>
                        <th>Wishlist Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.mostWishedBooks.map((book) => (
                        <tr key={book.bookId}>
                          <td>
                            {book.coverImage && (
                              <img 
                                src={book.coverImage} 
                                alt={book.title} 
                                className="book-thumbnail"
                              />
                            )}
                            {book.title}
                          </td>
                          <td>{book.author}</td>
                          <td>{book.wishCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">No wishlist data available</p>
                )}
              </div>
            </div>
            
            {/* Most Wished Categories Card */}
            <div className="dashboard-card most-wished-categories">
              <div className="card-header-categories">
                <h2><Layers size={20} /> Popular Categories</h2> {/* Changed Category to Layers icon */}
              </div>
              <div className="card-content">
                {stats.mostWishedCategories && stats.mostWishedCategories.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Wishlist Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.mostWishedCategories.map((category, index) => (
                        <tr key={index}>
                          <td>{category.category}</td>
                          <td>{category.wishCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">No category data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;