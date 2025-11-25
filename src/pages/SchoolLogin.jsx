// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function SchoolLogin({ setIsSchool }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState(""); // contact_number
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("https://digiteach.pythonanywhere.com/school/");
//       const result = await res.json();
//       const schools = Array.isArray(result.data) ? result.data : result;

//       const school = schools.find(
//         (s) => s.school_email === email && s.contact_number.toString() === password
//       );

//       if (school) {
//         if (!school.is_active) {
//           alert("Your account is not active. Please wait for Admin approval.");
//           return;
//         }
//         localStorage.setItem("isSchool", "true");
//         localStorage.setItem("schoolId", school.id);
//         setIsSchool(true);
//         navigate("/school-dashboard");
//       } else {
//         alert("Invalid credentials");
//       }
//     } catch (err) {
//       alert("Error logging in");
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-4"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">School Login</h2>
//         <input
//           type="email"
//           placeholder="School Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-3 border rounded-lg"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password (Contact Number)"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 border rounded-lg"
//           required
//         />
//         <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SchoolLogin({ setIsSchool }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // contact_number
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Fetch all schools
      const res = await axios.get("https://digiteach.pythonanywhere.com/school/");
      const result = res.data;
      const schools = Array.isArray(result.data) ? result.data : result;

      // Find the school with matching email and contact_number
      const school = schools.find(
        (s) => s.school_email === email && s.contact_number.toString() === password
      );

      if (school) {
        if (!school.is_active) {
          alert("Your account is not active. Please wait for Admin approval.");
          return;
        }

        // Save login info
        localStorage.setItem("isSchool", "true");
        localStorage.setItem("schoolId", school.id);
        setIsSchool(true);

        navigate("/school-dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error logging in");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white px-8 py-4 rounded-lg shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">School Login</h2>
        <input
          type="email"
          placeholder="School Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password (Contact Number)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <button className="w-full bg-red-600 text-white p-2 rounded-lg ">
          Login
        </button>
      </form>
    </div>
  );
}
