// /* eslint-disable no-unused-vars */
// import { useState, useEffect } from "react";
// import { Eye } from "lucide-react";
// import "./Orders.css";
// import Sidebar from "../components/sidebar";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");

//   const statusFilters = [
//     { id: "all", label: "All Orders" },
//     { id: "pending", label: "Pending" },
//     { id: "processing", label: "Processing" },
//     { id: "shipped", label: "Shipped" },
//     { id: "completed", label: "Completed" },
//     { id: "cancelled", label: "Cancelled" },
//   ];

//   const generateBill = (order) => {
//     const printWindow = window.open("", "_blank");

//     // Format date in "Month Day, Year" format
//     const formatDate = (dateString) => {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       });
//     };

//     // Calculate subtotal
//     const calculateSubtotal = (items) => {
//       return items.reduce(
//         (total, item) => total + item.quantity * item.price,
//         0
//       );
//     };

//     const subtotal = calculateSubtotal(order.items);

//     printWindow.document.write(`
//       <html>
//   <head>
//     <title>Invoice #${order._id}</title>
//     <style>
//       :root {
//         --primary-color: #3a86ff;
//         --text-color: #333;
//         --border-color: #eaeaea;
//         --background-color: #ffffff;
//         --secondary-bg: #f7f9fc;
//       }
      
//       body { 
//         font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
//         margin: 0;
//         padding: 40px 20px;
//         background-color: #f0f4f8;
//         color: var(--text-color);
//       }
      
//       .invoice-container {
//         max-width: 800px;
//         margin: 0 auto;
//         border-radius: 12px;
//         box-shadow: 0 5px 15px rgba(0,0,0,0.08);
//         background-color: var(--background-color);
//         overflow: hidden;
//       }
      
//       .header {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         padding: 20px 30px;
//         background-color: var(--secondary-bg);
//       }
      
//       .branding {
//         font-size: 24px;
//         font-weight: bold;
//         color: var(--primary-color);
//       }
      
//       .hotline {
//         font-size: 14px;
//       }
      
//       .invoice-header {
//         background-color: var(--primary-color);
//         color: white;
//         padding: 20px 30px;
//         display: flex;
//         justify-content: space-between;
//       }
      
//       .invoice-header-left {
//         font-size: 15px;
//       }
      
//       .invoice-header-right {
//         text-align: right;
//         font-size: 15px;
//       }
      
//       .invoice-id {
//         font-size: 20px;
//         font-weight: bold;
//         margin-bottom: 5px;
//       }
      
//       .address-section {
//         display: flex;
//         padding: 30px;
//         background-color: var(--background-color);
//       }
      
//       .address-column {
//         flex: 1;
//         padding-right: 30px;
//       }
      
//       .address-header {
//         font-weight: bold;
//         color: var(--primary-color);
//         margin-bottom: 15px;
//         font-size: 16px;
//         text-transform: uppercase;
//         letter-spacing: 1px;
//       }
      
//       .address-content {
//         line-height: 1.6;
//       }
      
//       .info-section {
//         display: flex;
//         padding: 20px 30px;
//         background-color: var(--secondary-bg);
//         border-top: 1px solid var(--border-color);
//         border-bottom: 1px solid var(--border-color);
//       }
      
//       .info-column {
//         flex: 1;
//       }
      
//       .info-header {
//         font-weight: 600;
//         margin-bottom: 8px;
//         color: var(--primary-color);
//       }
      
//       .products-table {
//         width: 100%;
//         border-collapse: collapse;
//       }
      
//       .products-table th {
//         background-color: var(--secondary-bg);
//         padding: 15px;
//         text-align: left;
//         font-weight: 600;
//         color: var(--primary-color);
//         border-bottom: 2px solid var(--border-color);
//       }
      
//       .products-table td {
//         padding: 15px;
//         border-bottom: 1px solid var(--border-color);
//       }
      
//       .products-table tr:last-child td {
//         border-bottom: none;
//       }
      
//       .vendor-info {
//         padding: 20px 30px;
//         background-color: var(--secondary-bg);
//         border-top: 1px solid var(--border-color);
//       }
      
