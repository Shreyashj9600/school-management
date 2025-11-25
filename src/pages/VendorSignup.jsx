// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const VendorSignUp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     vendor_name: '',
//     vendor_mobile: '',
//     vendor_email: '',
//     vendor_pass: '',
//     vendor_companey_name: '',
//     vendor_website: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.vendor_name.trim()) {
//       newErrors.vendor_name = 'Vendor name is required';
//     }
    
//     if (!formData.vendor_mobile) {
//       newErrors.vendor_mobile = 'Mobile number is required';
//     } else if (!/^\d{10}$/.test(formData.vendor_mobile)) {
//       newErrors.vendor_mobile = 'Please enter a valid 10-digit mobile number';
//     }
    
//     if (!formData.vendor_email) {
//       newErrors.vendor_email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vendor_email)) {
//       newErrors.vendor_email = 'Please enter a valid email address';
//     }
    
//     if (!formData.vendor_pass) {
//       newErrors.vendor_pass = 'Password is required';
//     } else if (formData.vendor_pass.length < 6) {
//       newErrors.vendor_pass = 'Password must be at least 6 characters long';
//     }
    
//     if (!formData.vendor_companey_name.trim()) {
//       newErrors.vendor_companey_name = 'Company name is required';
//     }
    
//     if (formData.vendor_website && !/^https?:\/\//.test(formData.vendor_website)) {
//       newErrors.vendor_website = 'Please enter a valid URL (include http:// or https://)';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: null,
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       const response = await axios.post('https://digiteach.pythonanywhere.com/vendor/', {
//         ...formData,
//         vendor_mobile: parseInt(formData.vendor_mobile, 10),
//       });
      
//       if (response.status === 201) {
//         toast.success('Vendor registered successfully!');
//         // Redirect to login or dashboard after successful registration
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error('Error registering vendor:', error);
//       const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-red-600">
//             Vendor Registration
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Create your vendor account
//           </p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="vendor_name" className="block text-sm font-medium text-gray-700">
//                 Full Name *
//               </label>
//               <input
//                 id="vendor_name"
//                 name="vendor_name"
//                 type="text"
//                 required
//                 className={`mt-1 block w-full px-3 py-2 border ${errors.vendor_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500`}
//                 placeholder="John Doe"
//                 value={formData.vendor_name}
//                 onChange={handleChange}
//               />
//               {errors.vendor_name && (
//                 <p className="mt-1 text-sm text-red-600">{errors.vendor_name}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="vendor_mobile" className="block text-sm font-medium text-gray-700">
//                 Mobile Number *
//               </label>
//               <input
//                 id="vendor_mobile"
//                 name="vendor_mobile"
//                 type="tel"
//                 required
//                 className={`mt-1 block w-full px-3 py-2 border ${errors.vendor_mobile ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500`}
//                 placeholder="9876543210"
//                 value={formData.vendor_mobile}
//                 onChange={handleChange}
//               />
//               {errors.vendor_mobile && (
//                 <p className="mt-1 text-sm text-red-600">{errors.vendor_mobile}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="vendor_email" className="block text-sm font-medium text-gray-700">
//                 Email Address *
//               </label>
//               <input
//                 id="vendor_email"
//                 name="vendor_email"
//                 type="email"
//                 required
//                 className={`mt-1 block w-full px-3 py-2 border ${errors.vendor_email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500`}
//                 placeholder="you@example.com"
//                 value={formData.vendor_email}
//                 onChange={handleChange}
//               />
//               {errors.vendor_email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.vendor_email}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="vendor_pass" className="block text-sm font-medium text-gray-700">
//                 Password *
//               </label>
//               <input
//                 id="vendor_pass"
//                 name="vendor_pass"
//                 type="password"
//                 required
//                 className={`mt-1 block w-full px-3 py-2 border ${errors.vendor_pass ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500`}
//                 placeholder="••••••••"
//                 value={formData.vendor_pass}
//                 onChange={handleChange}
//               />
//               {errors.vendor_pass && (
//                 <p className="mt-1 text-sm text-red-600">{errors.vendor_pass}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="vendor_companey_name" className="block text-sm font-medium text-gray-700">
//                 Company Name *
//               </label>
//               <input
//                 id="vendor_companey_name"
//                 name="vendor_companey_name"
//                 type="text"
//                 required
//                 className={`mt-1 block w-full px-3 py-2 border ${errors.vendor_companey_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500`}
//                 placeholder="ABC Pvt. Ltd."
//                 value={formData.vendor_companey_name}
//                 onChange={handleChange}
//               />
//               {errors.vendor_companey_name && (
//                 <p className="mt-1 text-sm text-red-600">{errors.vendor_companey_name}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="vendor_website" className="block text-sm font-medium text-gray-700">
//                 Company Website
//               </label>
//               <input
//                 id="vendor_website"
//                 name="vendor_website"
//                 type="url"
//                 className={`mt-1 block w-full px-3 py-2 border ${errors.vendor_website ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500`}
//                 placeholder="https://www.example.com"
//                 value={formData.vendor_website}
//                 onChange={handleChange}
//               />
//               {errors.vendor_website && (
//                 <p className="mt-1 text-sm text-red-600">{errors.vendor_website}</p>
//               )}
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Registering...' : 'Register'}
//             </button>
//           </div>
//         </form>
        
//         <div className="text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <button
//               onClick={() => navigate('/login')}
//               className="font-medium text-red-600  focus:outline-none"
//             >
//               Sign in
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VendorSignUp;   


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VendorSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vendor_name: '',
    vendor_mobile: '',
    vendor_email: '',
    vendor_pass: '',
    vendor_companey_name: '',
    vendor_website: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vendor_name.trim()) newErrors.vendor_name = 'Vendor name is required';
    if (!/^\d{10}$/.test(formData.vendor_mobile))
      newErrors.vendor_mobile = 'Please enter a valid 10-digit mobile number';
    if (!formData.vendor_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vendor_email))
      newErrors.vendor_email = 'Please enter a valid email address';
    if (formData.vendor_pass.length < 6)
      newErrors.vendor_pass = 'Password must be at least 6 characters long';
    if (!formData.vendor_companey_name.trim())
      newErrors.vendor_companey_name = 'Company name is required';
    if (formData.vendor_website && !/^https?:\/\//.test(formData.vendor_website))
      newErrors.vendor_website = 'Please enter a valid URL (include http:// or https://)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;     
    setIsSubmitting(true);

    try {
      const response = await axios.post('https://digiteach.pythonanywhere.com/vendor/', {
        ...formData,
        vendor_mobile: parseInt(formData.vendor_mobile, 10),
      });

      if (response.status === 201) {
        // ✅ Show popup
        setShowPopup(true);
        // Redirect after 3 seconds 
        setTimeout(() => {
          setShowPopup(false);
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Error registering vendor:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

      {/* ✅ Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in w-80">
            <div className="text-green-600 text-5xl mb-3">✔</div>
            <h2 className="text-lg font-semibold text-gray-800">
              Successfully Registered!
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Please wait for admin approval...
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">
          Vendor Registration
        </h2>
        <p className="text-center text-gray-500 mb-6">Create your vendor account</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              name="vendor_name"
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.vendor_name ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              value={formData.vendor_name}
              onChange={handleChange}
            />
            {errors.vendor_name && (
              <p className="text-sm text-red-600">{errors.vendor_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
            <input
              name="vendor_mobile"
              type="tel"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.vendor_mobile ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              value={formData.vendor_mobile}
              onChange={handleChange}
            />
            {errors.vendor_mobile && (
              <p className="text-sm text-red-600">{errors.vendor_mobile}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address *</label>
            <input
              name="vendor_email"
              type="email"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.vendor_email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              value={formData.vendor_email}
              onChange={handleChange}
            />
            {errors.vendor_email && (
              <p className="text-sm text-red-600">{errors.vendor_email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input
              name="vendor_pass"
              type="password"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.vendor_pass ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              value={formData.vendor_pass}
              onChange={handleChange}
            />
            {errors.vendor_pass && (
              <p className="text-sm text-red-600">{errors.vendor_pass}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name *</label>
            <input
              name="vendor_companey_name"
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.vendor_companey_name ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              value={formData.vendor_companey_name}
              onChange={handleChange}
            />
            {errors.vendor_companey_name && (
              <p className="text-sm text-red-600">{errors.vendor_companey_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Website</label>
            <input
              name="vendor_website"
              type="url"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.vendor_website ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              value={formData.vendor_website}
              onChange={handleChange}
            />
            {errors.vendor_website && (
              <p className="text-sm text-red-600">{errors.vendor_website}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none disabled:opacity-60"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-red-600 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default VendorSignUp;
