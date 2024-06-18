// CustomerAndCrisisSupportForm.js

import React, { useState } from 'react';

const CustomerAndCrisisSupportForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    dateOfBirth: '',
    phoneNumber: '',
    profilePic: null,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', formData.username);
      formData.append('password', formData.password);
      formData.append('email', formData.email);
      formData.append('name', formData.name);
      formData.append('dateOfBirth', formData.dateOfBirth);
      formData.append('phoneNumber', formData.phoneNumber);
      formData.append('profilePic', formData.profilePic);

      const response = await fetch('http://localhost:3500/customerAndCrisisSupport', {
        method: 'POST',
        body: formData,
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
          profilePic: null,
        });
        setErrorMessage('');
      } else if (response.status === 400) {
        // Missing required fields
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      } else if (response.status === 409) {
        // User with the same username/email already exists
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      } else {
        // Other server errors
        setErrorMessage('Failed to create customer and crisis support employee');
      }
    } catch (error) {
      console.error('Error creating customer and crisis support employee:', error.message);
      setErrorMessage('Failed to create customer and crisis support employee');
    }
  };

  return (
    <div>
      <h2>Register Customer and Crisis Support Employee</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
        <input type="file" name="profilePic" onChange={(e) => setFormData({ ...formData, profilePic: e.target.files[0] })} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CustomerAndCrisisSupportForm;
