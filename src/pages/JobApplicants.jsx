// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaFilePdf, FaSearch, FaEye, FaEnvelope, FaPhone, FaUserGraduate, FaBriefcase, FaMoneyBillWave, FaClock, FaCheck, FaTimes } from "react-icons/fa";

// export default function JobApplicants({ setIsSchool }) {
//   const { jobId } = useParams();
//   const navigate = useNavigate();
//   const [job, setJob] = useState(null);
//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [activeTab, setActiveTab] = useState("Applicants");
//   const [applicantStatus, setApplicantStatus] = useState({});
//   const [loadingStatus, setLoadingStatus] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Fetch job details
//         const jobRes = await fetch(`https://digiteach.pythonanywhere.com/job/`);
//         const jobData = await jobRes.json();
//         const currentJob = jobData.data.find(j => j.id.toString() === jobId);
//         setJob(currentJob);

//         // Fetch all teachers
//         const teacherRes = await fetch("https://digiteach.pythonanywhere.com/teacher/");
//         const teacherData = await teacherRes.json();

//         // Filter teachers based on job subject
//         if (currentJob) {
//           const subject = currentJob.subject.split(',')[0].trim().toLowerCase();
//           const filtered = teacherData.data.filter(teacher => 
//             teacher.subjects?.some(s => 
//               s.toLowerCase().includes(subject)
//             )
//           );
//           setApplicants(filtered);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [jobId]);

//   const filteredApplicants = applicants.filter(applicant => 
//     (applicant.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     applicant.qualification?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     applicant.experience?.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredApplicants.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo(0, 0);
//   };

//   const handleStatusChange = async (applicantId, status) => {
//     // Set loading state for this specific button
//     setLoadingStatus(prev => ({ ...prev, [applicantId]: true }));
    
//     try {
//       // Simulate API delay (remove this in production)
//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       // Update local state
//       setApplicantStatus(prev => ({
//         ...prev,
//         [applicantId]: status
//       }));

//       // Here you would make the actual API call
//       // await fetch(`https://digiteach.pythonanywhere.com/applications/${applicantId}/status/`, {
//       //   method: 'PATCH',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify({ status })
//       // });
      
