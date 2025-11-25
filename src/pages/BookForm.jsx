import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showSuccess, showError } from "../utils/sweetAlertConfig";

export default function BookForm({ onSuccess }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const schoolId = localStorage.getItem("schoolId");

    const [formData, setFormData] = useState({
        // school_id: parseInt(schoolId),
        book_title: "",
        book_author: "",
        book_publisher: "",
        class_name: "",
    });

    const [classesList, setClassesList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch job details if editing
    useEffect(() => {
        if (isEditMode && id) {
            const fetchBook = async () => {
                try {
                    const response = await fetch(`https://digiteach.pythonanywhere.com/books/${id}/`);
                    if (!response.ok) throw new Error("Failed to fetch job");
                    const result = await response.json();
                    if (result.data) {
                        const bookData = result.data;
                        setFormData({
                            book_title: bookData.book_title || "",
                            book_author: bookData.book_author || "",
                            book_publisher: bookData.book_publisher || "",
                            class_name: bookData.class_name || "",
                        });
                    }
                } catch (err) {
                    console.error("Error fetching job:", err);
                    setError("Failed to load job details");
                }
            };
            fetchBook();
        }
        const fetchBook = async () => {
            const classRes = await fetch(`https://digiteach.pythonanywhere.com/classes/`);
            if (!classRes.ok) throw new Error("Failed to fetch class");
            const classResult = await classRes.json();
            if (classResult.data) {
                const classData = classResult.data;
                setClassesList(classData);
            }
        }
        fetchBook()
    }, [id, isEditMode, schoolId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Required fields validation
            const requiredFields = [
                "book_title",
                "book_author",
                "book_publisher",
                "class_name",

            ];
            const missingFields = requiredFields.filter((field) => !formData[field]);
            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
            }

            // Prepare data
            const bookData = {
                // school_id: parseInt(formData.school_id),
                book_title: formData.book_title,
                book_author: formData.book_author,
                book_publisher: formData.book_publisher,
                class_name: formData.class_name,
            };

            console.log('Submitting job data:', bookData); // Debug log

            const url = isEditMode
                ? `https://digiteach.pythonanywhere.com/books/${id}/`
                : "https://digiteach.pythonanywhere.com/books/";

            const method = isEditMode ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData)
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(
                    responseData.detail ||
                    responseData.message ||
                    Object.values(responseData).flat().join("\n") ||
                    "Failed to save job"
                );
            }

            await showSuccess(
                isEditMode ? 'Book Updated!' : 'Book Posted!',
                isEditMode ? 'The Book has been updated successfully.' : 'The Book has been posted successfully.'
            );
            if (onSuccess) onSuccess();
            navigate("/school-dashboard", { state: { activeTab: "Book Management" } });
        } catch (err) {
            console.error("Error saving job:", err);
            const errorMessage = err.message || "An error occurred while saving the job";
            setError(errorMessage);
            await showError('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 my-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? "Edit Book Posting" : "Post a New Book"}
                </h2>
                <button type="button" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
                    ← Back to Books List
                </button>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Job Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Book Title <span className="text-red-600">*</span></label>
                        <input
                            type="text"
                            name="book_title"
                            value={formData.book_title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Job Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Author <span className="text-red-600">*</span></label>
                        <input
                            type="text"
                            name="book_author"
                            value={formData.book_author}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Publisher <span className="text-red-600">*</span></label>
                        <input
                            type="text"
                            name="book_publisher"
                            value={formData.book_publisher}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Experience */}
                    {/* <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Experience Required (years) *</label>
                        <input
                            type="number"
                            name="experience_required"
                            value={formData.experience_required}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div> */}

                    {/* Qualification */}
                    {/* <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Qualification *</label>
                        <input
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div> */}

                    {/* Class */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Class <span className="text-red-600">*</span></label>
                        <select
                            name="class_name"
                            value={formData.class_name || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    class_name: value ? value : []
                                }));
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select Class</option>
                            {
                                classesList.map((cls) => (
                                    <option key={cls.id} value={cls.class_name}>{cls.class_name}</option>
                                ))
                            }
                            {/* <option value="preschool">Preschool</option>
                            <option value="nursery">Nursery</option>
                            <option value="JKG">JKG</option>
                            <option value="SKG">SKG</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option> */}
                            {/* <option value="₹75,000 - ₹1,00,000">₹75,000 - ₹1,00,000</option>
              <option value="₹1,00,000 - ₹1,50,000">₹1,00,000 - ₹1,50,000</option>
              <option value="Above ₹1,50,000">Above ₹1,50,000</option>
              <option value="Negotiable">Negotiable</option> */}
                        </select>
                    </div>

                    {/* Last Date to Apply */}
                    {/* <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Last Date to Apply *</label>
                        <input
                            type="date"
                            name="last_date_to_apply"
                            value={formData.last_date_to_apply}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div> */}
                </div>

                {/* Job Description */}
                {/* <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Job Description *</label>
                    <textarea
                        name="job_description"
                        value={formData.job_description}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter detailed job description, responsibilities, and requirements..."
                        required
                    />
                </div> */}

                {/* Active Checkbox */}
                {/* <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">This job posting is active</label>
                </div> */}

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? (isEditMode ? "Updating..." : "Posting...") : isEditMode ? "Update Book" : "Post Book"}
                    </button>
                </div>
            </form>
        </div>
    );
}