//       .vendor-name {
//         font-weight: 600;
//         color: var(--primary-color);
//         margin-bottom: 5px;
//       }
      
//       .totals {
//         text-align: right;
//         padding: 20px 30px;
//         background-color: var(--background-color);
//         border-top: 1px solid var(--border-color);
//       }
      
//       .total-row {
//         display: flex;
//         justify-content: flex-end;
//         margin-bottom: 8px;
//       }
      
//       .total-label {
//         width: 150px;
//         text-align: left;
//         font-weight: 600;
//       }
      
//       .grand-total {
//         font-size: 18px;
//         font-weight: bold;
//         color: var(--primary-color);
//         margin-top: 10px;
//         padding-top: 10px;
//         border-top: 2px solid var(--border-color);
//       }
      
//       .footer {
//         padding: 20px 30px;
//         text-align: center;
//         background-color: var(--secondary-bg);
//         color: #666;
//         font-size: 14px;
//         border-top: 1px solid var(--border-color);
//       }
//     </style>
//   </head>
//   <body>
//     <div class="invoice-container">
//       <div class="header">
//         <div class="branding">Wishwaye Navathana</div>
//         <div class="hotline">Hotline: +077 018 8778</div>
//       </div>
      
//       <div class="invoice-header">
//         <div class="invoice-header-left">
//           <div class="invoice-id">Invoice #${order._id || "00000000"}</div>
//           <div>Order #${order.orderNumber || "00000000"}</div>
//         </div>
//         <div class="invoice-header-right">
//           <div>Order Date: ${formatDate(order.createdAt)}</div>
//         </div>
//       </div>
      
//       <div class="address-section">
//         <div class="address-column">
//           <div class="address-header">Sold to</div>
//           <div class="address-content">
//             <div>${order.shippingDetails?.firstName || ""} ${
//       order.shippingDetails?.lastName || ""
//     }</div>
//             <div>${order.shippingDetails?.address || ""}</div>
//             <div>${order.shippingDetails?.city || ""}</div>
//             <div>${order.shippingDetails?.country || ""}</div>
//             <div>Phone: ${order.shippingDetails?.phone || ""}</div>
//           </div>
//         </div>
//         <div class="address-column">
//           <div class="address-header">Ship to</div>
//           <div class="address-content">
//             <div>${order.shippingDetails?.firstName || ""} ${
//       order.shippingDetails?.lastName || ""
//     }</div>
//             <div>${order.shippingDetails?.address || ""}</div>
//             <div>${order.shippingDetails?.city || ""}</div>
//             <div>${order.shippingDetails?.country || ""}</div>
//             <div>Phone: ${order.shippingDetails?.phone || ""}</div>
//           </div>
//         </div>
//       </div>
      
//       <div class="info-section">
//         <div class="info-column">
//           <div class="info-header">Payment Method</div>
//           <div>${order.paymentMethod || "Koko: Buy Now Pay Later"}</div>
//         </div>
//         <div class="info-column">
//           <div class="info-header">Shipping Method</div>
//           <div>${order.shippingMethod || ""}</div>
//         </div>
//       </div>
      
//       <table class="products-table">
//         <thead>
//           <tr>
//             <th>Products</th>
//             <th>SKU</th>
//             <th>Price</th>
//             <th>Qty</th>
//             <th>Tax</th>
//             <th>Subtotal</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${order.items
//             .map(
//               (item) => `
//             <tr>
//               <td>${item.bookId ? item.bookId.title : item.title || "N/A"}</td>
//               <td>${item.sku || ""}</td>
//               <td>Rs ${item.price?.toFixed(2) || "0.00"}</td>
//               <td>${item.quantity}</td>
//               <td>Rs 0.00</td>
//               <td>Rs ${(item.quantity * item.price)?.toFixed(2) || "0.00"}</td>
//             </tr>
//           `
//             )
//             .join("")}
//         </tbody>
//       </table>
      
//       <div class="vendor-info">
//         <div class="vendor-name">Vendor</div>
//         <div>Wishwaye Nawathana</div>
//       </div>
      
