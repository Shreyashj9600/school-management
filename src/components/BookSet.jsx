import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { academic_years } from "../utils/sweetAlertConfig";
import { useNavigate } from "react-router";

// console.log('academic_years test', academic_years)

const BookSet = ({ schoolId, bookSet, fetchBookSet }) => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [editingBookSet, setEditingBookSet] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [classes, setClasses] = useState([]);
    const [showBookDetails, setShowBookDetails] = useState(false);
    const [selectedBookSet, setSelectedBookSet] = useState(null);

    const navigate = useNavigate()


    // console.log('test class list', classes)
    console.log('books data ', books)

    const [formData, setFormData] = useState({
        school_id: parseInt(schoolId) || "",
        book_set_name: "",
        academic_year: "",
        class_detail_id: "",
        bookId: '',
        books: [],
        // book_author: "",
        // book_publisher: "",
        // class_detail: "",
    });


    const [classId, setClassId] = useState('')
    const [academicYear, setAcademicYear] = useState(``)
    const [bookList, setBookList] = useState([])
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

    // Fetch all books
    const fetchBooks = async () => {
        try {
            const response = await fetch("https://digiteach.pythonanywhere.com/books/");
            if (!response.ok) throw new Error("Failed to fetch books");
            const result = await response.json();
            if (result.status === "success" && Array.isArray(result.data)) {
                // setBooks(result.data);
                setBookList(result.data)
            } else if (Array.isArray(result)) {
                // setBooks(result);
                setBookList(result)
            } else {
                setBooks([]);
                setBookList([])
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            Swal.fire("Error", "Failed to load books. Please try again later.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId || formData.class_detail_id) {
            const fetchClassData = async () => {
                try {
                    const response = await fetch(`https://digiteach.pythonanywhere.com/classes/${classId || formData.class_detail_id}/`);
                    const result = await response.json();
                    const bookDataClass = bookList.filter(classData => classData.class_name == result.data.class_name)
                    setBooks(bookDataClass)
                } catch (error) {
                    console.error("Error fetching classes:", error);
                }
            }
            fetchClassData()
        }
    }, [classId, formData.class_detail_id])

    useEffect(() => {
        fetchBooks();
        fetchClasses();
        fetchBookSet();
    }, [schoolId]);

    // Input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name == "class_detail_id") {
            setClassId(e.target.value)
        }
        if (name == "academic_years") {
            setAcademicYear(e.target.value)
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!formData.book_set_name) errors.book_set_name = "Book set name is required";
        if (!formData.academic_year) errors.academic_year = "Academic Year is required";
        if (!formData.class_detail_id) errors.class_detail_id = "Class is required";
        if (!formData.bookId) errors.bookId = "Select Book is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            school_id: parseInt(schoolId) || "",
            book_set_name: "",
            academic_year: "",
            class_detail_id: "",
            bookId: ''
            // book_author: "",
            // book_publisher: "",
            // class_detail: "",
        });
        setFormErrors({});
        setEditingBookSet(null);
    };

    // Add or Update book
    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsFormLoading(true);
        try {
            const url = editingBookSet
                ? `https://digiteach.pythonanywhere.com/book_set/${editingBookSet.id}/`
                : "https://digiteach.pythonanywhere.com/book_set/";

            const bookSetUrl = "https://digiteach.pythonanywhere.com/book_set_detail/"


            const method = editingBookSet ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to save book");
            const bookSetRes = await response.json();

            // console.log("Book Set Response:", bookSetRes);
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: `Book ${editingBookSet ? "updated" : "added"} successfully.`,
                timer: 2000,
                showConfirmButton: false,
            });

            setShowAddForm(false);
            resetForm();
            fetchBookSet();
            const responseData = await fetch(bookSetUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ book_set_id: bookSetRes.data.id, class_id: formData.class_detail_id, book_detail_id: formData.bookId }),
            });
            await responseData.json()
        } catch (error) {
            console.error("Error saving book:", error);
            Swal.fire("Error", "Failed to save book. Please try again.", "error");
        } finally {
            setIsFormLoading(false);
        }
    };


    // Edit book
    const handleEditBookSet = (bookSet) => {
        setEditingBookSet(bookSet);
        setFormData({
            school_id: parseInt(schoolId) || "",
            book_set_name: bookSet.book_set_name || "",
            academic_year: bookSet.academic_year || "",
            class_detail_id: bookSet.class_detail_id || "",
            books: bookSet?.books || [],
            // book_author: bookSet.book_author || "",
            // book_publisher: bookSet.book_publisher || "",
            // class_detail: bookSet.class_detail || bookSet.class_name || "",
        });
        setShowAddForm(true);
    };

    // Delete book
    const handleDeleteBookSet = async (bookId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this book set!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#374151",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`https://digiteach.pythonanywhere.com/book_set/${bookId}/`, {
                    method: "DELETE",
                });

                if (!response.ok) throw new Error("Failed to delete book");

                Swal.fire("Deleted!", "The book has been deleted.", "success");
                fetchBookSet();
            } catch (error) {
                console.error("Error deleting book:", error);
                Swal.fire("Error", "Failed to delete book. Please try again.", "error");
            }
        }
    };

    const filteredBookSet = bookSet.filter(
        (bookSet) =>
            (bookSet.book_set_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (bookSet.academic_year?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (bookSet.class_detail_id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (bookSet.class_detail_info?.toLowerCase() || "").includes(searchTerm.toLocaleLowerCase())
        // ||
        // (bookSet.book_author?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        // (bookSet.book_publisher?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // Placeholder for class management logic

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">School BookSet List</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        <FaPlus /> Add Book Set
                    </button>
                </div>
            </div>

            {/* Add / Edit Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center border-b p-4">
                            <h3 className="text-lg font-semibold">
                                {editingBookSet ? "Edit Book Set" : "Add New Book Set"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setBooks([])
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
                                    Book Set Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="book_set_name"
                                    value={formData.book_set_name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${formErrors.book_set_name ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {formErrors.book_set_name && (
                                    <p className="text-sm text-red-600 mt-1">{formErrors.book_set_name}</p>
                                )}
                            </div>

                            {/* Author */}
                            {/* <div>
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
                            </div> */}

                            {/* Publisher */}
                            {/* <div>
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
                            </div> */}

                            {/* Class Dropdown */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Academic Year <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="academic_year"
                                    value={formData.academic_year}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${formErrors.academic_year ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Select Academic Year</option>
                                    {academic_years.map((cls, ind) => (
                                        //console.log('test option value', ind + 1),
                                        <option key={ind + 1} value={cls.year}>
                                            {cls.year}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.academic_year && (
                                    <p className="text-sm text-red-600 mt-1">{formErrors.academic_year}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="class_detail_id"
                                    value={formData.class_detail_id}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${formErrors.class_detail_id ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((cls) => (
                                        console.log('option of class ', cls),
                                        <option key={cls.id} value={cls.id}>
                                            {cls.class_name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.class_detail_id && (
                                    <p className="text-sm text-red-600 mt-1">{formErrors.class_detail_id}</p>
                                )}
                            </div>

                            <div className="bg-gray-50 py-2 rounded-lg">
                                <p className="text-gray-500 text-xs mb-2">Books</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                    {
                                        (classId ||
                                            books?.length > 0) && books.map((book, index) => (
                                                <div key={index} className="flex items-center gap-1">
                                                    <input
                                                        type="checkbox"
                                                        id={index}
                                                        name="books"
                                                        value={book.book_title}
                                                        checked={formData?.books?.includes(book.book_title)}
                                                        onChange={(e) => {
                                                            setFormData({
                                                                ...formData,
                                                                bookId: book.id,
                                                                books: [...formData?.books, e.target.value]
                                                            });
                                                        }}
                                                        className="w-3 h-3"
                                                    />
                                                    <label htmlFor={index} className="text-xs text-gray-700">
                                                        {book.book_title}
                                                    </label>
                                                </div>
                                            ))}
                                </div>
                                {formErrors.bookId && (
                                    <p className="text-sm text-red-600 mt-1">{formErrors.bookId}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setBooks([])
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
                                    {isFormLoading ? "Saving..." : editingBookSet ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
















                    </div>
                </div>
            )}
            {/* Add / Edit Form Modal  end*/}

            {/* Book Set Table */}
            {filteredBookSet.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No books found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book set Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Academic year</th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th> */}
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publisher</th> */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBookSet.map((book_set, index) => (
                                <tr key={book_set.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">{book_set.book_set_name || "N/A"}</td>
                                    {/* <td className="px-6 py-4">{book_set.book_author || "N/A"}</td> */}
                                    {/* <td className="px-6 py-4">{book_set.book_publisher || "N/A"}</td> */}
                                    <td className="px-6 py-4">{book_set.academic_year || "N/A"}</td>
                                    <td className="px-6 py-4">
                                        {`class ${book_set.class_detail_info.class_name}`}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            className="text-black mr-4 text-sm"
                                            onClick={() => {
                                                navigate(`/school-dashboard/${book_set.id}`)
                                            }}
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            className="text-yellow-500 mr-4 hover:text-yellow-700"
                                            onClick={() => handleEditBookSet(book_set)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => handleDeleteBookSet(book_set.id)}
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
    )
}

export default BookSet;