import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../SessionPage/SessionPage.css'

const VideoSessionPage = ({accessToken}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [videoSessions, setVideoSessions] = useState([]);
    let videoSessionData = [];
    const [errorMessages, setErrorMessages] = useState('');
    const [sessionMode, setSessionMode] = useState('one-on-one');
    const [sessionType, setSessionType] = useState('text-chat');
    let responseData;

    const navigate = useNavigate();
    let baseUrl = `http://localhost:3500`

    useEffect(() => {
      fetchVideoSessions();
    
      // fetchSessions();
    }, [sessionType, sessionMode]);

    const fetchVideoSessions = async () => {
        try {
            setIsLoading(true);
          let url;
          const mode = sessionMode === 'one-on-one' ? 'sessions' : 'groupSessions';
            
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
            
          if(response.status === 200) {
            const data = await response.json();
            console.log(data)
            setVideoSessions(data);
          } else if (response.status === 204) {
            console.log('hi')
            setVideoSessions([]);
          } else{
            const errorMessages = await response.json();
            setErrorMessages(errorMessages);
                toast(errorMessages, {
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
        } catch (error) {
          setErrorMessages('Failed to fetch video sessions');
          console.log('hi',error)
          toast('Failed to fetch video sessions', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        } finally {
            setIsLoading(false);
        }
      }

      const handleSessionModeChange = (sessionMode) => {
        setSessionMode(sessionMode)
      }

      return (
        <div id='onlineAp'>
            <ToastContainer />
          <h1 className='aliss'>Video Sessions:</h1>
          <div className='shadow-panelShadow w-[-60px] p-3 lg:p-5 rounded-md' id='onlineAppointmentPageContainer'>
            <div className="appointment-button-gro shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white rounded-lg overflow-hidden">
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
              <ClipLoader className="sessionPageSpinner" color={'#0426FA'} loading={isLoading} size={100} aria-label="Loading Spinner" data-testid="loader" />
            ) : videoSessions.length === 0 ? (
              <p style={{margin: 20}}>No sessions available</p>
            ) : (
                <div className="sessions-container"> 
                  {videoSessions.map((videoSession) => (
                    <div key={videoSession.sessionId} className= 'session-box'>  
                      {videoSession.sessionMode == 'group' && <p className='title-info'><span>Title:</span> {videoSession.sessionTitle}</p>  }      
                      <p className='therapist-info'><span>Therapist:</span> {videoSession.therapistName}</p>
                        { videoSession.patientInfo.map((patientInfo, index) => (
                            <div className='patient-info' key={patientInfo.id || index}>
                            <p><span>Patient name:</span> {patientInfo.name}</p>
                            </div>
                        )
                    )
                        }
                      <p className='sessionType-info'><span>TherapistSession Type:</span> {videoSession.sessionType}</p>
                      <p className='sessionDuration-info'>
                        <span>Session Duration:</span>{" "}
                        {new Date(videoSession.sessionStartTime).toLocaleDateString()},{" "}
                            {new Date(videoSession.sessionStartTime).toLocaleTimeString()} -{" "}
                        {videoSession.sessionEndTime
                            ? new Date(videoSession.sessionEndTime).toLocaleTimeString()
                            : "On - Going"}
                        </p>
                     </div>
                  ))}
               </div>
            )}
          </div>
        </div>
      ); 

  
}

export default VideoSessionPage;