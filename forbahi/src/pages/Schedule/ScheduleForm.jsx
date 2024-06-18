
import React, { useState } from 'react';
import './ScheduleForm.css';

const ScheduleForm = (accessToken) => {
  const [therapistId, setTherapistId] = useState('');
  const [oneOnOneAvailability, setOneOnOneAvailability] = useState([
    { day: '', timeSlots: [{ start: '', end: '' }] }
  ]);
  const [groupAvailability, setGroupAvailability] = useState([
    { title: '', sessionLocation: '', day: '', timeSlots: [{ start: '', end: '' }] }
  ]);

  const timeOptions = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatTimeSlots = (slots) => 
      slots.map(slot => `${slot.start} - ${slot.end}`);

    const formattedOneOnOne = oneOnOneAvailability.map(avail => ({
      day: avail.day,
      timeSlots: formatTimeSlots(avail.timeSlots)
    }));

    const formattedGroup = groupAvailability.map(avail => ({
      title: avail.title,
      sessionLocation: avail.sessionLocation,
      day: avail.day,
      timeSlots: formatTimeSlots(avail.timeSlots)
    }));

    const scheduleData = {
      therapistId,
      oneOnOneAvailability: formattedOneOnOne,
      groupAvailability: formattedGroup
    };

    try {
      const response = await fetch('/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert('Failed to create schedule: ' + result.message);
      }
    } catch (error) {
      alert('Failed to create schedule');
      console.error('Error:', error);
    }
  };

  const handleOneOnOneChange = (index, field, value) => {
    const newAvailability = [...oneOnOneAvailability];
    newAvailability[index][field] = value;
    setOneOnOneAvailability(newAvailability);
  };

  const handleOneOnOneSlotChange = (availabilityIndex, slotIndex, field, value) => {
    const newAvailability = [...oneOnOneAvailability];
    newAvailability[availabilityIndex].timeSlots[slotIndex][field] = value;
    setOneOnOneAvailability(newAvailability);
  };

  const handleGroupChange = (index, field, value) => {
    const newAvailability = [...groupAvailability];
    newAvailability[index][field] = value;
    setGroupAvailability(newAvailability);
  };

  const handleGroupSlotChange = (availabilityIndex, slotIndex, field, value) => {
    const newAvailability = [...groupAvailability];
    newAvailability[availabilityIndex].timeSlots[slotIndex][field] = value;
    setGroupAvailability(newAvailability);
  };

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <h1>Create Schedule</h1>

      <label>Therapist ID:</label>
      <input
        type="text"
        value={therapistId}
        onChange={(e) => setTherapistId(e.target.value)}
        required
      />

      <h2>One-on-One Availability</h2>
      {oneOnOneAvailability.map((availability, availabilityIndex) => (
        <div key={availabilityIndex} className="availability-section">
          <label>Day:</label>
          <input
            type="text"
            value={availability.day}
            onChange={(e) => handleOneOnOneChange(availabilityIndex, 'day', e.target.value)}
            required
          />
          <label>Time Slots:</label>
          {availability.timeSlots.map((slot, slotIndex) => (
            <div key={slotIndex} className="time-slot">
              <select
                value={slot.start}
                onChange={(e) => handleOneOnOneSlotChange(availabilityIndex, slotIndex, 'start', e.target.value)}
                required
              >
                <option value="">Start Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <select
                value={slot.end}
                onChange={(e) => handleOneOnOneSlotChange(availabilityIndex, slotIndex, 'end', e.target.value)}
                required
              >
                <option value="">End Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ))}

      <h2>Group Availability</h2>
      {groupAvailability.map((availability, availabilityIndex) => (
        <div key={availabilityIndex} className="availability-section">
          <label>Title:</label>
          <input
            type="text"
            value={availability.title}
            onChange={(e) => handleGroupChange(availabilityIndex, 'title', e.target.value)}
            required
          />
          <label>Session Location:</label>
          <input
            type="text"
            value={availability.sessionLocation}
            onChange={(e) => handleGroupChange(availabilityIndex, 'sessionLocation', e.target.value)}
            required
          />
          <label>Day:</label>
          <input
            type="text"
            value={availability.day}
            onChange={(e) => handleGroupChange(availabilityIndex, 'day', e.target.value)}
            required
          />
          <label>Time Slots:</label>
          {availability.timeSlots.map((slot, slotIndex) => (
            <div key={slotIndex} className="time-slot">
              <select
                value={slot.start}
                onChange={(e) => handleGroupSlotChange(availabilityIndex, slotIndex, 'start', e.target.value)}
                required
              >
                <option value="">Start Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <select
                value={slot.end}
                onChange={(e) => handleGroupSlotChange(availabilityIndex, slotIndex, 'end', e.target.value)}
                required
              >
                <option value="">End Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ))}

      <button type="submit">Create Schedule</button>
    </form>
  );
};

export default ScheduleForm;