//       <div class="totals">
//         <div class="total-row">
//           <div class="total-label">Subtotal:</div>
//           <div>Rs ${order.totalAmount?.toFixed(2)}</div>
//         </div>
//         <div class="total-row grand-total">
//           <div class="total-label">Grand Total:</div>
//           <div>Rs ${order.totalAmount?.toFixed(2) || subtotal.toFixed(2)}</div>
//         </div>
//       </div>
//     </div>
//   </body>
// </html>
//     `);

//     printWindow.document.close();
//     printWindow.print();
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [selectedStatus]);

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/orders?status=${selectedStatus}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch orders");
//       const data = await response.json();
//       setOrders(data);
//       setIsLoading(false);
//     } catch (err) {
//       setError("Failed to fetch orders");
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm("Are you sure you want to delete this order?")) return;

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/orders/${orderId}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) throw new Error("Failed to delete order");

//       alert("Order deleted successfully!");
//       setOrders((prevOrders) =>
//         prevOrders.filter((order) => order._id !== orderId)
//       );
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       alert("Error deleting order. Please try again.");
//     }
//   };

//   const handleUpdateStatus = async (orderId, newStatus) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/orders/${orderId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to update order status");

//       const updatedOrder = await response.json();

//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId
//             ? { ...order, status: updatedOrder.updatedOrder.status }
//             : order
//         )
//       );

//       alert("Order status updated successfully!");
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       alert("Error updating order status. Please try again.");
//     }
//   };

//   const getStatusClass = (status) => {
//     const statusClasses = {
//       pending: "status-pending",
//       processing: "status-processing",
//       shipped: "status-shipped",
//       completed: "status-completed",
//       cancelled: "status-cancelled",
//     };
//     return `status-badge ${statusClasses[status] || ""}`;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const filteredOrders = orders.filter((order) => {
//     const matchesStatus =
//       selectedStatus === "all" || order.status === selectedStatus;

//     const matchesSearch =
//       order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.userId?.firstName
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       order.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

//     return matchesStatus && matchesSearch;
//   });

//   if (isLoading) return <div className="loading">Loading...</div>;

//   return (
//     <>
//     <div className="admin-layout">
//       <Sidebar />
//       <div className="orders-container">
//         <div className="header">
//           <div className="header-top">
//             <h2>Orders Management</h2>
//             <div className="search-bar">
//               <input
//                 type="text"
//                 placeholder="Search by order number or customer name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="filter-section">
//             {statusFilters.map((filter) => (
//               <button
//                 key={filter.id}
//                 className={`filter-button ${
//                   selectedStatus === filter.id ? "active" : ""
//                 }`}
//                 onClick={() => setSelectedStatus(filter.id)}
//               >
//                 {filter.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="table-container">
//           <table className="books-table">
//             <thead>
//               <tr>
//                 <th>Customer Name</th>
//                 <th>Date</th>
//                 <th>Book Title</th>
//                 <th>Total Amount</th>
//                 <th>Order Status</th>
//                 <th>Phone Number</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <tr key={order._id}>
//                   <td>
//                     {order.shippingDetails?.firstName
//                       ? `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`
//                       : "N/A"}
//                   </td>
//                   <td>{formatDate(order.createdAt)}</td>
//                   <td>
//                     {order.items.length > 0
//                       ? order.items.map((item, index) => (
//                           <div key={index}>
//                             {item.bookId
//                               ? item.bookId.title
//                               : item.title || "N/A"}
//                           </div>
//                         ))
//                       : "N/A"}
//                   </td>
//                   <td>
//                     Rs.{" "}
//                     {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
//                   </td>
//                   <td>
//                     <select
//                       className={getStatusClass(order.status)}
//                       value={order.status}
//                       onChange={(e) =>
//                         handleUpdateStatus(order._id, e.target.value)
//                       }
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="processing">Processing</option>
//                       <option value="shipped">Shipped</option>
//                       <option value="completed">Completed</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                   <td>
//                     {order.shippingDetails?.phone
//                       ? order.shippingDetails.phone
//                       : "N/A"}
//                   </td>
//                   <td>
//                     <div className="action-buttons">
//                       <button
//                         className="action-button delete-button"
//                         onClick={() => handleDeleteOrder(order._id)}
//                       >
//                         🗑 Delete
//                       </button>
//                       <button
//                         className="action-button print-button"
//                         onClick={() => generateBill(order)}
//                       >
//                         🖨️ Print
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default Orders;


