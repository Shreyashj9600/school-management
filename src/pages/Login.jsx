import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Login({ setIsAdmin, setIsVendor }) {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [userType, setUserType] = useState("admin"); // 'admin', 'vendor', or 'school'
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      if (userType === "admin") {
        // Admin login
        if (formData.username === "admin" && formData.password === "admin123") {
          setIsAdmin(true);
          localStorage.setItem("isAdmin", "true");
          navigate("/admin-dashboard");
        } else {
          throw new Error("Invalid admin credentials");
        }
      } else if (userType === "vendor") {
        // Vendor login

        if (formData.username === "vendor@gmail.com" && formData.password === "vendor123") {
          setIsVendor(true);
          localStorage.setItem("isVendor", "true");
          navigate("/vendor-dashboard");
        } else {
          alert("Invalid admin credentials");
        }

        // const response = await axios.post('https://digiteach.pythonanywhere.com/vendor/', {
        //   vendor_email: formData.username,
        //   vendor_pass: formData.password
        // });

        // if (response.data.success) {
          // localStorage.setItem('vendorToken', response.data.token);
          // localStorage.setItem('vendorId', response.data.vendor_id);
          // toast.success('Vendor login successful!');
          // navigate('/vendor-dashboard');
        // } else {
        //   throw new Error(response.data.message || 'Vendor login failed');
        // }
      } else if (userType === "school") {
        // School login - redirect to school login page
        navigate('/school-login');
        return;
      }
    } catch (error) {
      console.error(`${userType} login error:`, error);
      toast.error(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLoginButtonStyle = (type) => {
    return userType === type
      ? 'bg-white shadow-sm text-gray-900'
      : 'text-gray-600 hover:bg-gray-50';
  };

  const getSubmitButtonStyle = () => {
    switch (userType) {
      case 'admin':
        return 'bg-red-600 hover:bg-red-700';
      case 'vendor':
        return 'bg-red-600 hover:bg-red-700';
      case 'school':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-red-600 hover:bg-red-700';
    }
  };

  const getPlaceholderText = () => {
    switch (userType) {
      case 'admin':
        return 'Admin Username';
      case 'vendor':
        return 'Vendor Email';
      case 'school':
        return 'School Email';
      default:
        return 'Email';
    }
  };

  const getInputType = () => {
    return userType === 'admin' ? 'text' : 'email';
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">
          {userType.charAt(0).toUpperCase() + userType.slice(1)} Login
        </h2>

        {/* Three-way Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 space-x-1">
            {['admin', 'vendor', 'school'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getLoginButtonStyle(type)}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type={getInputType()}
              name="username"
              placeholder={getPlaceholderText()}
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${getSubmitButtonStyle()} text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50`}
          >
            {isLoading ? 'Logging in...' : `${userType === 'school' ? ' ' : ''}${userType.charAt(0).toUpperCase() + userType.slice(1)} Login`}
          </button>
        </form>

        {/* Signup Links */}
        <div className="mt-6 text-center space-y-4">
          {userType === 'vendor' && (
            <div className="text-sm text-gray-600">
              Don't have a vendor account?{' '}

              <button
                onClick={() => navigate("/vendor-signup")}
                className="font-medium text-red-600  focus:outline-none"
              >
                Sign up here
              </button>

            </div>
          )}

          {userType === 'school' && (
            <div className="text-sm text-gray-600">
              Don't have a school account?{' '}
              <button
                onClick={() => navigate("/school-signup")}
                className="font-medium text-red-600 focus:outline-none"
              >
                Sign up here
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
