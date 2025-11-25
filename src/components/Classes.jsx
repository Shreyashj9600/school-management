    import { useEffect, useState } from "react";
    import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
    import Swal from "sweetalert2";
    import { academic_years } from "../utils/sweetAlertConfig";

    const Classes = ({ schoolId, fetchClasses, classes }) => {

        const [books, setBooks] = useState([]);
        const [loading, setLoading] = useState(true);
        const [searchTerm, setSearchTerm] = useState("");
        const [showAddForm, setShowAddForm] = useState(false);
        const [isFormLoading, setIsFormLoading] = useState(false);
        const [editingClass, setEditingClass] = useState(null);
        const [formErrors, setFormErrors] = useState({});

        const [formData, setFormData] = useState({
            school_id: parseInt(schoolId) || "",
            board: "",
            academic_year: "",
            class_name: "",
        });

        console.log("School ID in Classes component:", schoolId);
        // Fetch all classes


        useEffect(() => {
            fetchClasses();
        }, [schoolId]);

        // Input changes
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                school_id: parseInt(schoolId) || "",
                [name]: value,
            }));
        };

        // Validate form
        const validateForm = () => {
            const errors = {};
            if (!formData.board) errors.board = "Board is required";
            if (!formData.academic_year) errors.academic_year = "Academic Year is required";
            if (!formData.class_name) errors.class_name = "Class is required";
            setFormErrors(errors);
            return Object.keys(errors).length === 0;
        };

        // Reset form
        const resetForm = () => {
            setFormData({
                school_id: parseInt(schoolId) || "",
                board: "",
                academic_year: "",
                class_name: "",
            });
            setFormErrors({});
            setEditingClass(null);
        };

        // Add or Update book
        const handleClassBook = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            setIsFormLoading(true);
            try {
                const url = editingClass
                    ? `https://digiteach.pythonanywhere.com/classes/${editingClass.id}/`
                    : "https://digiteach.pythonanywhere.com/classes/";

                const method = editingClass ? "PUT" : "POST";

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
                    text: `Class ${editingClass ? "updated" : "added"} successfully.`,
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchClasses();
                setShowAddForm(false);
                resetForm();
            } catch (error) {
                console.error("Error saving Class:", error);
                Swal.fire("Error", "Failed to save book. Please try again.", "error");
            } finally {
                setIsFormLoading(false);
            }
        };

        // Edit book
        const handleEditClass = (cls) => {
            setEditingClass(cls);
            setFormData({
                school_id: cls.school_id || parseInt(schoolId) || "",
                board: cls.board || "",
                academic_year: cls.academic_year || "",
                class_name: cls.class_name || "",
            });
            setShowAddForm(true);
        };

        // Delete book
        const handleDeleteClass = async (classId) => {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You will not be able to recover this class!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#374151",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://digiteach.pythonanywhere.com/classes/${classId}/`, {
                        method: "DELETE",
                    });

                    if (!response.ok) throw new Error("Failed to delete book");

                    Swal.fire("Deleted!", "The class has been deleted.", "success");
                    fetchClasses();
                } catch (error) {
                    console.error("Error deleting class:", error);
                    Swal.fire("Error", "Failed to delete class. Please try again.", "error");
                }
            }
        };

        const filteredClasses = classes.filter(
            (cls) =>
                (cls.board?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (cls.academic_year?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (cls.class_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );

        // Placeholder for class management logic
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">School Class List</h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            <FaPlus /> Add Class
                        </button>
                    </div>
                </div>

                {/* Add / Edit Form Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="flex justify-between items-center border-b p-4">
                                <h3 className="text-lg font-semibold">
                                    {editingClass ? "Edit Class" : "Add New Class"}
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
                            <form onSubmit={handleClassBook} className="p-4 space-y-4">
                                {/* Book Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Board Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="board"
                                        value={formData.board}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${formErrors.board ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {formErrors.board && (
                                        <p className="text-sm text-red-600 mt-1">{formErrors.board}</p>
                                    )}
                                </div>

                                {/* Author */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Academic Year <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="academic_year"
                                        value={formData.academic_year}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${formErrors.academic_year ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {formErrors.academic_year && (
                                        <p className="text-sm text-red-600 mt-1">{formErrors.academic_year}</p>
                                    )}
                                </div> */}

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
                                        {academic_years.map((cls) => (
                                            <option key={cls.id} value={cls.year}>
                                                {cls.year}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.academic_year && (
                                        <p className="text-sm text-red-600 mt-1">{formErrors.academic_year}</p>
                                    )}
                                </div>

                                {/* Publisher */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Class <span className="text-red-500">*</span>
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
                                        {/* {classes.map((cls) => (
                                            <option key={cls.id} value={cls.class_name}>
                                                {cls.class_name}
                                            </option>
                                        ))} */}

                                        {
                                            ["preschool", "nursery", "JKG", "SKG", "class 1", "class 2", "class 3", "class 4", "class 5", "class 6", "class 7", "class 8", "class 9", "class 10", "class 11", "class 12"].map((cla) => (
                                                <option key={cla} value={cla.includes("class") ? cla.slice(6) : cla.slice(0)}>{cla.charAt(0).toUpperCase() + cla.slice(1)}</option>
                                            ))
                                        }
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
                                        {isFormLoading ? "Saving..." : editingClass ? "Update" : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Book Table */}
                {filteredClasses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No books found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {["ID", "Board", "Academy Year", "Class", "Actions"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredClasses.map((cls, index) => (
                                    <tr key={cls.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">{cls.board || "N/A"}</td>
                                        <td className="px-6 py-4">{cls.academic_year || "N/A"}</td>
                                        {/* <td className="px-6 py-4">{book.book_publisher || "N/A"}</td> */}
                                        <td className="px-6 py-4">
                                            {cls.class_name ? `Class ${cls.class_name}` : `ID ${cls.class_detail}`}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="text-yellow-500 mr-4 hover:text-yellow-700"
                                                onClick={() => handleEditClass(cls)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleDeleteClass(cls.id)}
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

    export default Classes;