import { FaPaperPlane } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Note from './Note'
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import './textChat.css';

const TextChat = ({ socket, accessToken, username, userRole }) => {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [textSessions, setTextSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTherapistLoading, setIsTherapistLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);
  const [isNoteLoading, setNoteIsLoading] = useState(false);
  


  const [page, setPage] = useState(1);
  const limit = 10; // Number of messages to fetch per request
  const chatContainerRef = useRef(null);
  console.log(username)

  const baseUrl = `http://localhost:3500`;

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);
  
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  
  

  useEffect(() => {
    socket.emit('join-chat-room', roomId);

    return () => {
      socket.off('receive-message');
    };
  }, [socket, roomId]);

  useEffect(() => {
    socket.on('receive-message', (receivedData) => {
      setMessageList((prevMessageList) => [...prevMessageList, receivedData]);
      scrollToBottom();
    });
  }, [socket]);

  useEffect(() => {
    fetchMessages();
    scrollToBottom();
  }, [page]);

  useEffect(() => {
    fetchSessions();
  }, [roomId]);

  const fetchMessages = async () => {
    try {
      setIsMessagesLoading(true);
      const url = `${baseUrl}/messages/session/${roomId}?page=${page}&limit=${limit}`;

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
        setMessageList((prevMessageList) => [...data.reverse(), ...prevMessageList]);
        scrollToBottom();
      } else if (response.status === 204) {
        // Do nothing if no messages are found
      } else {
        const errorMessages = await response.json();
        toast.error(errorMessages.message || 'Failed to fetch messages', {
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
      setIsMessagesLoading(false);
    } catch (error) {
      toast.error('Failed to fetch messages', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsMessagesLoading(false);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const sendMessage = async () => {
    if (message !== '') {
      const messageData = {
        messageContent: message,
        sessionId: roomId,
        senderUserName: username,
        timeStamp: new Date(),
      };
      setMessage('');
      setMessageList((prevMessageList) => [...prevMessageList, messageData]);

      await socket.emit('send-message', messageData);
      await saveMessageToDB(messageData);

      
      scrollToBottom();
    }
  };

  const saveMessageToDB = async (messageData) => {
    try {
      const url = `${baseUrl}/messages`;

      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      };

      const response = await fetch(url, requestOptions);

      if (response.status !== 201) {
        const errorMessages = await response.json();
        toast.error(errorMessages.message || 'Failed to send message', {
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
      toast.error('Failed to send message', {
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
  };

  const fetchSessions = async () => {
    setIsTherapistLoading(true);
    try {
      let url1 = `${baseUrl}/groupSessions/${roomId}`;
      let url2 = `${baseUrl}/sessions/${roomId}`;

      setTextSessions([]);

      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      let sessionData;
      

      const response1 = await fetch(url1, requestOptions);
      const response2 = await fetch(url2, requestOptions);

      if (response1.status === 200) {
        sessionData = await response1.json();
        setTextSessions(sessionData);
        console.log('hi',sessionData)
      } else if (response2.status === 200) {
        sessionData = await response2.json();
        setTextSessions(sessionData);
        console.log('hi',sessionData)
      } else {
        const errorMessages = 'error while fetching data';
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

      if (sessionData.sessionMode === 'group') {
        await fetchGroupUsers(sessionData);
      } else {
        await fetchIndividualUsers(sessionData);
      }
      setIsTherapistLoading(false);
    } catch (error) {
      toast.error('Failed to fetch session data', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsTherapistLoading(false);
    }
  };

  const fetchGroupUsers = async (sessionData) => {
    try {
      const patients = [];

      for (const patient of sessionData.patientInfo) {
        const patientUrl = `${baseUrl}/patients/${patient.id}`;
        const response = await fetch(patientUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          const patientData = await response.json();
          patients.push(patientData);
        } else {
          throw new Error('Failed to fetch patient data');
        }
      }

      const therapistUrl = `${baseUrl}/therapists/${sessionData.therapistId}`;
      const therapistResponse = await fetch(therapistUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (therapistResponse.status === 200) {
        const therapistData = await therapistResponse.json();
        // Save patients and therapist in states
        setPatients(patients);
        setTherapists([therapistData]);
      } else {
        throw new Error('Failed to fetch therapist data');
      }
    } catch (error) {
      toast.error(error.message, {
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
  };

  const fetchIndividualUsers = async (sessionData) => {
    try {
      const patientUrl = `${baseUrl}/patients/${sessionData.patientInfo[0].id}`;
      const patientResponse = await fetch(patientUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (patientResponse.status === 200) {
        const patientData = await patientResponse.json();
        const therapistUrl = `${baseUrl}/therapists/${sessionData.therapistId}`;
        const therapistResponse = await fetch(therapistUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (therapistResponse.status === 200) {
          const therapistData = await therapistResponse.json();
          // Save patient and therapist in states
          setPatients([patientData]);
          setTherapists([therapistData]);
        } else {
          throw new Error('Failed to fetch therapist data');
        }
      } else {
        throw new Error('Failed to fetch patient data');
      }
    } catch (error) {
      toast.error(error.message, {
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
  };

  const setProfilePicData = (data) => {
    if (!data || !data.profilePic) {
      return null;
    }
  
    console.log("Profile picture data:", data.profilePic);
    console.log("Type of profilePic.data:", typeof data.profilePic.data);
  
    if (typeof data.profilePic.data === 'string') {
      const base64Image = `data:${data.profilePic.contentType};base64,${data.profilePic.data}`;
      console.log("Base64 image string (string):", base64Image);
      return base64Image;
    } else if (data.profilePic.data instanceof ArrayBuffer) {
      const base64Image = `data:${data.profilePic.contentType};base64,${arrayBufferToBase64(data.profilePic.data)}`;
      console.log("Base64 image string (buffer):", base64Image);
      return base64Image;
    } else {
      console.error("Unknown type of profilePic.data:", data.profilePic.data);
      return null;
    }
  };
  

  const arrayBufferToBase64 = (buffer) => {
    console.log("Buffer data:", buffer);
    if (!buffer) return '';

    let binary = '';
    const bytes = new Uint8Array(buffer);
    console.log('Uint8Array:', bytes);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    console.log('Binary string:', binary);
    return window.btoa(binary);
  };

  const getSenderProfilePic = (message) => {
    const isPatient = patients.some((patient) => patient.username === message.senderUserName);
    if (isPatient) {
      const patient = patients.find((patient) => patient.username === message.senderUserName);
      return patient ? setProfilePicData(patient) : null;
    } else {
      return therapists ? setProfilePicData(therapists[0]) : null;
    }
  };

  const therapistProfile = therapists.length > 0 ? setProfilePicData(therapists[0]) : null;

  

  return (
    <div className='text-page-container'>
      {isTherapistLoading || isMessagesLoading ?(
        <div className="loader-container">
        <ClipLoader color={'#0426FA'} loading={true} size={100} aria-label="Loading Spinner" />
        </div>
      ) : (
        <>
        { userRole == 'Patient' ? (
          <div id='therapist-info-container'>
            {therapists.length > 0 && (
              <div className='therapist-box'>
                <div className='image-container'>
                <img src={therapistProfile} alt="" />
                </div>
                <p>Dr.{therapists[0].name}</p>
                <p><span>Education:</span> {therapists[0].education}</p>
                <p><span>Address:</span> {therapists[0].address}</p>
                <p><span>Email:</span> {therapists[0].email}</p>
                <p><span>Phone:</span> {therapists[0].phoneNumber}</p>
                <p><span>Rating:</span> <span>{therapists[0].rating}</span></p>
              </div>
            )}
          </div>) : <Note  accessToken={accessToken} />}
          <div className="text-chat-container">
            <ToastContainer />
            <div className="text-chat-header">
            <div className='image-container'>
                <img src={therapistProfile} alt="" />
            </div >
            <div className='header-info'> <p>Dr.{therapists[0].name}</p>
           { textSessions.title && <p>Title {textSessions.title}</p>}</div>
                 
            </div>
            <div className="text-chat-body" ref={chatContainerRef}>
              <div>
                {messageList.map((message, index) => {
                  const profilePicSrc = getSenderProfilePic(message);
                  return (
                    <div
                      className={`
                      ${username === message.senderUserName ? 'sent-message' : 'received-message'}`}
                      key={index}
                    >
                      <div className='message-box'>
                      <div className="message-profile-pic">
                        {username !== message.senderUserName && profilePicSrc && (
                          <img
                            className='image-bubble'
                            src={profilePicSrc}
                            alt="p"
                            onLoad={() => scrollToBottom()}
                          />
                        )}
                      </div>
                      <div className='message-content-box'>
                      <div className='message-content'>
                        <p>{message.messageContent}</p>
                      </div>
                      <div className='message-date'>{new Date(message.timeStamp).toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'})}</div>
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-chat-footer">
              <input
                type="text"
                value={message}
                autoFocus 
                placeholder="Write a message..."
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              <button onClick={sendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
};

export default TextChat;




// import { FaPaperPlane } from 'react-icons/fa';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// const TextChat = ({ socket }) => {
//   const { roomId } = useParams();
//   const [message, setMessage] = useState('');
//   const [messageList, setMessageList] = useState([]);

//   // Make sure you get the username properly
//   const username = 'abebe';

//   const sendMessage = async () => {
//     if (message !== '') {
//       const messageData = {
//         username,
//         message,
//         time:
//           new Date(Date.now()).getHours() +
//           ':' +
//           new Date(Date.now()).getMinutes(),
//       };
  
//       setMessageList((prevMessageList) => [...prevMessageList, messageData]); // Add the user's message to the list
//       await socket.emit('send-message', messageData);
//       setMessage('');
//     }
//   };

//   useEffect(() => {
//     // Join the chat room when the component mounts
//     socket.emit('join-chat-room', roomId);

//     // Clean up the event listener when the component unmounts
//     return () => {
//       socket.off('receive-message');
//     };
//   }, [socket, roomId]);

//   useEffect(() => {
//     socket.on('receive-message', (receivedData) => {
//       setMessageList((prevMessageList) => [...prevMessageList, receivedData]);
//     });
//   }, [socket]);

//   return (
//     <div id="text-chat-container">
//       <div id="text-chat-header"></div>
//       <div id="text-chat-body">
//         <ul>
//           {messageList.map((message, index) => (
//             <div
//               className="message-container"
//               id={username === message.username ? 'sent-message' : 'received-message'}
//               key={index}
//             >
//               <div>{message.username}</div>
//               <div>
//                 <p>{message.message}</p>
//               </div>
//               <div>{message.time}</div>
//             </div>
//           ))}
//         </ul>
//       </div>
//       <div id="text-chat-footer">
//         <input
//           type="text"
//           value={message}
//           placeholder="Write a message..."
//           onChange={(e) => {
//             setMessage(e.target.value);
//           }}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               sendMessage();
//             }
//           }}
//         />
//         <button onClick={sendMessage}>
//           <FaPaperPlane />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TextChat;