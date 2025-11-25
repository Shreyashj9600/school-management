import { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaUser,
  FaSignOutAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaPlus,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaBook,
  FaStore,
  FaSchool
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Books from '../components/Books';
import parse from "html-react-parser"
import { FaBookBookmark } from "react-icons/fa6";
import Classes from "../components/Classes";
import BookSet from "../components/BookSet";



export default function SchoolDashboard({ setIsSchool }) {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "Dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [books, setBooks] = useState([]);

  // School Board Details State
  const [schoolBoardDetails, setSchoolBoardDetails] = useState([]);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [boardEditData, setBoardEditData] = useState({});
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [showBoardForm, setShowBoardForm] = useState(false);

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [bookSet, setBookSet] = useState([]);

  // show vendor list 
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);


  // Social Links State
  const [showSocialLinks, setShowSocialLinks] = useState(false);

  const schoolId = localStorage.getItem("schoolId");
  const navigate = useNavigate();

  // Fetch school profile
  const fetchSchoolProfile = async () => {
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/school/");
      if (!res.ok) throw new Error("Failed to fetch schools");
      const result = await res.json();
      const currentSchool = result.data.find(
        (s) => s.id.toString() === schoolId
      );
      setSchool(currentSchool || null);
      setEditData(currentSchool || {});
    } catch (err) {
      console.error(err);
      setSchool(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch("https://digiteach.pythonanywhere.com/books/");
      if (!response.ok) throw new Error("Failed to fetch books");
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        setBooks(result.data);
      } else if (Array.isArray(result)) {
        setBooks(result);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      Swal.fire("Error", "Failed to load books. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

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

  // Fetch school board details
  const fetchSchoolBoardDetails = async () => {
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/school_board_detail/");
      if (!res.ok) throw new Error("Failed to fetch school board details");
      const result = await res.json();

      // Find all board details for current school
      const currentSchoolBoardDetails = result.data?.filter(
        (detail) => detail.school_data?.id?.toString() === schoolId
      ) || [];

      setSchoolBoardDetails(currentSchoolBoardDetails);

    } catch (err) {
      console.error(err);
      setSchoolBoardDetails([]);
    }
  };

  // Initialize empty board form
  const initializeBoardForm = () => {
    setBoardEditData({
      school_data: parseInt(schoolId),
      board: "",
      register_number: "",
      udisc_code: "",
      preschool: "no",
      nursery: "no",
      JKG: "no",
      SKG: "no",
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
      class_12: "no"
    });
    setEditingBoardId(null);
    setIsEditingBoard(true);
    setShowBoardForm(true);
  };

  // Fetch jobs and applicants
  const fetchJobs = async () => {
    if (!schoolId) return;
    setIsLoadingJobs(true);

    try {
      const [jobsResponse, teachersResponse] = await Promise.all([
        fetch("https://digiteach.pythonanywhere.com/job/"),
        fetch("https://digiteach.pythonanywhere.com/teacher/")
      ]);

      if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
      if (!teachersResponse.ok) throw new Error("Failed to fetch teachers");

      const jobsData = await jobsResponse.json();
      const teachersData = await teachersResponse.json();

      const schoolJobs = jobsData.data.filter(
        (job) => job.school_data?.id.toString() === schoolId
      );

      const schoolJobsOpen = jobsData.data.filter(
        (job) => job.school_data?.id.toString() === schoolId && job.status === "open"
      );

      // console.log("School Jobs:", schoolJobsOpen);

      // Count applicants per job based on subject
      const jobsWithApplicantCount = schoolJobs.map((job) => {
        const subject = job.subject.split(',')[0].trim();
        const matchingTeachers = teachersData.data.filter(teacher =>
          teacher.subjects?.some(s => s.toLowerCase().includes(subject.toLowerCase()))
        );
        return {
          ...job,
          job_applicant_count: matchingTeachers.length,
          matching_teachers: matchingTeachers
        };
      });

      setJobs(jobsWithApplicantCount);
    } catch (error) {
      console.error(error);
      setJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const fetchBookSet = async () => {
    try {
      const response = await fetch("https://digiteach.pythonanywhere.com/book_set/");
      const result = await response.json();
      if (Array.isArray(result)) {
        setBookSet(result);
      } else if (Array.isArray(result.data)) {
        setBookSet(result.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    if (schoolId) {
      fetchSchoolProfile();
      fetchSchoolBoardDetails();

      if (activeTab === "Dashboard" || activeTab === "Jobs") {
        fetchJobs()
        fetchBooks()
        fetchClasses()
        fetchBookSet()
        fetchVendors()
      }
    }
  }, [schoolId, activeTab]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      localStorage.removeItem("isSchool");
      localStorage.removeItem("schoolId");
      setIsSchool(false);
      window.location.href = "/";
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Reset to original data when canceling
      setEditData(school || {});
    }
    setIsEditing(!isEditing);
  };

  const handleEditBoard = (boardDetail) => {
    setBoardEditData(boardDetail);
    setEditingBoardId(boardDetail.id);
    setIsEditingBoard(true);
    setShowBoardForm(true);
  };

  const cancelBoardEdit = () => {
    setBoardEditData({});
    setEditingBoardId(null);
    setIsEditingBoard(false);
    setShowBoardForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleBoardChange = (e) => {
    const { name, value } = e.target;
    setBoardEditData({ ...boardEditData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const previewUrl = ev.target.result;
        setEditData({
          ...editData,
          school_logo: file,
          preview_logo: previewUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Append all basic fields
      const fields = [
        'school_name', 'school_email', 'contact_person_name', 'contact_number',
        'address_line_1', 'address_line_2', 'city', 'district', 'landmark',
        'webiste', 'facebook', 'instagram', 'linkedin'
      ];

      fields.forEach(field => {
        if (editData[field] !== undefined) {
          formData.append(field, editData[field]);
        }
      });

      // Handle logo file
      if (editData.school_logo instanceof File) {
        formData.append('school_logo', editData.school_logo);
      }

      // Handle designation if it exists
      if (editData.designation_data?.id) {
        formData.append('designation', editData.designation_data.id);
      }

      console.log('Sending update request...');

      const res = await fetch(
        `https://digiteach.pythonanywhere.com/school/${schoolId}/`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log('Update successful:', responseData);

      // Update local state
      setSchool(responseData);
      setEditData(responseData);
      setIsEditing(false);

      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your school profile has been updated successfully.',
        confirmButtonColor: '#2563eb',
      });

      // Refresh data from server
      fetchSchoolProfile();

    } catch (err) {
      console.error('Update failed:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || 'Failed to update profile. Please check the console for details.',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleBoardSave = async () => {
    try {
      console.log('Saving board details:', boardEditData);

      let res;
      if (editingBoardId) {
        // Update existing board details
        res = await fetch(
          `https://digiteach.pythonanywhere.com/school_board_detail/${editingBoardId}/`,
          {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardEditData),
          }
        );
      } else {
        // Create new board details
        res = await fetch(
          "https://digiteach.pythonanywhere.com/school_board_detail/",
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardEditData),
          }
        );
      }

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log('Board details saved successfully:', responseData);

      // Update local state
      setIsEditingBoard(false);
      setShowBoardForm(false);
      setBoardEditData({});
      setEditingBoardId(null);

      await Swal.fire({
        icon: 'success',
        title: editingBoardId ? 'Board Details Updated!' : 'Board Details Added!',
        text: `Your school board details have been ${editingBoardId ? 'updated' : 'added'} successfully.`,
        confirmButtonColor: '#2563eb',
      });

      // Refresh board details from server
      fetchSchoolBoardDetails();

    } catch (err) {
      console.error('Board details update failed:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || 'Failed to update board details. Please check the console for details.',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleDeleteBoardDetails = async (boardId) => {
    const result = await Swal.fire({
      title: 'Delete Board Details?',
      text: 'Are you sure you want to delete these board details?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `https://digiteach.pythonanywhere.com/school_board_detail/${boardId}/`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok) throw new Error("Failed to delete board details");

        // Remove from local state
        setSchoolBoardDetails(prev => prev.filter(board => board.id !== boardId));

        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Board details have been deleted successfully.',
          confirmButtonColor: '#16a34a',
        });
      } catch (err) {
        console.error('Delete failed:', err);
        await Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete board details.',
          confirmButtonColor: '#dc2626',
        });
      }
    }
  };

  const handleApplicantAction = async (job, teacher, status) => {
    try {
      await Swal.fire({
        position: "center",
        icon: status === "accepted" ? "success" : "error",
        title: `Applicant ${status === "accepted" ? "Accepted" : "Rejected"}!`,
        html: `
          <p><b>${teacher.name}</b> has been <b>${status}</b> 
          for the job <b>${job.job_title}</b>.</p>
        `,
        confirmButtonColor: status === "accepted" ? "#16a34a" : "#dc2626",
      });
    } catch (error) {
      console.error("Failed to update applicant:", error);
    }
  };

  const getCurrentLogo = () => {
    if (isEditing && editData.preview_logo) {
      return editData.preview_logo;
    }
    if (school?.school_logo && !school.school_logo.startsWith("http")) {
      return `https://digiteach.pythonanywhere.com${school.school_logo}`;
    }
    return school?.school_logo || "https://i.pravatar.cc/32";
  };

  // Class options for board details
  const classOptions = [
    { key: 'preschool', label: 'Preschool' },
    { key: 'nursery', label: 'Nursery' },
    { key: 'JKG', label: 'Junior KG' },
    { key: 'SKG', label: 'Senior KG' },
    { key: 'class_1', label: 'Class 1' },
    { key: 'class_2', label: 'Class 2' },
    { key: 'class_3', label: 'Class 3' },
    { key: 'class_4', label: 'Class 4' },
    { key: 'class_5', label: 'Class 5' },
    { key: 'class_6', label: 'Class 6' },
    { key: 'class_7', label: 'Class 7' },
    { key: 'class_8', label: 'Class 8' },
    { key: 'class_9', label: 'Class 9' },
    { key: 'class_10', label: 'Class 10' },
    { key: 'class_11', label: 'Class 11' },
    { key: 'class_12', label: 'Class 12' }
  ];

  // Social media platforms
  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
    { key: 'instagram', label: 'Instagram', icon: FaInstagram, color: 'text-pink-600' },
    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-700' }
  ];

  // fetch for vendors list show 
  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const res = await fetch("https://adminapi.digiteachindia.com/vendor/");
      const data = await res.json();
      setVendors(data?.data || []);
      // console.log('show wendor data', data)
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoadingVendors(false);
    }

    // Add data vender to myvender api
    const fetchVendors = async () => {
      const res = await fetch("https://adminapi.digiteachindia.com/vendor/");
      const data = await res.json();
      return data;
    };  

  };
  const addToMyVendor = async (vendor) => {
    console.log("vendor data ", vendor)
    const res = await fetch("https://adminapi.digiteachindia.com/myvendor/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendor: vendor.id, // or required fields
        vendor_name: vendor.vendor_name,
        phone: vendor.vendor_mobile,
        email: vendor.vendor_email
      }),
    });

    const data = await res.json();
    console.log("Saved:", data);
  };



  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-48 bg-white text-black flex flex-col md:flex-shrink-0 border-r border-gray-200">
        <div className="flex items-center justify-center py-4 font-bold text-xl border-b border-red-500">
          DigiTeach
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {[{ name: "Dashboard", icon: FaTachometerAlt },
          { name: "Jobs", icon: FaBriefcase },
          { name: "Books", icon: FaBook },
          { name: "Class Management", icon: FaSchool },
          { name: "Book Set", icon: FaBookBookmark },
          { name: "Vendors", icon: FaStore },
          { name: "Profile", icon: FaUser }].map((tab) => (
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
      <div className="flex-1 flex mt-4 flex-col overflow-hidden">
        {/* Top Bar */}
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
              <span className="font-medium text-sm">{school?.school_name || "Loading..."}</span>
              <img
                src={getCurrentLogo()}
                alt="avatar"
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* {console.log("Rendering content for tab:", activeTab)} */}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* Dashboard Tab */}
          {activeTab === "Dashboard" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {loading ? <p className="text-sm">Loading...</p> : !school ? <p className="text-sm">No school data found</p> : (
                <>
                  <div onClick={() => setActiveTab("Jobs")} className="bg-white cursor-pointer rounded-lg shadow p-3 flex flex-col justify-between hover:shadow-md transition">
                    <p className="text-gray-500 text-lg">Jobs</p>
                    <p className={`font-bold text-lg text-yellow-600`}>
                      {jobs.length} Posted
                    </p>
                  </div>
                  <div onClick={() => setActiveTab("Books")} className="bg-gradient-to-r from-red-100 to-red-200 rounded-lg cursor-pointer shadow p-3 hover:shadow-md transition">
                    <p className="text-gray-500 text-lg">Books Published</p>
                    <p className="mt-5 font-bold text-sm">{books.length}</p>
                    {/* <p className=" text-gray-600 text-xs">{school.contact_person_name}</p> */}
                  </div>
                  <div onClick={() => setActiveTab("Class Management")} className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg cursor-pointer shadow p-3 hover:shadow-md transition">
                    <p className="text-gray-500 text-lg">Classes Created</p>
                    <p className="mt-5 font-bold text-sm">{classes.length}</p>
                    {/* <p className="mt-1 text-gray-600 text-xs truncate">{school.address_line_1}, {school.address_line_2}, {school.landmark}</p> */}
                  </div>
                  <div onClick={() => setActiveTab("Book Set")} className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg cursor-pointer shadow p-3 hover:shadow-md transition">
                    <p className="text-gray-500 text-lg">Book Set</p>
                    <p className="mt-5 font-bold text-sm truncate">{bookSet.length}</p>
                    {/* <p className="mt-1 text-gray-600 text-xs">Mobile: {school.contact_number}</p> */}
                    {/* <p className="mt-0.5 text-gray-600 text-xs">Designation: {school.designation_data?.name}</p> */}
                  </div>
                </>
              )}
            </div>
          )}








          {/* vendor Tab */}






          {activeTab === "Vendors" && (
            <div className="p-3">
              <h2 className="text-lg font-semibold mb-3">Vendors List</h2>

              {loadingVendors ? (
                <p className="text-sm text-gray-600">Loading...</p>
              ) : vendors.length === 0 ? (
                <p className="text-sm text-gray-600">No vendors found</p>
              ) : (
                <div className="w-full h-full p-4">
                  <div className="w-full h-full overflow-x-auto">
                    <table className="w-full min-w-full bg-white shadow-md rounded-xl overflow-hidden block md:table">

                      {/* Table Head */}
                      <thead className="hidden md:table-header-group bg-gray-100 border-b">
                        <tr>
                          <th className="py-3 px-5 text-left text-gray-700 font-semibold">Vendor Name</th>
                          <th className="py-3 px-5 text-left text-gray-700 font-semibold">Mobile</th>
                          <th className="py-3 px-5 text-left text-gray-700 font-semibold">Email</th>
                        </tr>
                      </thead>

                      {/* Table Body */}
                      <tbody className="block md:table-row-group">
                        {vendors.map((vendor, index) => (
                          <tr
                            key={vendor.id}
                            className={`
        block md:table-row 
        border md:border-0 
        rounded-lg md:rounded-none  
        mb-4 md:mb-0 
        transition 
        ${index % 2 === 0 ? "bg-gray-50 md:bg-white" : "bg-white md:bg-gray-50"}
        hover:bg-gray-100
      `}
                          >
                            {/* Vendor Name */}
                            <td className="py-3 px-5 block md:table-cell">
                              <span className="md:hidden font-semibold text-gray-600">Vendor Name: </span>
                              <span className="font-semibold text-gray-800">
                                {vendor.vendor_name || "Unnamed Vendor"}
                              </span>
                            </td>

                            {/* Mobile */}
                            <td className="py-3 px-5 block md:table-cell">
                              <span className="md:hidden font-semibold text-gray-600">Mobile: </span>
                              {vendor.vendor_mobile || "N/A"}
                            </td>

                            {/* Email */}
                            <td className="py-3 px-5 block md:table-cell max-w-[250px] truncate">
                              <span className="md:hidden font-semibold text-gray-600 ">Email: </span>
                              {vendor.vendor_email || "N/A"}
                            </td>

                            {/* Add Vendor Button */}
                            <td className="py-3 px-5 block md:table-cell text-right">
                              <button
                                onClick={() => addToMyVendor(vendor)}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                              >
                                + Add
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>
              )}
            </div>
          )}









          {/* Profile Tab */}
          {activeTab === "Profile" && (
            <div className="space-y-3">
              {/* School Profile Section */}
              <div className="bg-white rounded-lg shadow p-3 space-y-3">
                {loading || !school ? (
                  <p className="text-sm">Loading profile...</p>
                ) : (
                  <>
                    {/* Header with Logo + Edit Button */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                      <div className="relative">
                        <img
                          src={getCurrentLogo()}
                          alt="profile"
                          className="w-16 h-16 rounded-full border-2 border-yellow-500 shadow object-cover"
                        />

                        {isEditing && (
                          <label className="absolute bottom-0 right-0 bg-yellow-600 text-white rounded-full p-1 cursor-pointer hover:bg-yellow-700">
                            <FaEdit className="text-xs" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-800">
                          {isEditing ? (
                            <input
                              type="text"
                              name="school_name"
                              value={editData.school_name || ""}
                              onChange={handleChange}
                              className="border p-1 rounded text-sm w-full"
                            />
                          ) : (
                            school.school_name
                          )}
                        </p>
                      </div>

                      <button
                        onClick={toggleEdit}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-1 text-sm"
                      >
                        <FaEdit className="text-xs" /> {isEditing ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {[
                        { key: "school_name", label: "School Name", editable: true },
                        { key: "school_email", label: "School Email", editable: true },
                        { key: "contact_person_name", label: "Contact Person", editable: true },
                        { key: "contact_number", label: "Contact Number", editable: true },
                        { key: "designation_data", label: "Designation", editable: false },
                        { key: "address_line_1", label: "Address Line 1", editable: true },
                        { key: "address_line_2", label: "Address Line 2", editable: true },
                        { key: "city", label: "City", editable: true },
                        { key: "district", label: "District", editable: true },
                        { key: "landmark", label: "Landmark", editable: true },
                        { key: "webiste", label: "webiste", editable: true },
                        { key: "location", label: "location", editable: false },
                      ].map(({ key, label, editable }) => (
                        <div
                          key={key}
                          className="bg-gray-50 p-2 rounded-lg shadow hover:shadow-sm transition"
                        >
                          <p className="text-gray-500 text-xs">{label}</p>
                          {isEditing && editable ? (
                            <input
                              type="text"
                              name={key}
                              value={editData[key] || ""}
                              onChange={handleChange}
                              className="mt-0.5 p-1 w-full border rounded text-sm"
                            />
                          ) : (
                            <p className="font-semibold text-sm truncate">
                              {key === "designation_data"
                                ? school.designation_data?.name
                                : school[key] || "N/A"}
                            </p>
                          )}
                        </div>
                      ))}

                      {/* Social Links Section */}
                      <div className="bg-gray-50 p-2 rounded-lg shadow hover:shadow-sm transition col-span-full">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setShowSocialLinks(!showSocialLinks)}
                        >
                          <p className="text-gray-500 text-xs">Social Links</p>
                          <span className="text-gray-400 text-xs">
                            {showSocialLinks ? '▲' : '▼'}
                          </span>
                        </div>

                        {showSocialLinks ? (
                          <div className="mt-2 space-y-2">
                            {socialPlatforms.map(({ key, label, icon: Icon, color }) => (
                              <div key={key} className="flex flex-col">
                                <label className="text-gray-400 text-xs flex items-center gap-1">
                                  <Icon className={`text-xs ${color}`} />
                                  {label}
                                </label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name={key}
                                    value={editData[key] || ""}
                                    onChange={handleChange}
                                    className="mt-0.5 p-1 w-full border rounded text-sm"
                                    placeholder={`Enter ${label} URL`}
                                  />
                                ) : (
                                  <p className="font-semibold text-sm truncate mt-1">
                                    {school[key] || "N/A"}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-1 space-y-1">
                            {socialPlatforms.map(({ key, label, icon: Icon, color }) => (
                              school[key] && (
                                <div key={key} className="flex items-center gap-2">
                                  <Icon className={`text-xs ${color}`} />
                                  <p className="font-semibold text-sm truncate">
                                    {school[key]}
                                  </p>
                                </div>
                              )
                            ))}
                            {!socialPlatforms.some(({ key }) => school[key]) && (
                              <p className="font-semibold text-sm text-gray-400">No social links added</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-2">
                        <button
                          onClick={handleSave}
                          className="bg-yellow-600 text-black px-4 py-1 rounded-lg hover:bg-yellow-700 transition text-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* School Board Details Section */}
              <div className="bg-white rounded-lg shadow p-3 space-y-3">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800">School Board Details</h3>
                  <button
                    onClick={initializeBoardForm}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                  >
                    <FaPlus className="text-xs" /> Add New Board
                  </button>
                </div>

                {/* Board Details List */}
                {schoolBoardDetails.length > 0 ? (
                  <div className="space-y-3">
                    {schoolBoardDetails.map((boardDetail, index) => (
                      <div key={boardDetail.id} className="bg-gray-50 rounded-lg p-3 border">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                          <h4 className="font-semibold text-gray-800">
                            Board #{index + 1}: {boardDetail.board || "Unnamed Board"}
                          </h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBoard(boardDetail)}
                              className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 flex items-center gap-1 text-xs"
                            >
                              <FaEdit className="text-xs" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBoardDetails(boardDetail.id)}
                              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center gap-1 text-xs"
                            >
                              <FaTrash className="text-xs" /> Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                          <div className="bg-white p-2 rounded">
                            <p className="text-gray-500 text-xs">Board</p>
                            <p className="font-semibold text-sm">{boardDetail.board || "N/A"}</p>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <p className="text-gray-500 text-xs">Register Number</p>
                            <p className="font-semibold text-sm">{boardDetail.register_number || "N/A"}</p>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <p className="text-gray-500 text-xs">UDISE Code</p>
                            <p className="font-semibold text-sm">{boardDetail.udisc_code || "N/A"}</p>
                          </div>
                        </div>

                        <div className="bg-white p-2 rounded">
                          <p className="text-gray-500 text-xs mb-2">Classes Offered</p>
                          <div className="flex flex-wrap gap-1">
                            {classOptions
                              .filter(({ key }) => boardDetail[key] === "yes")
                              .map(({ key, label }) => (
                                <span
                                  key={key}
                                  className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                                >
                                  {label}
                                </span>
                              ))}
                            {classOptions.filter(({ key }) => boardDetail[key] === "yes").length === 0 && (
                              <span className="text-gray-400 text-xs">No classes specified</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No board details added yet.</p>
                    <p className="text-gray-400 text-xs mt-1">Click "Add New Board" to add your school's board information.</p>
                  </div>
                )}

                {/* Board Form Modal */}
                {showBoardForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between p-3 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">
                          {editingBoardId ? 'Edit Board Details' : 'Add New Board Details'}
                        </h2>
                        <button
                          onClick={cancelBoardEdit}
                          className="text-gray-500 hover:text-gray-800"
                        >
                          <FaTimes size={18} />
                        </button>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <p className="text-gray-500 text-xs">Board *</p>
                            <input
                              type="text"
                              name="board"
                              value={boardEditData.board || ""}
                              onChange={handleBoardChange}
                              className="mt-0.5 p-1 w-full border rounded text-sm"
                              placeholder="e.g., CBSE, ICSE, State Board"
                              required
                            />
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <p className="text-gray-500 text-xs">Register Number</p>
                            <input
                              type="text"
                              name="register_number"
                              value={boardEditData.register_number || ""}
                              onChange={handleBoardChange}
                              className="mt-0.5 p-1 w-full border rounded text-sm"
                            />
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <p className="text-gray-500 text-xs">UDISE Code</p>
                            <input
                              type="text"
                              name="udisc_code"
                              value={boardEditData.udisc_code || ""}
                              onChange={handleBoardChange}
                              className="mt-0.5 p-1 w-full border rounded text-sm"
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-xs mb-2">Classes Offered</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {classOptions.map(({ key, label }) => (
                              <div key={key} className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  id={key}
                                  checked={boardEditData[key] === "yes"}
                                  onChange={(e) => {
                                    setBoardEditData({
                                      ...boardEditData,
                                      school_data: parseInt(schoolId),
                                      [key]: e.target.checked ? "yes" : "no"
                                    });
                                  }}
                                  className="w-3 h-3"
                                />
                                <label htmlFor={key} className="text-xs text-gray-700">
                                  {label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={cancelBoardEdit}
                            className="bg-gray-500 text-white px-4 py-1 rounded-lg hover:bg-gray-600 transition text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleBoardSave}
                            className="bg-yellow-600 text-black px-4 py-1 rounded-lg hover:bg-yellow-700 transition text-sm"
                            disabled={!boardEditData.board}
                          >
                            {editingBoardId ? 'Update Board' : 'Save Board'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Books Tab */}
          {activeTab === "Books" && (
            <div className="space-y-3">
              {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">School Books</h2>
              </div> */}
              <Books schoolId={schoolId} fetchBooks={fetchBooks} books={books} />
            </div>
          )}

          {activeTab === "Class Management" && (
            <div className="space-y-3">
              <Classes schoolId={schoolId} fetchClasses={fetchClasses} classes={classes} />
            </div>
          )}

          {
            activeTab === "Book Set" && (
              <div className="space-y-3">
                <BookSet schoolId={schoolId} fetchBookSet={fetchBookSet} bookSet={bookSet} />
              </div>
            )
          }

          {/* Jobs Tab */}
          {activeTab === "Jobs" && (
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Posted Jobs List</h2>
                <button
                  onClick={() => navigate("/job-form")}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                >
                  <FaPlus className="text-xs" /> Post New Job
                </button>
              </div>

              {isLoadingJobs ? (
                <p className="text-sm">Loading jobs...</p>
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-3 text-center">
                  <p className="text-gray-500 text-sm mb-2">No jobs posted yet</p>
                  <button
                    onClick={() => navigate("/job-form")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border rounded-lg text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        {["ID", "Title", "Subject", "Experience", "Qualification", "Type", "Status", "Posted", "Applications", "Actions"].map((h) => (
                          <th key={h} className="text-left px-2 py-4 text-[15px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-4">{idx + 1}</td>
                          <td className="px-2 py-4 text-sm">{job.job_title}</td>
                          <td className="px-2 py-1 text-sm">{job.subject}</td>
                          <td className="px-2 py-1 text-sm">{job.experience_required}</td>
                          <td className="px-2 py-1 text-sm">{job.qualification}</td>
                          <td className="px-2 py-1 text-sm">{job.job_type}</td>
                          <td className="px-2 py-1">
                            <span className={`text-sm font-medium px-3 py-2 rounded-full ${job.status === "Open" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-2 py-1 text-sm">{new Date(job.posted_date).toLocaleDateString()}</td>
                          <td className="px-2 py-1 text-sm">
                            {job.job_applicant_count > 0 ? (
                              <button
                                className="text-red-500 hover:underline text-sm"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setShowApplicants(true);
                                }}
                              >
                                {job.job_applicant_count} applicant{job.job_applicant_count !== 1 ? "s" : ""}
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">No applicants</span>
                            )}
                          </td>
                          <td className="px-2 py-1 flex justify-center gap-1">
                            <button
                              className="text-black text-lg mr-2"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowJobDetails(true);
                              }}
                            >
                              <FaEye />
                            </button>
                            <button
                              className="text-yellow-600 hover:text-yellow-800 text-lg mr-2"
                              onClick={() => navigate(`/job-form/${job.id}`)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 text-lg"
                              onClick={async () => {
                                const result = await Swal.fire({
                                  title: "Are you sure?",
                                  text: "Do you want to delete this job?",
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
                                    const res = await fetch(`https://digiteach.pythonanywhere.com/job/${job.id}/`, {
                                      method: "DELETE",
                                    });
                                    if (!res.ok) throw new Error("Failed to delete job");

                                    await Swal.fire({
                                      title: "Deleted!",
                                      text: "Job deleted successfully.",
                                      icon: "success",
                                      confirmButtonColor: "#16a34a",
                                    });
                                    fetchJobs();
                                  } catch (err) {
                                    console.error(err);
                                    Swal.fire({
                                      icon: "error",
                                      title: "Failed",
                                      text: "Could not delete job",
                                      confirmButtonColor: "#dc2626",
                                    });
                                  }
                                }
                              }}
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
          )}
        </div>
      </div>

      {/* Rest of the modals remain the same */}
      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Job Details</h2>
              <button
                onClick={() => setShowJobDetails(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-3 overflow-x-auto">
              <table className="w-full border border-gray-200 text-xs text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-2 py-1 border">Title</th>
                    <th className="px-2 py-1 border">Subject</th>
                    <th className="px-2 py-1 border">Qualification</th>
                    <th className="px-2 py-1 border">Experience</th>
                    <th className="px-2 py-1 border">Type</th>
                    <th className="px-2 py-1 border">Salary</th>
                    <th className="px-2 py-1 border">Location</th>
                    <th className="px-2 py-1 border">Status</th>
                    <th className="px-2 py-1 border">Posted</th>
                    <th className="px-2 py-1 border">Last Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-800">
                    <td className="px-2 py-1 border">{selectedJob.job_title || "N/A"}</td>
                    <td className="px-2 py-1 border">{selectedJob.subject || "N/A"}</td>
                    <td className="px-2 py-1 border">{selectedJob.qualification || "N/A"}</td>
                    <td className="px-2 py-1 border">{selectedJob.experience_required || "N/A"}</td>
                    <td className="px-2 py-1 border">{selectedJob.job_type || "N/A"}</td>
                    <td className="px-2 py-1 border">
                      {selectedJob.salary_range?.join(", ") || "Not specified"}
                    </td>
                    <td className="px-2 py-1 border">{selectedJob.location || "N/A"}</td>
                    <td className="px-2 py-1 border">{selectedJob.status || "N/A"}</td>
                    <td className="px-2 py-1 border">
                      {selectedJob.posted_date
                        ? new Date(selectedJob.posted_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {selectedJob.last_date_to_apply
                        ? new Date(selectedJob.last_date_to_apply).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {selectedJob.job_description && (
                <div className="mt-3">
                  <h3 className="text-sm font-semibold mb-1">Job Description</h3>
                  <p className="text-gray-700 whitespace-pre-line text-xs">
                    {parse(selectedJob.job_description)}
                  </p>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-700 space-y-2">
                <p>
                  <strong>Applicant Count:</strong>{" "}
                  {selectedJob.job_applicant_count ?? "0"}
                </p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {selectedJob.skills?.length > 0
                    ? selectedJob.skills.join(", ")
                    : "N/A"}
                </p>
                <p>
                  <strong>Responsibilities:</strong>{" "}
                  {selectedJob.responsibilities?.length > 0
                    ? selectedJob.responsibilities.join(", ")
                    : "N/A"}
                </p>
                <p>
                  <strong>Class Name:</strong>{" "}
                  {selectedJob.class_name?.length > 0
                    ? selectedJob.class_name.join(", ")
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 text-right">
              <button
                onClick={() => setShowJobDetails(false)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicants && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[80vh] overflow-y-auto p-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Applicants List for {selectedJob.job_title}
              </h2>
              <button
                onClick={() => setShowApplicants(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg shadow flex items-center gap-1 text-sm"
              >
                <FaTimes /> Close
              </button>
            </div>

            {!selectedTeacher ? (
              <>
                {selectedJob.matching_teachers?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          {["ID", "Name", "Job Title", "Phone", "Subjects", "Experience", "Resume", "Actions"].map((head) => (
                            <th key={head} className="text-left px-2 py-1">
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedJob.matching_teachers.map((teacher, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="px-2 py-1">{idx + 1}</td>
                            <td className="px-2 py-1">{teacher.full_name}</td>
                            <td className="px-2 py-1">{teacher.job_title ? (teacher.job_title) : <span className="text-gray-400">N/A</span>}</td>
                            <td className="px-2 py-1">{teacher.mobile}</td>
                            <td className="px-2 py-1">{teacher.subjects?.join(", ")}</td>
                            <td className="px-2 py-1 text-center">{teacher.experience}</td>

                            <td className="px-2 py-1 text-center">
                              {teacher.resume_url ? (
                                <a
                                  href={
                                    teacher.resume_url.startsWith("http")
                                      ? teacher.resume_url
                                      : `https://digiteach.pythonanywhere.com${teacher.resume_url}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-red-600 hover:underline text-xs"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">N/A</span>
                              )}
                            </td>
                            <td className="px-2 py-1">
                              <div className="flex gap-1">
                                <button
                                  className="text-black text-sm"
                                  onClick={() => setSelectedTeacher(teacher)}
                                >
                                  <FaEye />
                                </button>

                                <button
                                  className="bg-yellow-600 text-white px-2 py-0.5 rounded hover:bg-yellow-700 text-xs"
                                  onClick={() => handleApplicantAction(selectedJob, teacher, "accepted")}
                                >
                                  Accept
                                </button>
                                <button
                                  className="bg-red-600 text-white px-2 py-0.5 rounded hover:bg-red-700 text-xs"
                                  onClick={() => handleApplicantAction(selectedJob, teacher, "rejected")}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-gray-500 text-sm">No applicants found.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-lg font-bold mb-2 text-gray-800">
                  {selectedTeacher.full_name || "N/A"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 text-xs">
                  <p><strong>ID:</strong> {selectedTeacher.teacher_id || "N/A"}</p>
                  <p><strong>Email:</strong> {selectedTeacher.email || "N/A"}</p>
                  <p><strong>Mobile:</strong> {selectedTeacher.mobile || "N/A"}</p>
                  <p><strong>DOB:</strong> {selectedTeacher.dob || "N/A"}</p>
                  <p><strong>Gender:</strong> {selectedTeacher.gender || "N/A"}</p>
                  <p><strong>Job Title:</strong> {selectedTeacher.job_title || "N/A"}</p>
                  <p><strong>Qualification:</strong> {selectedTeacher.qualification || "N/A"}</p>
                  <p><strong>Preferred Classes:</strong> {selectedTeacher.preferred_classes?.join(", ") || "N/A"}</p>
                  <p><strong>Subjects:</strong> {selectedTeacher.subjects?.join(", ") || "N/A"}</p>
                  <p><strong>Expected Salary:</strong> {selectedTeacher.expected_salary || "N/A"}</p>
                  <p><strong>Availability:</strong> {selectedTeacher.availability || "N/A"}</p>
                  <p><strong>Languages Known:</strong> {selectedTeacher.languages_known?.join(", ") || "N/A"}</p>
                  <p><strong>Skills:</strong> {selectedTeacher.skills?.join(", ") || "N/A"}</p>
                  <p><strong>Notice Period:</strong> {selectedTeacher.notice_period || "N/A"}</p>
                  <p><strong>Experience:</strong> {selectedTeacher.experience || "N/A"}</p>
                  <p><strong>Organization Name:</strong> {selectedTeacher.organization_name || "N/A"}</p>
                  <p><strong>Start Date:</strong> {selectedTeacher.start_date || "N/A"}</p>
                  <p><strong>End Date:</strong> {selectedTeacher.end_date || "N/A"}</p>
                  <p><strong>Currently Working:</strong> {selectedTeacher.present ? "Yes" : "No"}</p>
                  <p><strong>Created At:</strong> {selectedTeacher.created_at ? new Date(selectedTeacher.created_at).toLocaleString() : "N/A"}</p>
                  <p><strong>Status:</strong> {Array.isArray(selectedTeacher.status) ? selectedTeacher.status.join(", ") : selectedTeacher.status || "N/A"}</p>
                </div>

                <div className="mt-2 text-xs text-gray-700">
                  <p><strong>About:</strong> {selectedTeacher.about_you || "N/A"}</p>
                  <p><strong>Work History:</strong> {selectedTeacher.work_history || "N/A"}</p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {Object.keys(selectedTeacher.address || {}).length > 0
                      ? JSON.stringify(selectedTeacher.address)
                      : "N/A"}
                  </p>
                </div>

                <div className="mt-3 text-xs">
                  <p>
                    <strong>Resume:</strong>{" "}
                    {selectedTeacher.resume_url ? (
                      <a
                        href={
                          selectedTeacher.resume_url.startsWith("http")
                            ? selectedTeacher.resume_url
                            : `https://digiteach.pythonanywhere.com${selectedTeacher.resume_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>

                  {selectedTeacher.profile_image && (
                    <img
                      src={
                        selectedTeacher.profile_image.startsWith("http")
                          ? selectedTeacher.profile_image
                          : `https://digiteach.pythonanywhere.com${selectedTeacher.profile_image}`
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full mt-2 border"
                    />
                  )}

                  {selectedTeacher.youtube_link && (
                    <p className="mt-1">
                      <a
                        href={selectedTeacher.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:underline"
                      >
                        YouTube Channel
                      </a>
                    </p>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setSelectedTeacher(null)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-xs"
                  >
                    Back to Applicants
                  </button>
                  <button
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 text-xs"
                    onClick={() =>
                      handleApplicantAction(selectedJob, selectedTeacher, "accepted")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                    onClick={() =>
                      handleApplicantAction(selectedJob, selectedTeacher, "rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



