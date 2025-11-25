import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const BookSetDetails = () => {
    const [bookDetails, setBookDetails] = useState([]);
    const [bookSetName, setBookSetName] = useState("");
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(true); // show immediately
    const { id } = useParams();
    const navigate = useNavigate();

    // ✅ Fetch book details
    const fetchBookSetDetails = async () => {
        try {
            const res = await fetch(`https://digiteach.pythonanywhere.com/book_set_detail/`);
            const data = await res.json();

            const matchingBooks = data.data.filter(
                (item) => String(item.book_set_id) === String(id)
            );

            if (matchingBooks.length > 0) {
                setBookDetails(matchingBooks);
                setBookSetName(matchingBooks[0]?.book_set_data?.book_set_name || "N/A");
            } else {
                setBookDetails([]);
                setBookSetName("N/A");
            }
        } catch (error) {
            console.error("Error fetching book set details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookSetDetails();
    }, [id]);

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-11/12 max-w-4xl shadow-lg overflow-hidden animate-fadeIn">
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-200">
                            <h2 className="text-lg font-semibold">Book Set Details</h2>
                            <button
                                onClick={() => {
                                    setShowPopup(false);
                                    navigate(`/school-dashboard`);
                                }}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-3 overflow-x-auto max-h-[70vh] overflow-y-auto">
                            {loading ?
                                (
                                    // Show loading message while data is fetching
                                    <div className="text-center py-10 text-gray-500">
                                        Loading book details...
                                    </div>
                                )
                                : (
                                    <>
                                        <h1 className="px-2 py-2 mb-3 font-bold">
                                            Book Set Name : <span>{bookSetName}</span>
                                        </h1>

                                        <table className="w-full border border-gray-200 text-sm text-left">
                                            <thead className="bg-gray-100 text-gray-700">
                                                <tr>
                                                    <th className="px-2 py-2 border">Book Title</th>
                                                    <th className="px-2 py-2 border">Author</th>
                                                    <th className="px-2 py-2 border">Publisher</th>
                                                    <th className="px-2 py-2 border">Class</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookDetails.length > 0 ? (
                                                    bookDetails.map((book, index) => (
                                                        <tr key={index} className="text-gray-800 hover:bg-gray-50">
                                                            <td className="px-2 py-2 border">
                                                                {book.book_detail?.book_title || "N/A"}
                                                            </td>
                                                            <td className="px-2 py-2 border">
                                                                {book.book_detail?.book_author || "N/A"}
                                                            </td>
                                                            <td className="px-2 py-2 border">
                                                                {book.book_detail?.book_publisher || "N/A"}
                                                            </td>
                                                            <td className="px-2 py-2 border">
                                                                {book.book_detail?.class_name || "N/A"}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="5"
                                                            className="text-center text-gray-500 py-3 border"
                                                        >
                                                            No books found for this book set.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                        </div>

                        <div className="p-3 border-t border-gray-200 text-right">
                            <button
                                onClick={() => {
                                    setShowPopup(false);
                                    navigate(`/school-dashboard`);
                                }}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookSetDetails;
