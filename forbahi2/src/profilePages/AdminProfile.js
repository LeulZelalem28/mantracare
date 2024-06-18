import React, { useState, useEffect } from 'react';

const AdministratorProfile = ({ adminId }) => {
  const [administrator, setAdministrator] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAdministrator = async () => {
      try {
        const response = await fetch(`http://localhost:3500/administrators/${adminId}`);
        if (response.ok) {
          const data = await response.json();
          setAdministrator(data);
        } else if (response.status === 404) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'Administrator not found');
        } else if (response.status === 400) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'ID parameter is required');
        } else {
          setErrorMessage('Failed to fetch administrator');
        }
      } catch (error) {
        console.error('Error fetching administrator:', error.message);
        setErrorMessage('Failed to fetch administrator');
      }
    };
    fetchAdministrator();
  }, [adminId]);

  return (
    <div>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : administrator ? (
        <div>
          <h2>Administrator Information</h2>
          <p>User ID: {administrator.userId}</p>
          <p>Username: {administrator.username}</p>
          <p>Password: {administrator.password}</p>
          <p>Email: {administrator.email}</p>
          <p>Name: {administrator.name}</p>
          <p>Date of Birth: {administrator.dateOfBirth}</p>
          <p>Phone Number: {administrator.phoneNumber}</p>
          <p>Registration Date: {administrator.registrationDate}</p>
          <p>Profile Picture: {administrator.profilePic}</p>
          <p>Admin ID: {administrator.adminId}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AdministratorProfile;