//       console.log(`Applicant ${applicantId} status updated to: ${status}`);
//     } catch (error) {
//       console.error('Error updating applicant status:', error);
//       // Revert the status change on error
//       setApplicantStatus(prev => {
//         const newStatus = { ...prev };
//         delete newStatus[applicantId];
//         return newStatus;
//       });
//     } finally {
//       // Clear loading state
//       setLoadingStatus(prev => ({ ...prev, [applicantId]: false }));
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="p-6">
//         <p className="text-red-500">Job not found</p>
//       </div>
//     );
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("isSchool");
//     localStorage.removeItem("schoolId");
//     setIsSchool(false);
//     navigate("/school-login");
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-full md:w-64 bg-blue-700 text-white flex flex-col md:flex-shrink-0">
//         <div className="flex items-center justify-center py-6 font-bold text-2xl border-b border-blue-600">
//           DigiTeach
//         </div>
//         <nav className="flex-1 p-4 space-y-4">
//           <button
//             onClick={() => navigate('/school-dashboard')}
//             className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left bg-blue-600"
//           >
//             <FaArrowLeft /> Back to Dashboard
//           </button>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-4 py-2 hover:bg-red-600 rounded-lg text-red-300 hover:text-white w-full"
//           >
//             <FaArrowLeft /> Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 p-4 md:p-6">
//         {/* Top Bar */}
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white px-4 md:px-6 py-4 shadow rounded-lg mb-6 gap-4 md:gap-0">
//           <h1 className="text-2xl font-bold">Job Applicants</h1>
//           <div className="flex items-center gap-4">
//             <span className="font-medium">
//               {job.school_data?.contact_person_name || 'School Admin'}
//             </span>
//             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
//               {job.school_data?.contact_person_name?.charAt(0) || 'A'}
//             </div>
//           </div>
//         </header>
//       <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">{job.job_title}</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <p className="text-gray-500 text-sm mb-1">Subject</p>
//             <p className="font-medium text-lg">{job.subject}</p>
//           </div>
//           <div className="bg-green-50 p-4 rounded-lg">
//             <p className="text-gray-500 text-sm mb-1">Experience Required</p>
//             <p className="font-medium text-lg">{job.experience_required}</p>
//           </div>
//           <div className="bg-yellow-50 p-4 rounded-lg">
//             <p className="text-gray-500 text-sm mb-1">Job Type</p>
//             <p className="font-medium text-lg">{job.job_type}</p>
//           </div>
//           <div className="bg-purple-50 p-4 rounded-lg">
//             <p className="text-gray-500 text-sm mb-1">Total Applicants</p>
//             <p className="font-bold text-xl text-purple-600">{applicants.length}</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-4 border-b">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <h2 className="text-xl font-semibold text-gray-800">Applicants</h2>
//             <div className="relative flex-1 max-w-md">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by name, qualification, or experience..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         {filteredApplicants.length === 0 ? (
//           <div className="p-12 text-center text-gray-500">
//             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <FaUserGraduate className="text-gray-400 text-2xl" />
//             </div>
//             <p className="text-lg font-medium">
//               {searchTerm ? 'No matching applicants found.' : 'No applicants found for this job.'}
//             </p>
//             {!searchTerm && (
//               <p className="mt-1 text-sm text-gray-500">
//                 Check back later or share this job listing to attract more candidates.
//               </p>
//             )}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentItems.map((applicant) => (
//                   <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
//                           {applicant.full_name?.charAt(0) || '?'}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-base font-medium text-gray-900">
//                             {applicant.full_name || 'N/A'}
//                             {applicant.status === 'Active' && (
//                               <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                 Active
//                               </span>
//                             )}
//                           </div>
//                           <div className="text-sm text-gray-500 flex items-center mt-1">
//                             <FaEnvelope className="mr-1.5 text-gray-400" />
//                             {applicant.email || 'N/A'}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center text-sm text-gray-900">
//                         <FaPhone className="mr-1.5 text-gray-400 flex-shrink-0" />
//                         {applicant.mobile || 'N/A'}
//                       </div>
//                       {applicant.address?.city && (
//                         <div className="mt-1 text-sm text-gray-500">
//                           {applicant.address.city}, {applicant.address.state}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900 flex items-start">
//                         <FaUserGraduate className="mr-1.5 mt-0.5 text-gray-400 flex-shrink-0" />
//                         <span>{applicant.qualification || 'Not specified'}</span>
//                       </div>
//                       <div className="mt-1 flex flex-wrap gap-1">
//                         {applicant.subjects?.slice(0, 2).map((subject, idx) => (
//                           <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                             {subject}
//                           </span>
//                         ))}
//                         {applicant.subjects?.length > 2 && (
//                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
//                             +{applicant.subjects.length - 2} more
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center text-sm text-gray-900">
//                         <FaBriefcase className="mr-1.5 text-gray-400 flex-shrink-0" />
//                         {applicant.experience || 'Not specified'}
//                       </div>
//                       {applicant.expected_salary && (
//                         <div className="mt-1 flex items-center text-sm text-gray-500">
//                           <FaMoneyBillWave className="mr-1.5 text-gray-400 flex-shrink-0" />
//                           {applicant.expected_salary}
//                         </div>
//                       )}
//                       {applicant.availability && (
//                         <div className="mt-1 flex items-center text-sm text-gray-500">
//                           <FaClock className="mr-1.5 text-gray-400 flex-shrink-0" />
//                           {applicant.availability}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex justify-end space-x-3">
//                         {applicantStatus[applicant.id] === 'accepted' ? (
//                           <div className="relative group">
//                             <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-300 group-hover:duration-200 animate-tilt"></div>
//                             <span className="relative px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
//                               <FaCheck className="h-4 w-4" /> 
//                               <span className="whitespace-nowrap">Accepted</span>
//                             </span>
//                           </div>
//                         ) : applicantStatus[applicant.id] === 'rejected' ? (
//                           <div className="relative group">
//                             <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-rose-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-300 group-hover:duration-200 animate-tilt"></div>
//                             <span className="relative px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
//                               <FaTimes className="h-4 w-4" /> 
//                               <span className="whitespace-nowrap">Rejected</span>
//                             </span>
//                           </div>
//                         ) : (
//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() => handleStatusChange(applicant.id, 'accepted')}
//                               disabled={loadingStatus[applicant.id]}
//                               className={`relative group overflow-hidden px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 shadow-md
//                                 ${loadingStatus[applicant.id] 
//                                   ? 'bg-green-400 cursor-not-allowed' 
//                                   : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg transform hover:-translate-y-0.5'}
//                                 text-white`}
//                               title="Accept Applicant"
//                             >
//                               {loadingStatus[applicant.id] ? (
//                                 <>
//                                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                   </svg>
//                                   Accepting...
//                                 </>
//                               ) : (
//                                 <>
//                                   <FaCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
//                                   <span>Accept</span>
//                                 </>
//                               )}
//                             </button>
                            
//                             <button
//                               onClick={() => handleStatusChange(applicant.id, 'rejected')}
//                               disabled={loadingStatus[applicant.id]}
//                               className={`relative group overflow-hidden px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 shadow-md
//                                 ${loadingStatus[applicant.id] 
//                                   ? 'bg-red-400 cursor-not-allowed' 
//                                   : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 hover:shadow-lg transform hover:-translate-y-0.5'}
//                                 text-white`}
//                               title="Reject Applicant"
//                             >
//                               {loadingStatus[applicant.id] ? (
//                                 <>
//                                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                   </svg>
//                                   Rejecting...
//                                 </>
//                               ) : (
//                                 <>
//                                   <FaTimes className="h-4 w-4 group-hover:scale-110 transition-transform" />
//                                   <span>Reject</span>
//                                 </>
//                               )}
//                             </button>
//                           </div>
//                         )}
//                         <a
//                           href={applicant.resume_url ? `https://digiteach.pythonanywhere.com${applicant.resume_url}` : '#'}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md
//                             ${applicant.resume_url 
//                               ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white hover:shadow-lg transform hover:-translate-y-0.5' 
//                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
//                           `}
//                           title={applicant.resume_url ? 'View Resume' : 'No resume available'}
//                           onClick={(e) => !applicant.resume_url && e.preventDefault()}
//                         >
//                           <FaFilePdf className="h-4 w-4 group-hover:scale-110 transition-transform" />
//                           <span>Resume</span>
//                           {!applicant.resume_url && (
//                             <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
//                           )}
//                         </a>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
//             <div className="flex-1 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(indexOfLastItem, filteredApplicants.length)}
//                   </span>{' '}
//                   of <span className="font-medium">{filteredApplicants.length}</span> results
//                 </p>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={`relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
//                     currentPage === 1 
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   Previous
//                 </button>
//                 <div className="flex space-x-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => handlePageChange(pageNum)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className={`relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
//                     currentPage === totalPages 
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       </div>
//     </div>
//   );
// }
                                                  


  const JobApplicants = () => {     
    return (
      <div>     
      
      </div>   
    );
  }  
  export default JobApplicants;