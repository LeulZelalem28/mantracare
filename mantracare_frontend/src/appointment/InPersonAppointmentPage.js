import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const InPersonAppointmentPage = ({ accessToken }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [errorMessages, setErrorMessages] = useState('');
    const [sessionMode, setSessionMode] = useState('one-on-one');
    let responseData;

    const navigate = useNavigate();
    let baseUrl = `http://localhost:3500`

    useEffect(() => {
        fetchAppointments();
    }, [sessionMode]);

    const fetchAppointments = async () => {
        try {
            setAppointments([]);
            setIsLoading(true);

            let url = `${baseUrl}/bookings/location/in-person/sessionMode/${sessionMode}`;

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await fetch(url, requestOptions);

            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            } else if (response.status === 204) {
                setAppointments([]);
            } else if (response.status === 400) {
                const errorMessages = await response.json();
                setErrorMessages(errorMessages);
            } else {
                const errorMessages = await response.json();
                setErrorMessages(errorMessages);
            }
        } catch (error) {
            setErrorMessages('Failed to fetch appointments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSessionModeChange = (sessionMode) => {
        setSessionMode(sessionMode);
    };

    const handleCancelation = async (bookingId) => {
        try {
            const url = `${baseUrl}/bookings/${bookingId}/cancel`;
    
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            });
        
            if (response.ok) {
                responseData = await response.json();
                toast(responseData.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                window.location.reload();
            }
        } catch (error) {
            toast(responseData.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const isPastAppointment = (appointmentDate) => {
        const now = new Date();
        const appointment = new Date(appointmentDate);
        return appointment < now;
    };

    return (
        <div id='onlineAppointmentPage'>
            <h1>Appointments</h1>
            <div id='onlineAppointmentPageContainer'>
                <div className="button-group">
                    <button
                        className={sessionMode === 'one-on-one' ? 'selected' : ''}
                        onClick={() => handleSessionModeChange('one-on-one')}
                    >
                        One on One
                    </button>
                    <button
                        className={sessionMode === 'group' ? 'selected' : ''}
                        onClick={() => handleSessionModeChange('group')}
                    >
                        Group
                    </button>
                </div>

                {isLoading ? (
                    <ClipLoader id="onlineAppointmentPageSpinner" color={'#0426FA'} loading={isLoading} size={100} aria-label="Loading Spinner" data-testid="loader" />
                ) : appointments.length === 0 ? (
                    <p style={{ margin: 20 }}>No appointments available</p>
                ) : (
                    <div className="appointments-container">
                        {appointments.map((appointment) => (
                            <div key={appointment.bookingId} className={`appointment-box ${appointment.isCanceled ? 'canceled' : ''} ${isPastAppointment(appointment.date) ? 'passed' : ''}`}>
                                {appointment.sessionMode === 'group' && <p className='title-info'><span>Title:</span> {appointment.sessionTitle}</p>}
                                <p className='therapist-info'><span>Therapist:</span> {appointment.therapistName}</p>
                                {appointment.patientInfo.map((patientInfo, index) => (
                                    <div className='patient-info' key={patientInfo.id || index}>
                                        <p><span>Patient name:</span> {patientInfo.name}</p>
                                    </div>
                                ))}
                                <p className='date-info'><span>Date:</span> {appointment.date}</p>
                                <p className='time-info'><span>Time:</span> {appointment.timeSlot}</p>
                                <p className='sessionMode-info'><span>TherapistSession Mode:</span> {appointment.sessionMode}</p>
                                {appointment.isCanceled &&
                                    <div className='cancellation-info'>
                                        <p>Canceled</p>
                                        <p>Canceled by {appointment.canceledBy}</p>
                                    </div>}
                                {!appointment.isCanceled  && <button id='cancel-appointment-btn' onClick={() => handleCancelation(appointment.bookingId)}>Cancel Appointment</button>}
                                {isPastAppointment(appointment.date) && <div className='status-label'>Passed</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InPersonAppointmentPage;
