import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';

const Profile = ({ therapist }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: therapist.name || '',
    email: therapist.email || '',
    password: '',
    photo: therapist.profilePic || 'null',
    address: therapist.address || '',
    specialization: therapist.specialization || '',
    experience: therapist.experience || '',
    education: therapist.education || '',
    aboutDesc: therapist.description.about || '',
    educationDesc: therapist.description.education || '',
    experienceDesc: therapist.description.experience || '',
    specializationDesc: therapist.description.specialization || '',
    dob: therapist.dateOfBirth || '',
    phoneNumber: therapist.phoneNumber || '',
    username: therapist.username || '',
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

      // Append all form data
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }

      // Append the selected file
      if (selectedFile) {
        dataToSend.append('profilePic', selectedFile);
      }

      const config = {
        method: 'PUT',
        body: dataToSend,
      };

      const response = await fetch(`http://localhost:3500/therapists/${therapist.therapistId}`, config);
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
            placeholder="Enter Changed password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
          />
        </div>
        <div className="mb-5 flex items-center gap-3">
          <div className="relative w-[160px] h-[50px]">
            <input
              type="file"
              name="photo"
              id="customerFile"
              onChange={handleFileInputChange}
              accept=".jpg, .png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customerFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.45rem] py-[0.375rem] text-[20px] leading-8 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Education"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="about-description" className="text-textColor font-bold block mb-2">
            About
          </label>
          <textarea
            id="about-description"
            value={formData.aboutDesc}
            onChange={(e) => setFormData({ ...formData, aboutDesc: e.target.value })}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer resize-none"
          ></textarea>
        </div>
        <div className="mb-5">
          <label htmlFor="specialization-description" className="text-textColor font-bold block mb-2">
            Specialization
          </label>
          <textarea
            id="specialization-description"
            value={formData.specializationDesc}
            onChange={(e) => setFormData({ ...formData, specializationDesc: e.target.value })}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer resize-none"
          ></textarea>
        </div>
        <div className="mb-5">
          <label htmlFor="experience-description" className="text-textColor font-bold block mb-2">
            Experience
          </label>
          <textarea
            id="experience-description"
            value={formData.experienceDesc}
            onChange={(e) => setFormData({ ...formData, experienceDesc: e.target.value })}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer resize-none"
          ></textarea>
        </div>
        <div className="mb-5">
          <label htmlFor="education-description" className="text-textColor font-bold block mb-2">
            Education
          </label>
          <textarea
            id="education-description"
            value={formData.educationDesc}
            onChange={(e) => setFormData({ ...formData, educationDesc: e.target.value })}
            className="w-full pr-3 px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-leadingColor placeholder:text-textColor rounded-md cursor-pointer resize-none"
          ></textarea>
        </div>
        <div className="mt-7">
          <button type="submit" className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg  py-3">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
