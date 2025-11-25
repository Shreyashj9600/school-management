import { useEffect, useState } from "react";
import { FaSchool, FaBook, FaClipboardList, FaUser, FaTasks, FaTachometerAlt, FaEdit, FaTrash, FaSignOutAlt, FaSearch, FaFirstOrder } from "react-icons/fa";
import VendorProfile from "../components/VendorProfile";
import VendorOrders from "../components/VendorOrder";

export default function VendorDashboard({ setIsVendor }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [bookSet, setBookSet] = useState([]);

  // Fetch schools
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/book_set_detail/");
      const resData = await fetch("https://digiteach.pythonanywhere.com/vendor/");
      if (!res.ok) throw new Error("Failed to fetch schools");
      const result = await res.json();
      const resultData = await resData.json();
      // const currentSchool = result.data.find(
      //   (s) => s.id.toString() === schoolId
      // );
      console.log(resultData);
      setBookSet(result.data || []);
      setLoading(false)
    } catch (err) {
      console.error(err);
      setBookSet([]);
      setLoading(false)
    } finally {
      setLoading(false);
    }
  };

  console.log(bookSet, 'books Details')

  useEffect(() => {
    fetchVendors();
  }, []);

  // const handleLogout = async () => {
  //   const result = await Swal.fire({
  //     title: 'Logout',
  //     text: 'Are you sure you want to logout?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#dc2626',
  //     cancelButtonColor: '#6b7280',
  //     confirmButtonText: 'Yes, logout',
  //     cancelButtonText: 'Cancel'
  //   });

  //   if (result.isConfirmed) {
  //     localStorage.removeItem("isSchool");
  //     localStorage.removeItem("schoolId");
  //     setIsSchool(false);
  //     window.location.href = "/";
  //   }
  // };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isVendor");
    // setIsVendor(false);
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-48 bg-white text-black flex flex-col md:flex-shrink-0 border-r border-gray-200">
        <div className="flex items-center justify-center py-4 font-bold text-xl border-b border-red-500">
          DigiTeach
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {[{ name: "Dashboard", icon: FaTachometerAlt },
          // { name: "Jobs", icon: FaBriefcase },
          // { name: "Books", icon: FaBook },
          // { name: "Class Management", icon: FaSchool },
          { name: "Orders", icon: FaSchool },
          { name: "Profile", icon: FaUser }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left text-sm ${activeTab === tab.name
                ? "bg-red-600 text-white"
                : "hover:bg-red-600 hover:text-white"
                }`}
            >
              <tab.icon className="text-sm" /> {tab.name}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-red-600 rounded-lg text-red-500 hover:text-white w-full text-sm"
          >
            <FaSignOutAlt className="text-sm" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Top bar */}
        {/* <header className="flex justify-between items-center bg-white px-6 py-4 shadow">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-full text-sm"
            />
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header> */}

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white px-3 py-2 shadow-sm border-b border-gray-200 gap-2 md:gap-0">
          <h1 className="text-lg font-bold">{activeTab}</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-1 border rounded-full text-sm w-full"
              />
            </div>
            <div className="flex items-center gap-1">
              {/* <span className="font-medium text-sm">{school?.school_name || "Loading..."}</span> */}
              <img
                // src={getCurre()}
                alt="avatar"
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dashboard cards */}
        {/* <div className="grid grid-cols-4 gap-6 p-6">
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
        </div> */}
        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-2xl px-6 pt-5 font-bold text-gray-800">Posted Book Set List</h2> */}
        {/* <button
            onClick={() => navigate("/job-form")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
          >
            <FaEdit /> Post New Job
          </button> */}
        {/* </div> */}

        {/* Schools Table (your actual data) */}
        {/* {activeTab === "Book Set" && ( */}
        {activeTab == "Dashboard" && <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-5 pt-5">
            <h2 className="text-2xl md:text-2xl font-bold text-gray-800">Posted Book Set Detail List</h2>
            {/* <button
                      onClick={() => navigate("/book-set-form")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
                    >
                      <FaEdit /> Create Book Set
                    </button> */}
          </div>

          {loading ? (
            <p>Loading BooK Set...</p>
          ) : bookSet.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-gray-500 mb-4">No Book Set posted yet</p>
              {/* <button
                        onClick={() => navigate("/job-form")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Post Your First Book
                      </button> */}
            </div>
          ) : (
            <div className="overflow-x-auto px-5">
              <table className="min-w-full bg-white border rounded-lg text-sm md:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    {["ID", "Book Set Name", 'Book', "Class", "Academy Year"
                      //  "Actions"
                    ].map((h) => (
                      <th key={h} className="text-left px-4 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookSet.map((bookSetData, index) => (
                    <tr key={bookSetData.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{bookSetData.book_set_data.book_set_name || "N/A"}</td>
                      <td className="px-4 py-2">{bookSetData.book_detail.book_title || "N/A"}</td>
                      <td className="px-4 py-2">{bookSetData.book_set_data.class_detail_info?.class_name}</td>
                      <td className="px-4 py-2">{bookSetData.book_set_data.academic_year}</td>
                      {/* <td className="px-4 py-2">{bookData.class_name}</td> */}
                      {/* <td className="px-4 py-2">{bookData.class_name}</td> */}
                      {/* <td className="px-4 py-2">{bookData.job_type}</td> */}
                      {/* <td className="px-4 py-2">
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                  {job.status}
                                </span>
                              </td> */}
                      {/* <td className="px-4 py-2">{new Date(job.posted_date).toLocaleDateString()}</td> */}

                      {/* Applicants */}
                      {/* <td className="px-4 py-2">
                                {job.job_applicant_count > 0 ? (
                                  <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => {
                                      setSelectedJob(job);
                                      setShowApplicants(true);
                                    }}
                                  >
                                    {job.job_applicant_count} applicant{job.job_applicant_count !== 1 ? "s" : ""}
                                  </button>
                                ) : (
                                  <span className="text-gray-400">No applicants</span>
                                )}
                              </td> */}

                      {/* Actions */}
                      {/* <td className="px-4 py-2 flex justify-start gap-3"> */}
                      {/* <button
                                  className="text-blue-600 hover:text-blue-800 text-lg"
                                  onClick={() => {
                                    setSelectBook(bookData);
                                    setShowBookDetails(true);
                                  }}
                                >
                                  <FaEye />
                                </button> */}
                      {/* <button
                                  className="text-yellow-600 hover:text-yellow-800 text-lg"
                                  onClick={() => navigate(`/book-set-form/${bookSetData.id}`, { onSuccess: fetchVendors })}
                                >
                                  <FaEdit />
                                </button> */}
                      {/* <button
                                  className="text-red-600 hover:text-red-800 text-lg"
                                  onClick={async () => {
                                    const result = await Swal.fire({
                                      title: "Are you sure?",
                                      text: "Do you want to delete this book set?",
                                      icon: "warning",
                                      showCancelButton: true,
                                      confirmButtonColor: "#dc2626",
                                      cancelButtonColor: "#6b7280",
                                      confirmButtonText: "Yes, delete it!",
                                      cancelButtonText: "Cancel",
                                      reverseButtons: true,
                                      position: "center",
                                    });
      
                                    if (result.isConfirmed) {
                                      try {
                                        const res = await fetch(`https://digiteach.pythonanywhere.com/book_set/${bookSetData.id}/`, {
                                          method: "DELETE",
                                        });
                                        if (!res.ok) throw new Error("Failed to delete book set");
      
                                        await Swal.fire({
                                          title: "Deleted!",
                                          text: "book set deleted successfully.",
                                          icon: "success",
                                          confirmButtonColor: "#16a34a",
                                        });
                                        fetchVendors();
                                      } catch (err) {
                                        console.error(err);
                                        Swal.fire({
                                          icon: "error",
                                          title: "Failed",
                                          text: "Could not delete book set",
                                          confirmButtonColor: "#dc2626",
                                        });
                                      }
                                    }
                                  }}
                                >
                                  <FaTrash />
                                </button> */}
                      {/* </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>}
        {/* // )} */}

        {activeTab === "Profile" && (
          <VendorProfile />
        )}

        {
          activeTab == "Orders" && (
            <VendorOrders />
          )
        }
      </div>


      {/* Modal for School Details */}
      {selectedVendors && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-2/3 rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedSchool(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">School Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>ID:</strong> {selectedSchool.id}</p>
              <p><strong>School Name:</strong> {selectedSchool.school_name}</p>
              <p><strong>Email:</strong> {selectedSchool.school_email}</p>
              <p><strong>Contact Person:</strong> {selectedSchool.contact_person_name}</p>
              <p><strong>Contact Number:</strong> {selectedSchool.contact_number}</p>
              <p><strong>Designation:</strong> {selectedSchool.designation_data?.name}</p>
              <p><strong>City:</strong> {selectedSchool.city}</p>
              <p><strong>District:</strong> {selectedSchool.district}</p>
              <p><strong>Address Line 1:</strong> {selectedSchool.address_line_1}</p>
              <p><strong>Address Line 2:</strong> {selectedSchool.address_line_2}</p>
              <p><strong>Landmark:</strong> {selectedSchool.landmark}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={selectedSchool.is_active ? "text-green-600" : "text-red-600"}>
                  {selectedSchool.is_active ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleStatusChange(selectedSchool.id, true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange(selectedSchool.id, false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
