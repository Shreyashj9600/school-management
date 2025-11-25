
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SchoolSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    school_name: "",
    school_email: "",
    contact_person_name: "",
    contact_number: "",
    designation_data: "",
    school_address: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    district: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://digiteach.pythonanywhere.com/school/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error:", errData);
        let errorMessage = "Failed to create school";
        if (errData.detail) {
          errorMessage = errData.detail;
        } else if (typeof errData === "object") {
          errorMessage = Object.values(errData).flat().join("\n");
        }
        throw new Error(errorMessage);
      }

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Success!",
        text: "School created successfully! Waiting for admin approval.",
        showConfirmButton: true,
        confirmButtonColor: "#2563eb",
      });
      navigate("/admin-dashboard");
    } catch (err) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: err.message || "An error occurred while creating the school",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100  px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white px-8 py-4 rounded-lg shadow-lg space-y-4"
      >
        <h2 className="text-3xl font-semibold text-red-600 text-center">
          School Signup
        </h2>

        {/* Inputs */}
        {[
          { name: "school_name", placeholder: "School Name", type: "text", required: true },
          { name: "school_email", placeholder: "School Email", type: "email", required: true },
          { name: "contact_person_name", placeholder: "Contact Person Name", type: "text", required: true },
          { name: "contact_number", placeholder: "Contact Number", type: "text", required: true },

        ].map((fld) => (
          <input
            key={fld.name}
            type={fld.type}
            name={fld.name}
            placeholder={fld.placeholder}
            value={form[fld.name]}
            onChange={handleChange}
            className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required={fld.required}
          />
        ))}

        <select
          name="designation_data"
          value={form.designation_data}
          onChange={handleChange}
          className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        >
          <option value="">Select Designation</option>
          <option value="1">IT Head</option>
          <option value="2">Principal</option>
          <option value="3">Teacher</option>
        </select>

        {/* More address / location inputs */}
        {[
          { name: "school_address", placeholder: "School Address", required: true },
          { name: "address_line_1", placeholder: "Address Line 1" },
          { name: "address_line_2", placeholder: "Address Line 2" },
          { name: "landmark", placeholder: "Landmark" },
          { name: "city", placeholder: "City", required: true },
          { name: "district", placeholder: "District", required: true },
        ].map((fld) => (
          <input
            key={fld.name}
            type="text"
            name={fld.name}
            placeholder={fld.placeholder}
            value={form[fld.name]}
            onChange={handleChange}
            className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required={fld.required}
          />
        ))}

        <button
          type="submit"
          className="w-full bg-red-600 text-gray-900 font-semibold p-3 rounded  transition duration-150"
        >
          Sign Up
        </button>

        <div className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/school-login")}
            className="text-red-600 hover:underline"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
