

import { useEffect, useState } from "react";
import {
  FaSchool,
  FaBook,
  FaClipboardList,
  FaUser,
  FaTasks,
  FaEye,
  FaTrash,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function AdminDashboard({ setIsAdmin }) {
  const [schools, setSchools] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  // ✅ FETCH SCHOOLS

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/school/");
      const result = await res.json();
      if (Array.isArray(result.data)) setSchools(result.data);
      else setSchools([]);
    } catch (err) {
      console.error("Failed to fetch schools:", err);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FETCH VENDORS

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/vendor/");
      const result = await res.json();

      if (Array.isArray(result)) setVendors(result);
      else if (Array.isArray(result.data)) setVendors(result.data);
      else setVendors([]);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === "dashboard") fetchSchools();
    else if (activePage === "vendors") fetchVendors();
  }, [activePage]);

  // ✅ SCHOOL STATUS UPDATE

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(
        `https://digiteach.pythonanywhere.com/school/${id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: status }),
        }
      );
      if (!res.ok) throw new Error("Failed to update school status");
      fetchSchools();
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ SCHOOL LOCATION UPDATE

  const handleLocationSave = async () => {
    if (!selectedSchool || !locationInput.trim()) {
      alert("Please enter a valid embed code or link");
      return;
    }

    try {
      const res = await fetch(
        `https://digiteach.pythonanywhere.com/school/${selectedSchool.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: locationInput }),
        }
      );

      if (!res.ok) throw new Error("Failed to update location");

      alert("Location updated successfully!");
      setShowLocationModal(false);
      setLocationInput("");
      fetchSchools();
    } catch (err) {
      alert(err.message);
    }
  };

  // ========================
  // ✅ VENDOR APPROVE / REJECT
  // ========================
  const handleVendorApproval = async (id, status) => {
    try {
      const res = await fetch(
        `https://digiteach.pythonanywhere.com/vendor/${id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approve_status: status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update vendor status");
      alert(`Vendor ${status}`);
      fetchVendors();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteVendor = async () => {
    try {
      const res = await fetch(
        `https://digiteach.pythonanywhere.com/vendor/${deleteConfirm.id}/`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete vendor");
      alert("Vendor deleted successfully");
      fetchVendors();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    window.location.href = "/";
  };

  const handleView = (school) => {
    setSelectedSchool(school);
  };
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      <aside className="w-64 bg-white text-black flex flex-col">
        <div className="flex items-center justify-center py-6 font-bold text-xl border-b border-red-600">
          DigiTeach
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg ${
              activePage === "dashboard"
                ? "bg-red-600 text-white"
                : "hover:bg-red-600 hover:text-white"
            }`}
          >
            <FaTasks /> Dashboard
          </button>
          <button
            onClick={() => setActivePage("vendors")}
            className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg ${
              activePage === "vendors"
                ? "bg-red-600 text-white"
                : "hover:bg-red-600 hover:text-white"
            }`}
          >
            <FaClipboardList /> Vendors
          </button>
          <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-600 rounded-lg">
            <FaBook /> Book Inventory
          </button>
          <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-600 rounded-lg">
            <FaSchool /> Orders
          </button>
          <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-600 rounded-lg">
            <FaUser /> Profile
          </button>
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 bg-gray-100">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow">
          <h1 className="text-2xl font-bold capitalize">{activePage}</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-full text-sm"
            />
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-4 gap-6 p-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500">Total Jobs</p>
            <h2 className="text-2xl font-bold">20</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500">Books</p>
            <h2 className="text-2xl font-bold">35</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-bold">7</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500">Drivers</p>
            <h2 className="text-2xl font-bold">5</h2>
          </div>
        </div>

        {/* ============= DASHBOARD PAGE (SCHOOLS) ============= */}
        {activePage === "dashboard" && (
          <div className="p-6">
            {loading ? (
              <p>Loading schools...</p>
            ) : schools.length === 0 ? (
              <p>No schools found</p>
            ) : (
              <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        School Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        City
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {schools.map((school) => (
                      <tr key={school.id}>
                        <td className="px-4 py-2 text-sm">{school.id}</td>
                        <td className="px-4 py-2 text-sm">
                          {school.school_name}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {school.school_email}
                        </td>
                        <td className="px-4 py-2 text-sm">{school.city}</td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={
                              school.is_active
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {school.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm flex gap-2">
                          <button
                            onClick={() => handleView(school)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleStatusChange(school.id, true)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(school.id, false)}
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSchool(school);
                              setShowLocationModal(true);
                            }}
                            className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"
                          >
                            <FaMapMarkerAlt /> Add Location
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============= VENDOR PAGE ============= */}
        {activePage === "vendors" && (
          <div className="p-6">
            {loading ? (
              <p>Loading vendors...</p>
            ) : vendors.length === 0 ? (
              <p>No vendors found</p>
            ) : (
              <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Vendor Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Company
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        City
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {vendors.map((v) => (
                      <tr key={v.id}>
                        <td className="px-4 py-2 text-sm">{v.id}</td>
                        <td className="px-4 py-2 text-sm">{v.vendor_name}</td>
                        <td className="px-4 py-2 text-sm">
                          {v.vendor_companey_name}
                        </td>
                        <td className="px-4 py-2 text-sm">{v.vendor_email}</td>
                        <td className="px-4 py-2 text-sm">{v.city}</td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={
                              v.approve_status === "Approved"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {v.approve_status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm flex gap-2">
                          <button
                            onClick={() => setSelectedVendor(v)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() =>
                              handleVendorApproval(v.id, "Approved")
                            }
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                          >
                            <FaCheck /> Approve
                          </button>
                          <button
                            onClick={() =>
                              handleVendorApproval(v.id, "Not Approved")
                            }
                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                          >
                            <FaTimes /> Reject
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ show: true, id: v.id })
                            }
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
            )}
          </div>
        )}
      </div>
      {/* Delete Confirmation Popup */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[380px] rounded-lg shadow-xl p-6 relative animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this vendor? This action cannot be
              undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVendor}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>

            {/* Close icon (optional) */}
            <button
              onClick={() => setDeleteConfirm({ show: false, id: null })}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* School Details Popup */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedSchool(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4 text-center border-b pb-2">
              School Details
            </h3>

            <table className="w-full border border-gray-300 text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="font-semibold p-2 w-1/3 bg-gray-50">
                    School Name
                  </td>
                  <td className="p-2">{selectedSchool.school_name}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">Email</td>
                  <td className="p-2">{selectedSchool.school_email}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">Mobile</td>
                  <td className="p-2">{selectedSchool.school_mobile}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">City</td>
                  <td className="p-2">{selectedSchool.city}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">State</td>
                  <td className="p-2">{selectedSchool.state}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">Pincode</td>
                  <td className="p-2">{selectedSchool.pincode}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">Status</td>
                  <td className="p-2">
                    <span
                      className={
                        selectedSchool.is_active
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {selectedSchool.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {selectedSchool.location && (
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Location:</h4>
                <iframe
                  src={selectedSchool.location}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="school-location"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Location Modal */}
      {showLocationModal && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-2">
              Add Location for {selectedSchool.school_name}
            </h3>
            <textarea
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Paste Google Map embed code or link"
              className="w-full h-28 border rounded p-2 text-sm"
            ></textarea>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLocationSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Details Popup */}
      {/* Vendor Details Popup */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedVendor(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4 text-center border-b pb-2">
              Vendor Details
            </h3>

            <table className="w-full border border-gray-300 text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="font-semibold p-2 w-1/3 bg-gray-50">
                    Vendor Name
                  </td>
                  <td className="p-2">{selectedVendor.vendor_name}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">Email</td>
                  <td className="p-2">{selectedVendor.vendor_email}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">Mobile</td>
                  <td className="p-2">{selectedVendor.vendor_mobile}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">Company Name</td>
                  <td className="p-2">{selectedVendor.vendor_companey_name}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">Website</td>
                  <td className="p-2">
                    <a
                      href={selectedVendor.vendor_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {selectedVendor.vendor_website}
                    </a>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">GST Number</td>
                  <td className="p-2">{selectedVendor.companey_GST_number}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">City</td>
                  <td className="p-2">{selectedVendor.city}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">State</td>
                  <td className="p-2">{selectedVendor.state}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold p-2 bg-gray-50">Pincode</td>
                  <td className="p-2">{selectedVendor.pincode}</td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 bg-gray-50">Status</td>
                  <td className="p-2">
                    <span
                      className={
                        selectedVendor.approve_status === "Approved"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {selectedVendor.approve_status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {selectedVendor.companey_logo && (
              <div className="mt-4 text-center">
                <h4 className="font-semibold mb-1">Company Logo:</h4>
                <img
                  src={`https://digiteach.pythonanywhere.com${selectedVendor.companey_logo}`}
                  alt="Company Logo"
                  className="w-32 h-32 object-contain border inline-block"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
