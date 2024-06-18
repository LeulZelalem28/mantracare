import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import './SessionPage.css';
import '../appointment/OnlineAssignmentPage.css'


const TextSessionPage = ({accessToken}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [textSessions, setTextSessions] = useState([]);
    let textSessionData = [];
    const [errorMessages, setErrorMessages] = useState('');
    const [sessionMode, setSessionMode] = useState('one-on-one');
    const [sessionType, setSessionType] = useState('text-chat');
    let responseData;

    const navigate = useNavigate();
    let baseUrl = `http://localhost:3500`

    useEffect(() => {
      fetchTextSessions();
    
      // fetchSessions();
    }, [sessionType, sessionMode]);

    const fetchTextSessions = async () => {
        try {
            setIsLoading(true);
          let url;
          const mode = sessionMode === 'one-on-one' ? 'sessions' : 'groupSessions';
            
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
            
          if (response.status === 200) {
            const data = await response.json();
            setTextSessions(data);
          } else if (response.status === 204) {
            setTextSessions([]);
          } else {
            const errorMessages = await response.json();
            setErrorMessages(errorMessages);
            if(responseData.message){
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
              };
          } 
        } catch (error) {
            if(responseData.message){
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
        } finally {
            setIsLoading(false);
        }
      };

      const handleSessionModeChange = (sessionMode) => {
        setSessionMode(sessionMode)
      }

      return (
        <div id='onlineApp'>
            <ToastContainer />
          <h1 className='alis'>Text Sessions:</h1>
          <div className='shadow-panelShadow w-[-60px] p-3 lg:p-5 rounded-md' id='onlineAppointmentPageContainer'>
            <div className="appointment-button-grou shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white rounded-lg overflow-hidden">
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
            ) : textSessions.length === 0 ? (
              <p style={{margin: 20}}>No sessions available</p>
            ) : (
                <div className="session-container"> 
                  {textSessions.map((textSession) => (
                    <div key={textSession.sessionId} className='session-box'>  
                      {textSession.sessionMode == 'group' && <p className='title-info'><span>Title:</span> {textSession.sessionTitle}</p>  }      
                      <p className='therapist-info'><span>Therapist:</span> {textSession.therapistName}</p>
                        { textSession.patientInfo.map((patientInfo, index) => (
                            <div className='patient-info' key={patientInfo.id || index}>
                            <p><span>Patient name:</span> {patientInfo.name}</p>
                            </div>
                        )
                    )
                        }
                      <p className='sessionType-info'><span>TherapistSession Type:</span> {textSession.sessionType}</p>                   
                    </div>
                  ))}
               </div>
            )}
          </div>
        </div>
      ); 

}

export default TextSessionPage;