// import { useEffect, useState } from "react";
// import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
// import Swal from "sweetalert2";

// const Books = ({ schoolId }) => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [formFields, setFormFields] = useState([
//     { name: "book_title", label: "Book Title", type: "text", required: true },
//     { name: "book_author", label: "Author", type: "text", required: true },
//     {
//       name: "book_publisher",
//       label: "Publisher",
//       type: "text",
//       required: true,
//     },
//     {
//       name: "class_name",
//       label: "Class",
//       type: "select",
//       required: true,
//       options: Array.from({ length: 12 }, (_, i) => ({
//         value: (i + 1).toString(),
//         label: `Class ${i + 1}`,
//       })),
//     },
//   ]);
//   // Initialize formData with default values for all fields
//   const initialFormData = formFields.reduce((acc, field) => {
//     acc[field.name] = "";
//     return acc;
//   }, {});

//   const [formData, setFormData] = useState(initialFormData);
//   const [formErrors, setFormErrors] = useState({});
//   const [isFormLoading, setIsFormLoading] = useState(false);
//   const [editingBook, setEditingBook] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const validateForm = () => {
//     const errors = {};
//     formFields.forEach((field) => {
//       if (field.required && !formData[field.name]) {
//         errors[field.name] = `${field.label} is required`;
//       }
//     });
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const resetForm = () => {
//     const initialData = {};
//     formFields.forEach((field) => {
//       initialData[field.name] = "";
//     });
//     setFormData(initialData);
//     setFormErrors({});
//     setEditingBook(null);
//   };

//   const handleEditBook = (book) => {
//     setEditingBook(book);
//     const bookData = { ...book };
//     // Convert class_name to string if it's a number
//     if (typeof bookData.class_name === 'number') {
//       bookData.class_name = bookData.class_name.toString();
//     }
//     setFormData(bookData);
//     setShowAddForm(true);
//   };

//   const handleDeleteBook = async (bookId) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You will not be able to recover this book!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#374151',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(`https://digiteach.pythonanywhere.com/books/${bookId}/`, {
//           method: 'DELETE'
//         });

//         if (!response.ok) throw new Error('Failed to delete book');

//         Swal.fire(
//           'Deleted!',
//           'The book has been deleted.',
//           'success'
//         );

//         // Refresh the books list
//         fetchBooks();
//       } catch (error) {
//         console.error('Error deleting book:', error);
//         Swal.fire(
//           'Error',
//           'Failed to delete book. Please try again.',
//           'error'
//         );
//       }
//     }
//   };

//   const handleAddBook = async (e) => {
//     e.preventDefault();
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     setIsFormLoading(true);
//     try {
//       const url = editingBook 
//         ? `https://digiteach.pythonanywhere.com/books/${editingBook.id}/`
//         : "https://digiteach.pythonanywhere.com/books/";

//       const method = editingBook ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `Failed to ${editingBook ? 'update' : 'add'} book`);
//       }

//       const result = await response.json();
//       if (result.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Success!",
//           text: `Book ${editingBook ? 'updated' : 'added'} successfully`,
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         setShowAddForm(false);
//         resetForm();
//         fetchBooks();
//       }
//     } catch (error) {
//       console.error(`Error ${editingBook ? 'updating' : 'adding'} book:`, error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || `Failed to ${editingBook ? 'update' : 'add'} book. Please try again.`,
//       });
//     } finally {
//       setIsFormLoading(false);
//     }
//   };

//   // Fetch books from the API
//   const fetchBooks = async () => {
//     try {
//       const response = await fetch(
//         "https://digiteach.pythonanywhere.com/books/"
//       );
//       if (!response.ok) throw new Error("Failed to fetch books");
//       const result = await response.json();
//       // Check if the response has the expected structure
//       if (result.status === "success" && Array.isArray(result.data)) {
//         setBooks(result.data);
//       } else {
//         setBooks([]);
//       }
//     } catch (error) {
//       console.error("Error fetching books:", error);
//       Swal.fire(
//         "Error",
//         "Failed to load books. Please try again later.",
//         "error"
//       );
//       setBooks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, [schoolId]);

//   // Filter books based on search term
//   const filteredBooks = books.filter(
//     (book) =>
//       (book.book_title?.toLowerCase() || "").includes(
//         searchTerm.toLowerCase()
//       ) ||
//       (book.book_author?.toLowerCase() || "").includes(
//         searchTerm.toLowerCase()
//       ) ||
//       (book.book_publisher?.toLowerCase() || "").includes(
//         searchTerm.toLowerCase()
//       ) ||
//       (book.class_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
//   );


//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//         <h2 className="text-2xl font-bold text-gray-800">School Books List</h2>
//         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

//           <button
//             onClick={() => setShowAddForm(true)}
//             className="flex items-right gap-2 bg-red-500  text-white px-4 py-2 rounded-lg text-sm transition-colors"
//           >
//             <FaPlus /> Add Book
//           </button>
//         </div>
//       </div>

//       {/* Add Book Form Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//             <div className="flex justify-between items-center border-b p-4">
//               <h3 className="text-lg font-semibold">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
//               <button
//                 onClick={() => {
//                   setShowAddForm(false);
//                   resetForm();
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FaTimes />
//               </button>
//             </div>
//             <form onSubmit={handleAddBook} className="p-4 space-y-4">
//               {formFields.map((field) => (
//                 <div key={field.name}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {field.label}{" "}
//                     {field.required && <span className="text-red-500">*</span>}
//                   </label>
//                   {field.type === "select" ? (
//                     <select
//                       name={field.name}
//                       value={formData[field.name] || ""}
//                       onChange={handleInputChange}
//                       className={`w-full px-3 py-2 border rounded-md ${
//                         formErrors[field.name]
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     >
//                       <option value="">Select {field.label}</option>
//                       {field.options?.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     <input
//                       type={field.type || "text"}
//                       name={field.name}
//                       value={formData[field.name] || ""}
//                       onChange={handleInputChange}
//                       className={`w-full px-3 py-2 border rounded-md ${
//                         formErrors[field.name]
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                       placeholder={`Enter ${field.label.toLowerCase()}`}
//                     />
//                   )}
//                   {formErrors[field.name] && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {formErrors[field.name]}
//                     </p>
//                   )}
//                 </div>
//               ))}

//               <div className="flex justify-end space-x-3 pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddForm(false);
//                     resetForm();
//                   }}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md "
//                 >
//                   {editingBook ? 'Update Book' : 'Add Book'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {filteredBooks.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500">No books found.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Id
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Title
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Author
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Publisher
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Class
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredBooks.map((book, index) => (
//                 <tr key={book.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {index + 1}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {book.book_title || "N/A"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {book.book_author || "N/A"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {book.book_publisher || "N/A"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-600">
//                       Class {book.class_name || "N/A"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button 
//                       className="text-yellow-500 mr-4 hover:text-yellow-700"
//                       onClick={() => handleEditBook(book)}
//                     >
//                       <FaEdit />
//                     </button>
//                     <button 
//                       className="text-red-600"
//                       onClick={() => handleDeleteBook(book.id)}
//                     >
//                         <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Books;


import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const Books = ({ schoolId, fetchBooks, books }) => {
  // const [books, setBooks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    book_title: "",
    book_author: "",
    book_publisher: "",
    class_name: "",
  });

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const response = await fetch("https://digiteach.pythonanywhere.com/classes/");
      const result = await response.json();
      if (Array.isArray(result)) {
        setClasses(result);
      } else if (Array.isArray(result.data)) {
        setClasses(result.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchClasses();
  }, [schoolId]);

  // Input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.book_title) errors.book_title = "Book title is required";
    if (!formData.book_author) errors.book_author = "Author is required";
    if (!formData.book_publisher) errors.book_publisher = "Publisher is required";
    if (!formData.class_name) errors.class_name = "Class is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      book_title: "",
      book_author: "",
      book_publisher: "",
      class_name: "",
    });
    setFormErrors({});
    setEditingBook(null);
  };

  // Add or Update book
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsFormLoading(true);
    try {
      const url = editingBook
        ? `https://digiteach.pythonanywhere.com/books/${editingBook.id}/`
        : "https://digiteach.pythonanywhere.com/books/";

      const method = editingBook ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save book");
      await response.json();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Book ${editingBook ? "updated" : "added"} successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });

      setShowAddForm(false);
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      Swal.fire("Error", "Failed to save book. Please try again.", "error");
    } finally {
      setIsFormLoading(false);
    }
  };

  // Edit book
  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      book_title: book.book_title || "",
      book_author: book.book_author || "",
      book_publisher: book.book_publisher || "",
      class_name: book.class_name || "",
    });
    setShowAddForm(true);
  };

  // Delete book
  const handleDeleteBook = async (bookId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this book!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://digiteach.pythonanywhere.com/books/${bookId}/`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete book");

        Swal.fire("Deleted!", "The book has been deleted.", "success");
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        Swal.fire("Error", "Failed to delete book. Please try again.", "error");
      }
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      (book.book_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (book.book_author?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (book.book_publisher?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (book.class_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">School Books List</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <FaPlus /> Add Book
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">
                {editingBook ? "Edit Book" : "Add New Book"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddBook} className="p-4 space-y-4">
              {/* Book Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="book_title"
                  value={formData.book_title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.book_title ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {formErrors.book_title && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.book_title}</p>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="book_author"
                  value={formData.book_author}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.book_author ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {formErrors.book_author && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.book_author}</p>
                )}
              </div>

              {/* Publisher */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="book_publisher"
                  value={formData.book_publisher}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.book_publisher ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {formErrors.book_publisher && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.book_publisher}</p>
                )}
              </div>

              {/* Class Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.class_name ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.class_name}>
                      {cls.class_name}
                    </option>
                  ))}
                </select>
                {formErrors.class_name && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.class_name}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFormLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  {isFormLoading ? "Saving..." : editingBook ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Table */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No books found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publisher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book, index) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{book.book_title || "N/A"}</td>
                  <td className="px-6 py-4">{book.book_author || "N/A"}</td>
                  <td className="px-6 py-4">{book.book_publisher || "N/A"}</td>
                  <td className="px-6 py-4">
                    {`Class ${book.class_name}`}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-yellow-500 mr-4 hover:text-yellow-700"
                      onClick={() => handleEditBook(book)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Books;
