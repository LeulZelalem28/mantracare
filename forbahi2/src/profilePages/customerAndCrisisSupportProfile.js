import React, { useState, useEffect } from 'react';

const CustomerAndCrisisSupportProfile = ({ supportId }) => {
  const [support, setSupport] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSupport = async () => {
      try {
        const response = await fetch(`http://localhost:3500/customerAndCrisisSupport/${supportId}`);
        if (response.ok) {
          const data = await response.json();
          setSupport(data);
        } else if (response.status === 404) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'Customer and Crisis Support not found');
        } else if (response.status === 400) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'ID parameter is required');
        } else {
          setErrorMessage('Failed to fetch customer and crisis support');
        }
      } catch (error) {
        console.error('Error fetching customer and crisis support:', error.message);
        setErrorMessage('Failed to fetch customer and crisis support');
      }
    };
    fetchSupport();
  }, [supportId]);

  return (
    <div>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : support ? (
        <div>
          <h2>Customer and Crisis Support Information</h2>
          <p>User ID: {support.userId}</p>
          <p>Username: {support.username}</p>
          <p>Password: {support.password}</p>
          <p>Email: {support.email}</p>
          <p>Name: {support.name}</p>
          <p>Date of Birth: {support.dateOfBirth}</p>
          <p>Phone Number: {support.phoneNumber}</p>
          <p>Registration Date: {support.registrationDate}</p>
          <p>Profile Picture: {support.profilePic}</p>
          <p>Customer Support ID: {support.customerSupportId}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default CustomerAndCrisisSupportProfile;
