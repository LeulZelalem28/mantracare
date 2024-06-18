// import React from 'react';
// import PatientProfile from './profilePages/patientProfile';

// const App = () => {
//   const patientId = 'some-patient-id'; // Replace with actual patient ID

//   return (
//     <div>
//       <PatientProfile patientId={patientId} />
//     </div>
//   );
// };

// export default App;


import './App.css';
import { io } from 'socket.io-client';
import {  BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Signup_Login_Form from './components/Signup_Login_Form/Signup_Login_Form'
import Room from './Room';
import TextChat from './TextChat/TextChat';
import OnlineAppointmentsPage from './appointment/OnlineAppointmentPage';
import { useState, useEffect } from 'react';
import InPersonAppointmentPage from './appointment/InPersonAppointmentPage';
import TextSessionPage from './SessionPage/TextSessionPage';
import VideoSessionPage from './SessionPage/VideoSessionPage';
import ResourcePage from './blog/ResourceList';
import ResourceDetailPage from './blog/ResourceDetailPage';
import CreateResource from './blog/CreateResourcePage';
import MyResourcePage from './blog/MyResourcePage.js';
import UpdateResourcePage from './blog/UpdateResourcePage.js';
import ForumPage from './Forum/ForumPage.js';

const socket = io('http://localhost:3500');

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('roles') || '');
  const [username, setUserName] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    // Save accessToken to localStorage when it changes
    localStorage.setItem('accessToken', accessToken);
  }, [accessToken]);
  useEffect(() => {
    // Save accessToken to localStorage when it changes
    localStorage.setItem('username', username);
  }, [username]);
  useEffect(() => {
    // Save accessToken to localStorage when it changes
    localStorage.setItem('roles', userRole);
  }, [username]);
  
 return(
  <Router>
    <Routes>
      <Route path='/' element= {<Signup_Login_Form setUserName={setUserName} accessToken={accessToken} setAccessToken={setAccessToken} setUserRole={setUserRole}/>} />
      <Route path='/room/video/:roomId' element= {<Room  accessToken={accessToken} socket={socket}/>} />
      <Route path='/room/text/:roomId' element= {<TextChat  userRole={userRole} username={username} accessToken={accessToken} socket={socket}/>} />
      <Route path='/appointments/online'  element= {<OnlineAppointmentsPage accessToken={accessToken}/>} />
      <Route path='/appointments/in-person'  element= {<InPersonAppointmentPage accessToken={accessToken}/>} />
      <Route path='/sessions/text'  element= {<TextSessionPage accessToken={accessToken}/>} />
      <Route path='/sessions/video'  element= {<VideoSessionPage accessToken={accessToken}/>} />
      <Route path='/resources'  element= {<ResourcePage accessToken={accessToken}/>} />
      <Route path='/resources/:id'  element= {<ResourceDetailPage username={username} accessToken={accessToken}/>} />
      <Route path='/resources/:id/update'  element= {<UpdateResourcePage accessToken={accessToken} />} />
      <Route path='/myresources'  element= {<MyResourcePage username={username} accessToken={accessToken}/>} />
      <Route path='/create/resources'  element= {<CreateResource accessToken={accessToken}/>} />
      <Route path='/forum'  element= {<ForumPage username={username} accessToken={accessToken}/>} />
      
    </Routes>
  </Router>
   )
  }
  export default App;

// const roomId = "1234";
// const [message, setMessage] = useState('');
// const [messageList, setMessageList] = useState([]);

// //make sure you get the username properly
// const username = 'abebe';

// const sendMessage = async () => {
//   if(message !== '') {
//     const messageData = {
//       username,
//       message,
//       time: 
//       new Date(Date.now()).getHours() +
//       ":" +
//       new Date(Date.now()).getMinutes(),
//   };

//   await socket.emit('send-message', messageData);
//   setMessageList((list) => [...list, messageData]);
//   setMessage('');
// }
// }

// useEffect(()=>{
//   //you add the real room over here
// socket.emit('join-chat-room', roomId);
// },[])

// useEffect(() => {
//   socket.on('receive-message', (receivedData) => {
//     setMessageList((list) => [...list, receivedData]);
//   });
// }, [socket]);
  // <div id='text-chat-container'>
  //   <div id='text-chat-header'></div>
  //   <div id='text-chat-body'>
  //     <ul>
  //       {messageList.map((message) => {
  //         return(
  //           <div 
  //             className='message-container' 
  //             id={username === message.username ? 'sent-message' : 'received-message'}
  //           >
  //             <div>{message.username}</div>
  //             <div><p>{message.message}</p></div>
  //             <div>{message.time}</div>
  //           </div>
  //         )
  //       })}
  //     </ul>
  //   </div>
  //   <div id='text-chat-footer'>
  //     <input 
  //       type='text' 
  //       value={message}
  //       placeholder='Write a message...' 
  //       onChange={(e) => {
  //         setMessage(e.target.value);
  //       }}
  //       onKeyDown={(e) => {
  //         if (e.key === 'Enter') {
  //           sendMessage();
  //         }
  //       }}
  //     />
  //     <button onClick={sendMessage}><FaPaperPlane /></button>
  //   </div>
  // </div>
