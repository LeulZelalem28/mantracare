import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../provider/GlobalStateProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Schedule = ({ therapist }) => {
  const { accessToken, userRole } = useGlobalState();
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOneOnOneForm, setShowOneOnOneForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    sessionType: '',
    sessionLocation: '',
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const requestOptions = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const response = await fetch(`http://localhost:3500/schedule/therapist/${id}`, requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }
        const scheduleData = await response.json();
        setSchedule(scheduleData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e, sessionMode) => {
    e.preventDefault();
    const bookingData = {
      ...formData,
      therapistId: id,
      therapistName: therapist.name,
      sessionMode: sessionMode,
    };

    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      };
      const response = await fetch('http://localhost:3500/bookings', requestOptions);
      if (!response.ok) {
        const data = await response.json()
        console.log('12',data.message)
        window.alert(data.message);
      } else {
        window.alert('Booking created successfully');
      
      if(response.ok)
        {
          toast.success('Booking created successfully');
        }}
      
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    
    <div className='shadow-panelShadow w-[-60px] p-3 lg:p-5 rounded-md'>
      <ToastContainer />
      <h1 className='text-headingColor text-xl font-bold mb-4'>Schedule for Therapist</h1>
      {schedule ? (
        <div className='pr-30'>
          <div className='mt-[30px]'>
            <p className='text__para mt-0 font-semibold text-headingColor'>
              Availability Time Slots (one on one):
            </p>
            <ul className='mt-3'>
              {schedule.oneOnOneAvailability.map((availability, index) => (
                <li key={index} className='mb-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-[15px] leading-6 text-textColor font-semibold'>
                      {availability.day}
                    </p>
                    <ul>
                      {availability.timeSlots.map((slot, slotIndex) => (
                        <li key={slotIndex} className='text-[15px] leading-6 text-textColor font-semibold'>
                          {slot}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className='mt-[30px]'>
            <p className='text__para mt-0 font-semibold text-headingColor'>
              Availability Time Slots (group sessions):
            </p>
            <ul className='mt-3'>
              {schedule.groupAvailability.map((group, index) => (
                <li key={index} className='mb-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-[15px] align-center leading-6 text-textColor font-semibold'>
                      {group.day}
                    </p>
                    <ul>
                      {group.timeSlots.map((slot, slotIndex) => (
                        <li key={slotIndex} className='text-[15px] block leading-6 text-textColor font-semibold'>
                          {group.title} <br className='align-center'/> ({group.sessionLocation})<br className='align-center justify-center' /> {slot}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {userRole === 'Patient' && (
            <>
              <button className='btn px-2 w-full rounded-md mt-4' onClick={() => setShowOneOnOneForm(!showOneOnOneForm)}>
                Book One-on-One Appointment
              </button>
              <button className='btn px-2 w-full rounded-md mt-4' onClick={() => setShowGroupForm(!showGroupForm)}>
                Book Group Appointment
              </button>

              {showOneOnOneForm && (
                <form onSubmit={(e) => handleSubmit(e, 'one-on-one')} className='mt-4'>
                  <div className='mb-4'>
                    <label htmlFor='date' className='block text-textColor font-semibold mb-2'>Date</label>
                    <input
                      type='date'
                      id='date'
                      name='date'
                      value={formData.date}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border rounded-md'
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='timeSlot' className='block text-textColor font-semibold mb-2'>Time Slot</label>
                    <select
                      id='timeSlot'
                      name='timeSlot'
                      value={formData.timeSlot}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border rounded-md'
                      required
                    >
                      <option value=''>Select Time Slot</option>
                      {schedule.oneOnOneAvailability.flatMap(availability => availability.timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      )))}
                                        </select>
                </div>
                <div className='mb-4'>
                  <label htmlFor='sessionType' className='block text-textColor font-semibold mb-2'>Session Type</label>
                  <select
                    id='sessionType'
                    name='sessionType'
                    value={formData.sessionType}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border rounded-md'
                    required
                  >
                    <option value=''>Select Session Type</option>
                    <option value='text-chat'>Text Chat</option>
                    <option value='video-chat'>Video Chat</option>
                  </select>
                </div>
                <div className='mb-4'>
                  <label htmlFor='sessionLocation' className='block text-textColor font-semibold mb-2'>Session Location</label>
                  <select
                    id='sessionLocation'
                    name='sessionLocation'
                    value={formData.sessionLocation}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border rounded-md'
                    required
                  >
                    <option value=''>Select Session Location</option>
                    <option value='online'>Online</option>
                    <option value='in-person'>In Person</option>
                  </select>
                </div>
                <button type='submit' className='btn px-4 py-2 rounded-md bg-primaryColor text-white'>
                  Submit
                </button>
              </form>
            )}

            {showGroupForm && (
              <form onSubmit={(e) => handleSubmit(e, 'group')} className='mt-4'>
                <div className='mb-4'>
                  <label htmlFor='date' className='block text-textColor font-semibold mb-2'>Date</label>
                  <input
                    type='date'
                    id='date'
                    name='date'
                    value={formData.date}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='timeSlot' className='block text-textColor font-semibold mb-2'>Time Slot</label>
                  <select
                    id='timeSlot'
                    name='timeSlot'
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border rounded-md'
                    required
                  >
                    <option value=''>Select Time Slot</option>
                    {schedule.groupAvailability.flatMap(group => group.timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    )))}
                  </select>
                </div>
                <div className='mb-4'>
                  <label htmlFor='sessionType' className='block text-textColor font-semibold mb-2'>Session Type</label>
                  <select
                    id='sessionType'
                    name='sessionType'
                    value={formData.sessionType}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border rounded-md'
                    required
                  >
                    <option value=''>Select Session Type</option>
                    <option value='text-chat'>Text Chat</option>
                    <option value='video-chat'>Video Chat</option>
                  </select>
                </div>
                <button type='submit' className='btn px-4 py-2 rounded-md bg-primaryColor text-white'>
                  Submit
                </button>
              </form>
            )}
          </>
        )}
      </div>
    ) : (
      <p>No schedule available</p>
    )}
    
  </div>
);
};

export default Schedule;
