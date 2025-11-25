import React, { useState, useEffect } from "react";
import { showError, showSuccess } from "../utils/sweetAlertConfig";

export default function AddEditBoardModal({ onClose, editData, fetchSchoolDetailProfile }) {
    const [formData, setFormData] = useState({
        school_data: "",
        board: "",
        register_number: "",
        udisc_code: "",
        preschool: "no",
        nursery: "no",
        jkg: "no",
        skg: "no",
        class_1: "no",
        class_2: "no",
        class_3: "no",
        class_4: "no",
        class_5: "no",
        class_6: "no",
        class_7: "no",
        class_8: "no",
        class_9: "no",
        class_10: "no",
        class_11: "no",
        class_12: "no",
    });

    const classOptions = [
        "preschool",
        "nursery",
        "JKG",
        "SKG",
        ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`),
    ];

    const schoolId = localStorage.getItem("schoolId");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckbox = (cls) => {
        const key = cls.toLowerCase().replace("class ", "class_");
        setFormData((prev) => ({
            ...prev,
            [key]: prev[key] === "yes" ? "no" : "yes",
        }));
    };

    useEffect(() => {
        if (editData && editData?.id) {
            const fetchBoard = async () => {
                try {
                    const response = await fetch(`https://digiteach.pythonanywhere.com/school_board_detail/${editData.id}/`);
                    if (!response.ok) throw new Error("Failed to fetch board data");
                    const result = await response.json();
                    if (result.data) {
                        setFormData(result.data);
                    }
                } catch (err) {
                    console.error("Error fetching board:", err);
                    await showError("Error", "Failed to load board details");
                }
            };
            fetchBoard();
        }
    }, [editData?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate required fields
            const requiredFields = ["board", "register_number", "udisc_code"];
            const missingFields = requiredFields.filter((field) => !formData[field]);
            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
            }

            // Prepare data
            const boardData = {
                school_data: parseInt(schoolId),
                board: formData.board,
                register_number: formData.register_number,
                udisc_code: formData.udisc_code,
                JKG: formData.jkg,
                SKG: formData.skg,
                preschool: formData.preschool,
                nursery: formData.nursery,
                class_1: formData.class_1,
                class_2: formData.class_2,
                class_3: formData.class_3,
                class_4: formData.class_4,
                class_5: formData.class_5,
                class_6: formData.class_6,
                class_7: formData.class_7,
                class_8: formData.class_8,
                class_9: formData.class_9,
                class_10: formData.class_10,
                class_11: formData.class_11,
                class_12: formData.class_12,
            };

            const url = editData?.id
                ? `https://digiteach.pythonanywhere.com/school_board_detail/${editData.id}/`
                : "https://digiteach.pythonanywhere.com/school_board_detail/";

            const method = editData?.id ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(boardData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.detail ||
                    responseData.message ||
                    Object.values(responseData).flat().join("\n") ||
                    "Failed to save board"
                );
            }

            await showSuccess(
                editData?.id ? "Board Updated!" : "Board Added!",
                editData?.id
                    ? "The board details have been updated successfully."
                    : "The board details have been added successfully."
            );

            fetchSchoolDetailProfile();
            onClose();
        } catch (err) {
            console.error("Error saving board:", err);
            const errorMessage = err.message || "An error occurred while saving board details";
            await showError("Error", errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative">
                {/* Close Button */}
                <button
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold text-gray-800 mb-5">
                    {editData?.id ? "Edit Board Details" : "Add New Board Details"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="text-sm text-gray-700 font-medium">
                                Board *
                            </label>
                            <input
                                type="text"
                                name="board"
                                placeholder="e.g., CBSE, ICSE, State Board"
                                value={formData.board}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium">
                                Register Number *
                            </label>
                            <input
                                type="text"
                                name="register_number"
                                value={formData.register_number}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium">
                                UDISE Code *
                            </label>
                            <input
                                type="text"
                                name="udisc_code"
                                value={formData.udisc_code}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Classes Offered */}
                    <div>
                        <p className="text-sm text-gray-700 font-medium mb-2">Classes Offered</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {classOptions.map((cls) => {
                                const key = cls.toLowerCase().replace("class ", "class_");
                                return (
                                    <label
                                        key={cls}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                    >
                                        <input
                                            type="checkbox"
                                            name={key}
                                            checked={formData[key] === "yes"}
                                            onChange={() => handleCheckbox(cls)}
                                            className="h-4 w-4 border-gray-300"
                                        />
                                        {cls}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-amber-500 text-white px-5 py-2 rounded-md hover:bg-amber-600 transition"
                        >
                            {editData?.id ? "Update Board" : "Save Board"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
