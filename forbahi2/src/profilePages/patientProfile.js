import React, { useEffect, useState } from 'react';

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientId = "3de08f4e-0c10-42a9-8312-c74a698147d0";
        const response = await fetch(`http://localhost:3500/patients/${patientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        console.log("Fetched patient data:", data); // Log the fetched data

        setPatient(data);
        setProfilePicData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatient();
  }, []);

  const setProfilePicData = (data) => {
    if (data.profilePic) {
      console.log("Profile picture data:", data.profilePic); // Log profile picture data
      console.log("Type of profilePic.data:", typeof data.profilePic.data); // Log the type of profilePic.data

      if (typeof data.profilePic.data === 'string') {
        const base64Image = `data:${data.profilePic.contentType};base64,${data.profilePic.data}`;
        console.log("Base64 image string (string):", base64Image); // Log the base64 string
        setProfilePic(base64Image);
      } else if (data.profilePic.data instanceof ArrayBuffer) {
        const base64Image = `data:${data.profilePic.contentType};base64,${arrayBufferToBase64(data.profilePic.data)}`;
        console.log("Base64 image string (buffer):", base64Image); // Log the base64 string
        setProfilePic(base64Image);
      } else {
        console.error("Unknown type of profilePic.data:", data.profilePic.data);
      }
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    console.log("Buffer data:", buffer); // Log the buffer data
    let binary = '';
    const bytes = new Uint8Array(buffer);
    console.log('hoo', bytes)
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    console.log('hi', binary)
    return window.btoa(binary);
  };

  return (
    <div>
      <h1>Patient Profile</h1>
      {patient ? (
        <div>
          <div>
            <label>Username:</label>
            <p>{patient.username}</p>
          </div>
          <div>
            <label>Email:</label>
            <p>{patient.email}</p>
          </div>
          <div>
            <label>Name:</label>
            <p>{patient.name}</p>
          </div>
          <div>
            <label>Date of Birth:</label>
            <p>{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <label>Phone Number:</label>
            <p>{patient.phoneNumber}</p>
          </div>
          <div>
            <label>Profile Picture:</label>
            {profilePic ? (
              <img src={profilePic} alt="Profile" width="100" />
            ) : (
              <p>No profile picture available</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PatientProfile;
