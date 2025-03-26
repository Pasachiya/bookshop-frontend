// import PropTypes from "prop-types";
// import "./BookList.css";
// import { Plus } from "lucide-react";

// const BookList = ({ books, onAdd }) => {
//   return (
//     <div className="table-container">
//       {books.length === 0 ? (
//         <p className="no-books">No books available</p>
//       ) : (
//         <table className="book-table">
//           <thead>
//             <tr>
//               <th>Book Image</th>
//               <th>Book Name</th>
//               <th>Category</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {books.map((book) => (
//               <tr key={book._id}>
//                 <td>
//                   <img src={book.coverImage} alt={book.title} className="book-thumbnail" />
//                 </td>
//                 <td>{book.title}</td>
//                 <td>{book.category}</td>
//                 <td>
//                   <button onClick={() => onAdd(book)} className="add-button">
//                     <Plus size={16} />
//                     Add to New Arrivals
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// BookList.propTypes = {
//   books: PropTypes.array.isRequired,
//   onAdd: PropTypes.func.isRequired,
// };

// export default BookList;