import { useState, useEffect } from "react";
import "./Orders.css";
import Sidebar from "../components/sidebar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const statusFilters = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const generateBill = (order) => {
    const printWindow = window.open("", "_blank");

    // Format date in "Month Day, Year" format
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    // Calculate subtotal
    const calculateSubtotal = (items) => {
      return items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
    };

    const subtotal = calculateSubtotal(order.items);

    printWindow.document.write(`
      <html>
  <head>
    <title>Invoice #${order._id}</title>
    <style>
      :root {
        --primary-color: #3a86ff;
        --text-color: #333;
        --border-color: #eaeaea;
        --background-color: #ffffff;
        --secondary-bg: #f7f9fc;
      }
      
      body { 
        font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        margin: 0;
        padding: 40px 20px;
        background-color: #f0f4f8;
        color: var(--text-color);
      }
      
      .invoice-container {
        max-width: 800px;
        margin: 0 auto;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        background-color: var(--background-color);
        overflow: hidden;
      }
      
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        background-color: var(--secondary-bg);
      }
      
      .branding {
        font-size: 24px;
        font-weight: bold;
        color: var(--primary-color);
      }
      
      .hotline {
        font-size: 14px;
      }
      
      .invoice-header {
        background-color: var(--primary-color);
        color: white;
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;
      }
      
      .invoice-header-left {
        font-size: 15px;
      }
      
      .invoice-header-right {
        text-align: right;
        font-size: 15px;
      }
      
      .invoice-id {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .address-section {
        display: flex;
        padding: 30px;
        background-color: var(--background-color);
      }
      
      .address-column {
        flex: 1;
        padding-right: 30px;
      }
      
      .address-header {
        font-weight: bold;
        color: var(--primary-color);
        margin-bottom: 15px;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .address-content {
        line-height: 1.6;
      }
      
      .info-section {
        display: flex;
        padding: 20px 30px;
        background-color: var(--secondary-bg);
        border-top: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
      }
      
      .info-column {
        flex: 1;
      }
      
      .info-header {
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--primary-color);
      }
      
      .products-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .products-table th {
        background-color: var(--secondary-bg);
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: var(--primary-color);
        border-bottom: 2px solid var(--border-color);
      }
      
      .products-table td {
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .products-table tr:last-child td {
        border-bottom: none;
      }
      
      .vendor-info {
        padding: 20px 30px;
        background-color: var(--secondary-bg);
        border-top: 1px solid var(--border-color);
      }
      
      .vendor-name {
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: 5px;
      }
      
      .totals {
        text-align: right;
        padding: 20px 30px;
        background-color: var(--background-color);
        border-top: 1px solid var(--border-color);
      }
      
      .total-row {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
      }
      
      .total-label {
        width: 150px;
        text-align: left;
        font-weight: 600;
      }
      
      .grand-total {
        font-size: 18px;
        font-weight: bold;
        color: var(--primary-color);
        margin-top: 10px;
        padding-top: 10px;
        border-top: 2px solid var(--border-color);
      }
      
      .footer {
        padding: 20px 30px;
        text-align: center;
        background-color: var(--secondary-bg);
        color: #666;
        font-size: 14px;
        border-top: 1px solid var(--border-color);
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="header">
        <div class="branding">Wishwaye Navathana</div>
        <div class="hotline">Hotline: +077 018 8778</div>
      </div>
      
      <div class="invoice-header">
        <div class="invoice-header-left">
          <div class="invoice-id">Invoice #${order._id || "00000000"}</div>
          <div>Order #${order.orderNumber || "00000000"}</div>
        </div>
        <div class="invoice-header-right">
          <div>Order Date: ${formatDate(order.createdAt)}</div>
        </div>
      </div>
      
      <div class="address-section">
        <div class="address-column">
          <div class="address-header">Sold to</div>
          <div class="address-content">
            <div>${order.shippingDetails?.firstName || ""} ${
      order.shippingDetails?.lastName || ""
    }</div>
            <div>${order.shippingDetails?.address || ""}</div>
            <div>${order.shippingDetails?.city || ""}</div>
            <div>${order.shippingDetails?.country || ""}</div>
            <div>Phone: ${order.shippingDetails?.phone || ""}</div>
          </div>
        </div>
        <div class="address-column">
          <div class="address-header">Ship to</div>
          <div class="address-content">
            <div>${order.shippingDetails?.firstName || ""} ${
      order.shippingDetails?.lastName || ""
    }</div>
            <div>${order.shippingDetails?.address || ""}</div>
            <div>${order.shippingDetails?.city || ""}</div>
            <div>${order.shippingDetails?.country || ""}</div>
            <div>Phone: ${order.shippingDetails?.phone || ""}</div>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <div class="info-column">
          <div class="info-header">Payment Method</div>
          <div>${order.paymentMethod || "Koko: Buy Now Pay Later"}</div>
        </div>
        <div class="info-column">
          <div class="info-header">Shipping Method</div>
          <div>${order.shippingMethod || ""}</div>
        </div>
      </div>
      
      <table class="products-table">
        <thead>
          <tr>
            <th>Products</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Tax</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>${item.bookId ? item.bookId.title : item.title || "N/A"}</td>
              <td>${item.sku || ""}</td>
              <td>Rs ${item.price?.toFixed(2) || "0.00"}</td>
              <td>${item.quantity}</td>
              <td>Rs 0.00</td>
              <td>Rs ${(item.quantity * item.price)?.toFixed(2) || "0.00"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="vendor-info">
        <div class="vendor-name">Vendor</div>
        <div>Wishwaye Nawathana</div>
      </div>
      
      <div class="totals">
        <div class="total-row">
          <div class="total-label">Subtotal:</div>
          <div>Rs ${order.totalAmount?.toFixed(2)}</div>
        </div>
        <div class="total-row grand-total">
          <div class="total-label">Grand Total:</div>
          <div>Rs ${order.totalAmount?.toFixed(2) || subtotal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  </body>
</html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders?status=${selectedStatus}`
      );
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
      setIsLoading(false);
    } catch {
      setError("Failed to fetch orders");
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete order");

      alert("Order deleted successfully!");
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order. Please try again.");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update order status");

      const updatedOrder = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: updatedOrder.updatedOrder.status }
            : order
        )
      );

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: "status-pending",
      processing: "status-processing",
      shipped: "status-shipped",
      completed: "status-completed",
      cancelled: "status-cancelled",
    };
    return `status-badge ${statusClasses[status] || ""}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <>
    <div className="admin-layout">
      <Sidebar />
      <div className="orders-container">
        <div className="header">
          <div className="header-top">
            <h2>Orders Management</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by order number or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-section">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-button ${
                  selectedStatus === filter.id ? "active" : ""
                }`}
                onClick={() => setSelectedStatus(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-container">
          {isLoading ? (
            <div className="skeleton-loader">
              <div className="skeleton-header"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found matching your criteria.</p>
            </div>
          ) : (
            <table className="books-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Book Title</th>
                  <th>Total Amount</th>
                  <th>Order Status</th>
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      {order.shippingDetails?.firstName
                        ? `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`
                        : "N/A"}
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      {order.items.length > 0
                        ? order.items.map((item, index) => (
                            <div key={index}>
                              {item.bookId
                                ? item.bookId.title
                                : item.title || "N/A"}
                            </div>
                          ))
                        : "N/A"}
                    </td>
                    <td>
                      Rs.{" "}
                      {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                    </td>
                    <td>
                      <select
                        className={getStatusClass(order.status)}
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      {order.shippingDetails?.phone
                        ? order.shippingDetails.phone
                        : "N/A"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDeleteOrder(order._id)}
                        >
                          🗑 Delete
                        </button>
                        <button
                          className="action-button print-button"
                          onClick={() => generateBill(order)}
                        >
                          🖨️ Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Orders;