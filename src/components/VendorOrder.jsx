import React from "react";
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

export default function VendorOrders() {
    const orders = [
        {
            id: 1,
            schoolName: "Velly School",
            bookTitle: "Maths Book - Class 5",
            class: "5",
            quantity: 40,
            totalPrice: "₹8,000",
            orderDate: "2025-10-25",
            status: "Pending",
        },
        {
            id: 2,
            schoolName: "ABC International",
            bookTitle: "English Workbook - Class 6",
            class: "6",
            quantity: 30,
            totalPrice: "₹6,000",
            orderDate: "2025-10-20",
            status: "Approved",
        },
        {
            id: 3,
            schoolName: "Sunrise Public School",
            bookTitle: "Science Textbook - Class 7",
            class: "7",
            quantity: 50,
            totalPrice: "₹12,500",
            orderDate: "2025-10-10",
            status: "Pending",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Approved":
                return "bg-green-100 text-green-800";
            case "Dispatched":
                return "bg-blue-100 text-blue-800";
            // case "Delivered":
            //     return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="p-2 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
                <h2 className="text-2xl font-bold mb-6">📦 Orders</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-700">
                            <th className="p-3 font-semibold">ID</th>
                            <th className="p-3 font-semibold">School Name</th>
                            <th className="p-3 font-semibold">Book Title</th>
                            {/* <th className="p-3 font-semibold">Class</th> */}
                            <th className="p-3 font-semibold">Quantity</th>
                            {/* <th className="p-3 font-semibold">Total Price</th> */}
                            <th className="p-3 font-semibold">Order Date</th>
                            <th className="p-3 font-semibold">Status</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="p-3">{order.id}</td>
                                <td className="p-3">{order.schoolName}</td>
                                <td className="p-3">{order.bookTitle}</td>
                                {/* <td className="p-3">{order.class}</td> */}
                                <td className="p-3">{order.quantity}</td>
                                {/* <td className="p-3 font-semibold">{order.totalPrice}</td> */}
                                <td className="p-3">{order.orderDate}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3 flex gap-3">
                                    <button className="text-gray-600 hover:text-gray-900">
                                        <FaEye size={18} />
                                    </button>
                                    <button
                                        // onClick={() =>
                                        //   handleVendorApproval(v.id, "Approved")
                                        // }
                                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                                    >
                                        <FaCheck /> Approve
                                    </button>
                                    <button
                                        // onClick={() =>
                                        //     handleVendorApproval(v.id, "Not Approved")
                                        // }
                                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                                    >
                                        <FaTimes /> Reject
                                    </button>
                                    <button
                                        // onClick={() =>
                                        //     setDeleteConfirm({ show: true, id: v.id })
                                        // }
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
