import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';

const PatientProfile = ({ patient }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: patient.name || '',
    email: patient.email || '',
    password: '',
    photo: patient.profilePic || 'null',
    dateOfBirth: patient.dateOfBirth || '',
    phoneNumber: patient.phoneNumber || '',
    username: patient.username || '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file);
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const dataToSend = new FormData();

      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }

      if (selectedFile) {
        dataToSend.append('profilePic', selectedFile);
      }

      const config = {
        method: 'PUT',
        body: dataToSend,
      };

      const response = await fetch(`http://localhost:3500/patients/${patient.patientId}`, config);
      const data = await response.json();

      if (response.ok) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <ClipLoader color="#ffffff" loading={loading} size={150} />
        </div>
      )}
      <form onSubmit={submitHandler}>
        <div className="mb-5">
          <input
            type="name"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Date Of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            name="photo"
            onChange={handleFileInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
          />
        </div>
        <div className="mb-5">
          <button
            type="submit"
            className="w-full bg-primaryColor p-3 text-[16px] leading-7 rounded-md text-white hover:bg-[#0044cc] transition duration-300"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;
