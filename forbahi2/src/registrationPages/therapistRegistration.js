// TherapistRegistrationForm.js

import React, { useState } from 'react';

const TherapistRegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    specialization: '',
    experience: '',
    education: '',
    description: '',
    profilePic: null,
    educationCertificate: null,
    license: null,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataObj.append(key, value);
        }
      });

      const response = await fetch('http://localhost:3500/therapists', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.status === 201) {
        // Success
        setFormData({
          username: '',
          password: '',
          email: '',
          name: '',
          dateOfBirth: '',
          phoneNumber: '',
          address: '',
          specialization: '',
          experience: '',
          education: '',
          description: '',
          profilePic: null,
          educationCertificate: null,
          license: null,
        });
        setErrorMessage('');
      } else if (response.status === 400 || response.status === 409) {
        // Missing required fields or duplicate user
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      } else {
        // Other server errors
        setErrorMessage('Failed to create therapist');
      }
    } catch (error) {
      console.error('Error creating therapist:', error.message);
      setErrorMessage('Failed to create therapist');
    }
  };

  return (
    <div>
      <h2>Therapist Registration</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
        </label>
        <label>
          Phone Number:
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </label>
        <label>
          Specialization:
          <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} />
        </label>
        <label>
          Experience:
          <input type="text" name="experience" value={formData.experience} onChange={handleChange} />
        </label>
        <label>
          Education:
          <input type="text" name="education" value={formData.education} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </label>
        <label>
          Profile Picture:
          <input type="file" name="profilePic" onChange={handleFileChange} />
        </label>
        <label>
          Education Certificate:
          <input type="file" name="educationCertificate" onChange={handleFileChange} />
        </label>
        <label>
          License:
          <input type="file" name="license" onChange={handleFileChange} />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default TherapistRegistrationForm;
