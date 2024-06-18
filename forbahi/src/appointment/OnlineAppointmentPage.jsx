import React, { useEffect, useState } from 'react';
import {FaVideo, FaComment} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const OnlineAppointmentsPage = ({accessToken}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [videoSessions, setVideoSessions] = useState([]);
    const [textSessions, setTextSessions] = useState([]);
    let textSessionData = [];
    let videoSessionData = [];
    const [errorMessages, setErrorMessages] = useState('');
    const [sessionMode, setSessionMode] = useState('one-on-one');
    const [sessionType, setSessionType] = useState('text-chat');
    let responseData;
  
    

    const navigate = useNavigate();
    let baseUrl = `http://localhost:3500`

    useEffect(() => {
      fetchAppointments();
    
      // fetchSessions();
    }, [sessionType, sessionMode]);
    
    const fetchAppointments = async () => {
      try {
          setAppointments([]);
          setIsLoading(true);
  
          let url = `${baseUrl}/bookings/sessionMode/${sessionMode}/sessionType/${sessionType}`;
          
          const requestOptions = {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
              }
          };
  
          const response = await fetch(url, requestOptions);
  
          if(response.ok) {
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
  

    const fetchTextSessions = async (sessionModes) => {
      try {
        let url;
        const mode = sessionModes === 'one-on-one' ? 'sessions' : 'groupSessions';
          
        setTextSessions([]);
        url = `${baseUrl}/${mode}/sessionType/text-sessions`;
    
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
          setTextSessions(data);
          console.log('Text sessions:', data);
          return data; // Return the fetched data
        } else if (response.status === 204) {
          setTextSessions([]);
          console.log('No text sessions found');
          return []; // Return an empty array if no sessions are found
        } else {
          const errorMessages = await response.json();
          setErrorMessages(errorMessages);
          console.log('Error fetching text sessions:', errorMessages);
          return []; // Return an empty array in case of an error
        } 
      } catch (error) {
        setErrorMessages('Failed to fetch text sessions');
        console.log('Error fetching text sessions:', error);
        return []; // Return an empty array in case of an error
      }
    };
    
    const createTextSession = async (appointment) => {
      const mode = sessionMode === 'one-on-one' ? 'sessions' : 'groupSessions';
      const textSessionData = await fetchTextSessions(appointment.sessionMode);
    
      for (const session of textSessionData) {
        const appointmentPatientIds = appointment.patientInfo.map(patient => patient.id).sort();
        const sessionPatientIds = session.patientInfo.map(patient => patient.id).sort();
    
        if (
          session.therapistId === appointment.therapistId &&
          JSON.stringify(appointmentPatientIds) === JSON.stringify(sessionPatientIds)
        ) {
          console.log('Match found:', session);
          navigate(`/room/text/${session.sessionId}`);
          return; // Exit the function once a match is found
        }
      }
    
      // If no match is found, create a new session
      if (textSessionData.length === 0) {
        try {
          const response = await fetch(`${baseUrl}/${mode}/sessionType/text-sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              patientInfo: appointment.patientInfo,
              therapistId: appointment.therapistId,
              sessionStartTime: new Date()
            }),
          });
    
          const data = await response.json();
          const roomId = data.therapySession || data.groupSession;
          navigate(`/room/text/${roomId._sessionId}`);
        } catch (error) {
          setErrorMessages('Failed to create text session');
          console.log('Error creating text session:', error);
        }
      }
    };
    
  
    const fetchVideoSessions = async (sessionModes) => {
      try {
        let url;
        const mode = sessionModes === 'one-on-one' ? 'sessions' : 'groupSessions';
          
        setVideoSessions([]);
        url = `${baseUrl}/${mode}/sessionType/video-sessions`;
    
        const requestOptions = {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${accessToken}`, // Replace yourAuthToken with your actual token
              'Content-Type': 'application/json'
          }
        };
        
        const response = await fetch(url, requestOptions);
          
        if(response.ok) {
          const data = await response.json();
          setVideoSessions(data);
          return data;
        } else if (response.status === 204) {
          setVideoSessions([]);
          console.log('No video sessions found');
          return [];
        } else{
          const errorMessages = await response.json();
          setErrorMessages(errorMessages);
          console.log('Error fetching video sessions:', errorMessages);
          return [];
        } 
      } catch (error) {
        setErrorMessages('Failed to fetch video sessions');
        console.log('Error fetching video sessions:', error);
        return [];
      }
    }
    
    const createVideoSession = async (appointment) => {
      const mode = sessionMode === 'one-on-one' ? 'sessions' : 'groupSessions';
      const videoSessionData = await fetchVideoSessions(appointment.sessionMode);
      console.log(videoSessionData)
      
      for (const session of videoSessionData) {
        const appointmentPatientIds = appointment.patientInfo.map(patient => patient.id).sort();
        const sessionPatientIds = session.patientInfo.map(patient => patient.id).sort();
    
        if (
          session.therapistId === appointment.therapistId &&
          JSON.stringify(appointmentPatientIds) === JSON.stringify(sessionPatientIds) && 
          session.sessionEndTime == null
        ) {
          console.log('Match found:', session);      
          navigate(`/room/video/${session.sessionId}`);
          return;
        }
      }
    
      try {
        const response = await fetch(`${baseUrl}/${mode}/sessionType/video-sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(
            {
              patientInfo: appointment.patientInfo,
              therapistId: appointment.therapistId,
              sessionStartTime: new Date()
            }
          ),
        });
    
        const data = await response.json();
        let roomId = data.therapySession || data.groupSession;
        navigate(`/room/video/${roomId._sessionId}`);
      } catch (error) {
        setErrorMessages('Failed to create video session');
        console.log('Error creating video session:', error);
      }
    }

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
    

  const handleSessionTypeChange = (sessionType) => {
    setSessionType(sessionType);
  };

  const handleSessionModeChange = (sessionMode) => {
    setSessionMode(sessionMode)
  }

  return (
    <div id='onlineAppointmentPage'>
      <ToastContainer />
      <h1 className='ali'>Appointments</h1>
      <div className='shadow-panelShadow w-[-60px] p-3 lg:p-5 rounded-md' id='onlineAppointmentPageContainer'>
      <div className="appointment-button-group shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white rounded-lg overflow-hidden">
            <button
              className={`p-3 lg:p-4 text-sm lg:text-base font-semibold ${sessionType === 'text-chat' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => handleSessionTypeChange('text-chat')}
            >
              Text
            </button>
            <button
              className={`p-3 lg:p-4 text-sm lg:text-base font-semibold ${sessionType === 'video-chat' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => handleSessionTypeChange('video-chat')}
            >
              Video
            </button>
          </div>
          <div className="appointment-button-group shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white rounded-lg overflow-hidden mt-4">
            <button
              className={`p-3 lg:p-4 text-sm lg:text-base font-semibold ${sessionMode === 'one-on-one' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => handleSessionModeChange('one-on-one')}
            >
              One on One
            </button>
            <button
              className={`p-3 lg:p-4 text-sm lg:text-base font-semibold ${sessionMode === 'group' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => handleSessionModeChange('group')}
            >
              Group
            </button>
          </div>
        
        {isLoading ? ( 
          <ClipLoader id="onlineAppointmentPageSpinner" color={'#0426FA'} loading={isLoading} size={100} aria-label="Loading Spinner" data-testid="loader" />
        ) : appointments.length === 0 ? (
          <p style={{margin: 20}}>No appointments available</p>
        ) : (
            <div className="appointments-container rounded"> 
              {appointments.map((appointment) => (
                <div key={appointment.bookingId} className={`appointment-box ${appointment.isCanceled ? 'canceled' : ''} ${isPastAppointment(appointment.date) ? 'passed' : ''}`}>  
                  {appointment.sessionMode == 'group' && <p className='title-info'><span>Title:</span> {appointment.sessionTitle}</p>  }      
                  <p className='therapist-info'><span>Therapist:</span> {appointment.therapistName}</p>
                    { appointment.patientInfo.map((patientInfo, index) => (
                        <div className='patient-info' key={patientInfo.id || index}>
                        <p><span>Patient name:</span> {patientInfo.name}</p>
                        </div>
                    )
                )
                    }
                  <p className='date-info'><span>Date:</span> {appointment.date}</p>
                  <p className='time-info'><span>Time:</span> {appointment.timeSlot}</p>
                  <p className='sessionType-info'><span>TherapistSession Type:</span> {appointment.sessionType}</p>
                  <p className='sessionMode-info'><span>TherapistSession Mode:</span> {appointment.sessionMode}</p>
                  {appointment.isCanceled &&
                      <div className='cancellation-info'>
                          <p>Canceled</p>
                          <p>Canceled by {appointment.canceledBy}</p>
                      </div>}
                  {(!appointment.isCanceled || isPastAppointment(appointment.date))&&
                  <><div className='buttons'>
                      <div className='session-buttons'>
                        <button onClick={() => createTextSession(appointment)}><FaComment /></button>
                        <button onClick={() => createVideoSession(appointment)}><FaVideo /></button>
                      </div>
                    </div><button id='cancel-appointment-btn' onClick={() => handleCancelation(appointment.bookingId)}>Cancel Appointment</button></>}
                  {isPastAppointment(appointment.date) && <div className='status-label'>Passed</div>}
                    
                  </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default OnlineAppointmentsPage;




// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AppointmentsPage = ({ userId }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [videoSessions, setVideoSessions] = useState([]);
//   const [textSessions, setTextSessions] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
  

//   useEffect(() => {
//     fetchAppointments();
//     fetchSessions();
//   }, [filter]);
  
//   const fetchAppointments = async () => {
//     try {
//     setIsLoading(true);
//     let url = `http://localhost:3500/bookings/user/group/${userId}`;
//     if (filter !== 'all') {
//         url = `http://localhost:3500/bookings/user/group/${filter}/${userId}`
//     }
//     const response = await fetch(url);

//       // Check if the response status is 204
//     if (response.status === 204) {
//         // Handle the case when no appointments are found
//         setAppointments([]);
//         setIsLoading(false);
//         return;
//     }
//       const data = await response.json();
//       setAppointments(data);
//       console.log(data)
//       setIsLoading(false);
      
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       setIsLoading(false);
//     }
//   };

//   const fetchSessions = async () => {
//     try {
//       const videoResponse = await fetch(`http://localhost:3500/sessions/video-sessions/user/${userId}`);
//       const videoData = await videoResponse.json();
//       setVideoSessions(videoData);
      
      

//       const textResponse = await fetch(`http://localhost:3500/sessions/text-sessions/user/${userId}`);
//       const textData = await textResponse.json();
//       setTextSessions(textData);
     
//     } catch (error) {
//       console.error('Error fetching sessions:', error);
//     }
//   };

//   const createSession = async (type, patientInfo, therapistId) => {
//     try {
//       const url = type === 'video' ? 'http://localhost:3500/sessions/video-sessions' : 'http://localhost:3500/sessions/text-sessions';
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           patientInfo,
//           therapistId,
//           sessionStartTime: new Date().toISOString(),
//         }),
//       });

//       if (response.ok) {
//         const { therapySession } = await response.json();
//         console.log(therapySession)
//         console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} session created successfully`);
//         return therapySession._sessionId;
//       } else {
//         console.error(`Failed to create ${type} session`);
//         return null;
//       }
//     } catch (error) {
//       console.error(`Error creating ${type} session:`, error);
//       return null;
//     }
//   };

//   const getSessionId = (type, appointment) => {
//     const sessions = type === 'video' ? videoSessions : textSessions;
//     const session = sessions.find(session =>
//       session.therapistId === appointment.therapistId &&
//       session.patientId === appointment.patientId
//     );
//     return session ? session.sessionId : null;
//   };

//   const handleJoinChat = async (type, appointment) => {
//     let sessionId = getSessionId(type, appointment);
//     if (!sessionId) {
//         console.log('hi')
//       sessionId = await createSession(type, appointment.patientInfo, appointment.therapistId);
//     }
//     console.log(sessionId);
//     if (sessionId) {
//       navigate(`/room/${type}/${sessionId}`);
//     }

//     else{
        
    
//     }
//   };

//   const handleFilterChange = (newFilter) => {
//     setFilter(newFilter);
//   };

//   return (
//     <div>
//       <h1>Appointments</h1>
//       <div>
//         <button onClick={() => handleFilterChange('all')}>All Appointments</button>
//         <button onClick={() => handleFilterChange('text-chat')}>Text Chat Appointments</button>
//         <button onClick={() => handleFilterChange('video-chat')}>Video Chat Appointments</button>
//       </div>
//       {isLoading ? ( 
//         <p>Loading...</p>
//       ) : appointments.length === 0 ? (
//         <p>No appointments found.</p>
//       ) : (
//         <ul>
//           {appointments.map((appointment) => (
//             <li key={appointment.bookingId}>
//                 { appointment.patientInfo.map((patientInfo) => (
//                     <div>
//                     <p>Patient: {patientInfo.name}</p>
//                     <p>Patient: {patientInfo.id}</p>
//                     </div>
//                 )
//             )
//                 }
//               <p>Date: {appointment.date}</p>
//               <p>Time: {appointment.timeSlot}</p>
//               <button onClick={() => handleJoinChat('video', appointment)}>Join Video Chat</button>
//               <button onClick={() => handleJoinChat('text', appointment)}>Join Text Chat</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AppointmentsPage;


  // const fetchSessions = async () => {
  //   try {
  //     const videoResponse = await fetch(`http://localhost:3500/sessions/video-sessions/user/${userId}`);
  //     const videoData = await videoResponse.json();
  //     setVideoSessions(videoData);
      
      

  //     const textResponse = await fetch(`http://localhost:3500/sessions/text-sessions/user/${userId}`);
  //     const textData = await textResponse.json();
  //     setTextSessions(textData);
     
  //   } catch (error) {
  //     console.error('Error fetching sessions:', error);
  //   }
  // };

  // const createSession = async (type, patientInfo, therapistId) => {
  //   try {
  //     const url = type === 'video' ? 'http://localhost:3500/sessions/video-sessions' : 'http://localhost:3500/sessions/text-sessions';
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         patientInfo,
  //         therapistId,
  //         sessionStartTime: new Date().toISOString(),
  //       }),
  //     });

  //     if (response.ok) {
  //       const { therapySession } = await response.json();
  //       console.log(therapySession)
  //       console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} session created successfully`);
  //       return therapySession._sessionId;
  //     } else {
  //       console.error(`Failed to create ${type} session`);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error(`Error creating ${type} session:`, error);
  //     return null;
  //   }
  // };

  // const getSessionId = (type, appointment) => {
  //   const sessions = type === 'video' ? videoSessions : textSessions;
  //   const session = sessions.find(session =>
  //     session.therapistId === appointment.therapistId &&
  //     session.patientId === appointment.patientId
  //   );
  //   return session ? session.sessionId : null;
  // };

  // const handleJoinChat = async (type, appointment) => {
  //   let sessionId = getSessionId(type, appointment);
  //   if (!sessionId) {
  //       console.log('hi')
  //     sessionId = await createSession(type, appointment.patientInfo, appointment.therapistId);
  //   }
  //   console.log(sessionId);
  //   if (sessionId) {
  //     navigate(`/room/${type}/${sessionId}`);
  //   }

  //   else{
        
    
  //   }
  // };