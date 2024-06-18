import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerSupportPage';

const CreateCustomerPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    dateOfBirth: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('username', formData.username);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('dateOfBirth', formData.dateOfBirth);
    formDataToSubmit.append('phoneNumber', formData.phoneNumber);

    try {
      const response = await fetch('http://localhost:3500/customerAndCrisisSupport', {
        method: 'POST',
        body: formDataToSubmit,
      });
      console.log(response.status)
      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      toast.success('Customer created successfully');

    } catch (error) {
      toast.error('Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-cus">
      <ToastContainer />
      <h2>Create Customer Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="admin-create-cus-form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-cus-form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-cus-form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-cus-form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-cus-form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-cus-form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="admin-create-cus-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Customer'}
        </button>
      </form>
    </div>
  );
};

export default CreateCustomerPage;
