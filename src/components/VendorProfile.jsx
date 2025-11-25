import React, { useState } from "react";

export default function VendorProfile() {
    const initialData = {
        vendor_companey_name: "abc.pvt.ltd",
        vendor_name: "Kumar sukla",
        vendor_email: "kumar1232@gmail.com",
        vendor_mobile: "634336722",
        vendor_website: "https://www.google.com/",
        companey_GST_number: "83744gv",
        companey_logo: "/image/Screenshot_8.png",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "382415",
        approve_status: "Not Approved",
    };

    const [vendor, setVendor] = useState(initialData);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setVendor(formData);
        setEditMode(false);
    };

    const handleCancel = () => {
        setFormData(vendor);
        setEditMode(false);
    };

    return (
        <div className="flex justify-center p-2 bg-gray-50 min-h-screen">
            <div className="w-full bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={vendor.companey_logo}
                            alt="Company Logo"
                            className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                        />
                        {editMode ? (
                            <input
                                type="text"
                                name="vendor_companey_name"
                                value={formData.vendor_companey_name}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-3 py-1 text-lg font-semibold w-64"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-800">
                                {vendor.vendor_companey_name}
                            </h2>
                        )}
                    </div>

                    {editMode ? (
                        <button
                            onClick={handleCancel}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {[
                        { label: "Vendor Name", key: "vendor_name" },
                        { label: "Vendor Email", key: "vendor_email" },
                        { label: "Vendor Mobile", key: "vendor_mobile" },
                        { label: "Company GST Number", key: "companey_GST_number" },
                        { label: "City", key: "city" },
                        { label: "State", key: "state" },
                        { label: "Pincode", key: "pincode" },
                        { label: "Website", key: "vendor_website" },
                        { label: "Approval Status", key: "approve_status" },
                    ].map((field) => (
                        <div key={field.key} className="bg-gray-50 p-5 rounded-lg shadow hover:shadow-sm transition">
                            <p className="text-gray-500 text-xs">{field.label}</p>
                            {editMode ? (
                                <input
                                    type="text"
                                    name={field.key}
                                    value={formData[field.key]}
                                    onChange={handleChange}
                                    className="border border-gray-300 mt-0.5 p-1 w-full border rounded text-sm rounded-md truncate"
                                />
                            ) : field.key === "vendor_website" ? (
                                <a
                                    href={vendor[field.key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800 font-semibold text-sm truncate"
                                >
                                    {vendor[field.key]}
                                </a>
                            ) : (
                                <p className={field.key == "approve_status" ? "text-red-500 font-semibold text-sm truncate" : "text-gray-800 font-semibold text-sm truncate"}>{vendor[field.key]}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Buttons */}
                {editMode && (
                    <div className="flex justify-start mt-8">
                        <button
                            onClick={handleSave}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-semibold"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
