
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolLogin from "./pages/SchoolLogin";
import SchoolDashboard from "./pages/SchoolDashboard";
import SchoolSignup from "./pages/SchoolSignup";
import JobForm from "./pages/JobForm";
import JobApplicants from "./pages/JobApplicants";
import VendorSignUp from "./pages/VendorSignup";
import VendorDashboard from "./pages/VendorDashboard";
import VendorLogin from "./pages/VendorLogin";
import BookSetDetails from "./pages/BookSetDetails";


// Protected Route for Schools
function SchoolProtectedRoute({ children }) {
  const isSchool = localStorage.getItem("isSchool") === "true";
  return isSchool ? children : <Navigate to="/school-login" />;
}

// Protected Route for Admin
function AdminProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/" />;
}

function VendorProtectedRoute({ children }) {
  const isVendor = localStorage.getItem("isVendor") === "true";
  return isVendor ? children : <Navigate to="/" />;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSchool, setIsSchool] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") setIsAdmin(true);
    if (localStorage.getItem("isSchool") === "true") setIsSchool(true);
    if (localStorage.getItem("isVendor") === "true") setIsVendor(true);
  }, []);

  return (
    <Routes>
      {/* Admin login */}
      <Route path="/" element={<Login setIsAdmin={setIsAdmin} setIsVendor={setIsVendor} />} />
      <Route path="/jobs/:jobId/applicants" element={<JobApplicants setIsSchool={() => { }} />} />

      {/* Admin dashboard (protected) */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard setIsAdmin={setIsAdmin} />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/school-login"
        element={<SchoolLogin setIsSchool={setIsSchool} />}
      />

      {/* School dashboard (protected) */}
      <Route
        path="/school-dashboard"
        element={
          <SchoolProtectedRoute>
            <SchoolDashboard setIsSchool={setIsSchool} />
          </SchoolProtectedRoute>
        }
      />

      <Route
        path="/school-dashboard/:id?"
        element={
          <SchoolProtectedRoute>
            <BookSetDetails />
          </SchoolProtectedRoute>
        }
      />

      <Route
        path="/job-form/:id?"
        element={
          <SchoolProtectedRoute>
            <JobForm onSuccess={() => window.location.href = '/school-dashboard'} />
          </SchoolProtectedRoute>
        }
      />
      <Route
        path="/job-applicants/:jobId"
        element={
          <SchoolProtectedRoute>
            <JobApplicants setIsSchool={setIsSchool} />
          </SchoolProtectedRoute>
        }
      />
      {/* School signup */}
      <Route path="/school-signup" element={<SchoolSignup />} />
      <Route path="/vendor-signup" element={<VendorSignUp />} />
      <Route path="/vendor-dashboard" element={<VendorProtectedRoute><VendorDashboard /></VendorProtectedRoute>} />
      {/* <Route path="/login" element={<VendorLogin />} /> */}
    </Routes>
  );
}
