import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VendorLogin({ setIsVendor }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // contact_number
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
 
   if (email === "vendor@gmail.com" && password === "vendor123") {
      setIsVendor(true);
      localStorage.setItem("isVendor", "true");
      navigate("/vendor-dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Vendor Login</h2>
        <input
          type="email"
          placeholder="Vendor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password (Contact Number)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
          Login
        </button>
      </form>
    </div>
  );
}
