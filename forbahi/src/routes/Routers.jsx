// src/routes/Routers.jsx
// import { Routes, Route } from 'react-router-dom';
import { useGlobalState } from '../provider/GlobalStateProvider'; // Adjust the path based on your file structure
// import Signup_Login_Form from '../pages/Signup_Login_Form/Signup_Login_Form';
// import Room from '../components/Room';
// import TextChat from '../components/TextChat/TextChat';
// import OnlineAppointmentsPage from '../appointment/OnlineAppointmentPage';
// import InPersonAppointmentPage from '../appointment/InPersonAppointmentPage';
// // import TextSessionPage from '../SessionPage/TextSessionPage';
// // import VideoSessionPage from '../SessionPage/VideoSessionPage';
// // import ResourcePage from '../blog/ResourceList';
// // import ResourceDetailPage from '../blog/ResourceDetailPage';
// // import CreateResource from '../blog/CreateResourcePage';
// // import MyResourcePage from '../blog/MyResourcePage';
// // import UpdateResourcePage from '../blog/UpdateResourcePage';
// // import ForumPage from '../Forum/ForumPage';
import { Home } from "../pages/Home"
import Services from "../pages/Services"
import Contact from "../pages/Contact"
import DoctorDetails from "../pages/Doctors/DoctorDetails"
import Doctors from "../pages/Doctors/Doctors"
import { Routes, Route } from "react-router-dom"
import MyAccount from "../Dashboard/UserAccount/MyAccount"
import Dashboard from "../Dashboard/DoctorAccount/Dashboard"
import Signup_Login_Form from "../pages/Signup_Login_Form/Signup_Login_Form"
import PatientAccount from '../Dashboard/UserAccount/PatientAccount';
import OnlineAppointmentPage from "../appointment/OnlineAppointmentPage"
import InPersonAppointmentPage from "../appointment/InPersonAppointmentPage"
import TextSessionPage from '../SessionPage/TextSessionPage';
import VideoSessionPage from '../SessionPage/VideoSessionPage';
import ForumPage from '../Forum/ForumPage'
import ResourcePage from '../blog/ResourceList'
import CreateResource from '../blog/CreateResourcePage'
import UpdateResourcePage from '../blog/UpdateResourcePage'
import ResourceDetailPage from '../blog/ResourceDetailPage'
import MyResourcePage from '../blog/MyResourcePage'
import Room from '../Room'
import TextChat from '../TextChat/TextChat'


const Routers = ({ socket }) => {
  const { accessToken, setAccessToken, userRole, setUserRole, username, setUserName } = useGlobalState();

  return (
    <Routes>
         <Route path="/" element={<Home/>}/>
    <Route path="/home" element={<Home/>}/>
    <Route path="/doctor" element={<Doctors/>}/>
    <Route path="/doctor/:id" element={<DoctorDetails/>}/>
    <Route path="/login" element={<Signup_Login_Form hideHeader={true}/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/services" element={<Services/>}/>
    <Route path="/patients/profile/:id" element={<PatientAccount />} />
    <Route path="/therapists/profile/:id" element={<MyAccount/>}/>
    <Route path="/appointments/online" element={<OnlineAppointmentPage accessToken={accessToken} />} />
    <Route path="/appointments/in-person" element={<InPersonAppointmentPage accessToken={accessToken} />} />
    <Route path="/sessions/text" element={<TextSessionPage accessToken={accessToken} />} />
    <Route path="/sessions/video" element={<VideoSessionPage accessToken={accessToken} />} />
    <Route path="/forum" element={<ForumPage username={username} accessToken={accessToken} />} />
    <Route path="/resources" element={<ResourcePage accessToken={accessToken} />} />
      <Route path="/resources/:id" element={<ResourceDetailPage username={username} accessToken={accessToken} />} />
      <Route path="/resources/:id/update" element={<UpdateResourcePage accessToken={accessToken} />} />
      <Route path="/create/resources" element={<CreateResource accessToken={accessToken} />} />
      <Route path="/myresources" element={<MyResourcePage username={username} accessToken={accessToken} />} />
      <Route path="/room/text/:roomId" element={<TextChat userRole={userRole} username={username} accessToken={accessToken} socket={socket} />} />

    {/* <Route path="/users/profiles/me" element={<Dashboard/>}/> */}
      {/* <Route path="/" element={<Signup_Login_Form setUserName={setUserName} accessToken={accessToken} setAccessToken={setAccessToken} setUserRole={setUserRole} />} />
      <Route path="/room/video/:roomId" element={<Room accessToken={accessToken} socket={socket} />} />
      <Route path="/room/text/:roomId" element={<TextChat userRole={userRole} username={username} accessToken={accessToken} socket={socket} />} />
      <Route path="/appointments/online" element={<OnlineAppointmentsPage accessToken={accessToken} />} />
      <Route path="/appointments/in-person" element={<InPersonAppointmentPage accessToken={accessToken} />} />
      <Route path="/sessions/text" element={<TextSessionPage accessToken={accessToken} />} />
      <Route path="/sessions/video" element={<VideoSessionPage accessToken={accessToken} />} />
      <Route path="/resources" element={<ResourcePage accessToken={accessToken} />} />
      <Route path="/resources/:id" element={<ResourceDetailPage username={username} accessToken={accessToken} />} />
      <Route path="/resources/:id/update" element={<UpdateResourcePage accessToken={accessToken} />} />
      <Route path="/myresources" element={<MyResourcePage username={username} accessToken={accessToken} />} />
      <Route path="/create/resources" element={<CreateResource accessToken={accessToken} />} />
      <Route path="/forum" element={<ForumPage username={username} accessToken={accessToken} />} /> */}
    </Routes>
  );
};

export default Routers;
