import React, { useState, useEffect } from 'react';

const TherapistPage = ({ therapistId }) => {
  const [therapist, setTherapist] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const response = await fetch(`http://localhost:3500/therapists/${therapistId}`);
        if (response.ok) {
          const data = await response.json();
          setTherapist(data);
        } else if (response.status === 404) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'Therapist not found or not approved');
        } else if (response.status === 400) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'ID parameter is required');
        } else {
          setErrorMessage('Failed to fetch therapist');
        }
      } catch (error) {
        console.error('Error fetching therapist:', error.message);
        setErrorMessage('Failed to fetch therapist');
      }
    };

    const fetchSchedule = async () => {
      try {
        const response = await fetch(`http://localhost:3500/schedule/therapist/${therapistId}`);
        if (response.ok) {
          const data = await response.json();
          setSchedule(data);
        } else if (response.status === 404) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'Schedule not found');
        } else if (response.status === 400) {
          const errorMessage = await response.json();
          setErrorMessage(errorMessage.message || 'ID parameter is required');
        } else {
          setErrorMessage('Failed to fetch schedule');
        }
      } catch (error) {
        console.error('Error fetching schedule:', error.message);
        setErrorMessage('Failed to fetch schedule');
      }
    };

    fetchTherapist();
    fetchSchedule();
  }, [therapistId]);

  return (
    <div>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : therapist && schedule ? (
        <div>
          <h2>Therapist Information</h2>
          <p>User ID: {therapist.userId}</p>
          <p>Username: {therapist.username}</p>
          <p>Email: {therapist.email}</p>
          <p>Name: {therapist.name}</p>
          <p>Date of Birth: {therapist.dateOfBirth}</p>
          <p>Phone Number: {therapist.phoneNumber}</p>
          <p>Registration Date: {therapist.registrationDate}</p>
          <p>Profile Picture: {therapist.profilePic}</p>
          <p>Therapist ID: {therapist.therapistId}</p>
          <p>Role: {therapist.role}</p>
          <h3>About</h3>
          <p>{therapist.description?.about}</p>
          <h3>Specialization</h3>
          <p>{therapist.description?.specialization}</p>
          <h3>Experience</h3>
          <p>{therapist.description?.experience}</p>
          <h3>Education</h3>
          <p>{therapist.description?.education}</p>
          <h2>Schedule</h2>
          <h3>One-on-One Availability</h3>
          <ul>
            {schedule.oneOnOneAvailability.map(slot => (
              <li key={slot.day}>
                <strong>{slot.day}</strong>: {slot.timeSlots.join(', ')}
              </li>
            ))}
          </ul>
          <h3>Group Availability</h3>
          <ul>
            {schedule.groupAvailability.map(slot => (
              <li key={slot.day}>
                <strong>{slot.title}</strong> - {slot.day}: {slot.timeSlots.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TherapistPage;
