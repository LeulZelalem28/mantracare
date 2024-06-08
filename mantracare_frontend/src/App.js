import React, { useEffect } from "react";

import {createBrowserRouter,RouterProvider} from "react-router-dom";


import "./index.css";

//import ProfilePage from "./components/ProfilePage/ProfilePage"
// import ProfilePage from "./components/ProfilePage/ProfilePage"

// import SignupPage from "./components/SignupPage/SignupPage"
// import LoginPage from "./components/LoginPage/LoginPage"
// import HomePage from "./components/HomePage/HomePage";

// import SignupPage from "./components/SignupPage/SignupPage"
// import LoginPage from "./components/LoginPage/LoginPage"

import Signup_Login_Form from "./components/Signup_Login_Form/Signup_Login_Form"

let accessToken ;
let userRole;

const router = createBrowserRouter([
 
   {
    path: "/",
    element:<Signup_Login_Form accessToken={accessToken} userRole={userRole}/>,
  },
  
]);
function App() {
  useEffect(() => {
    const fetchUser = async() => {
      let url ='http://localhost:3500/therapists/9cecf304-97d8-4628-b1d3-7cb6ecae0521'
      const response = await fetch(url);
      const data = await response.json()
      console.log(data)
    }
    fetchUser();
  })
  return (
   <main> 
   <RouterProvider router={router}>
    </RouterProvider>
    </main>
  )
}

export default App

// import './App.css';
// import { io } from 'socket.io-client';
// import {  BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

// import Room from './Room';
// import TextChat from './TextChat';
// import OnlineAppointmentsPage from './appointment/OnlineAppointmentPage';

// const socket = io('http://localhost:3500');

// function App() {
//   const userId = 'c7cb7dc6-0a8b-48f9-bac6-2c1ec1e7ee55';
  
//  return(
//   <Router>
//     <Routes>
//       <Route path='/room/video/:roomId' element= {<Room  socket={socket}/>} />
//       <Route path='/room/text/:roomId' element= {<TextChat  socket={socket}/>} />
//       <Route path='/appointments' element= {<OnlineAppointmentsPage/>} />
//     </Routes>
//   </Router>
//    )
//   }
//   export default App;

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
