// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// export default function SchoolProtectedRoute({ children }) {
//   const [loading, setLoading] = useState(true);
//   const [allowed, setAllowed] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const isSchool = localStorage.getItem("isSchool");
//       const schoolId = localStorage.getItem("schoolId");

//       if (!isSchool || !schoolId) {
//         setAllowed(false);
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(`https://digiteach.pythonanywhere.com/school/${schoolId}/`);
//         const school = await res.json();

//         if (school.is_active) {
//           setAllowed(true);
//         } else {
//           setAllowed(false);
//           localStorage.removeItem("isSchool");
//           localStorage.removeItem("schoolId");
//         }
//       } catch (err) {
//         setAllowed(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (loading) return <p className="text-center mt-10">Checking access...</p>;

//   return allowed ? children : <Navigate to="/school-login" replace />;
// }
import React from 'react'

const SchoolProtectedRoute = () => {
  return (
    <div>SchoolProtectedRoute</div>
  )
}

export default SchoolProtectedRoute