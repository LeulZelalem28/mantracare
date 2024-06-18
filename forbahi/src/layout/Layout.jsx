import React from 'react';
import { io } from 'socket.io-client';
import { GlobalStateProvider } from '../provider/GlobalStateProvider';
import Header from '../components/Header/Header';
import Header2 from '../components/Header/Header2';
import Footer from '../components/Footer/Footer';
import Routers from '../routes/Routers';
import Room from '../Room';
import { Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboard from '../Dashboard/AdminDashboard/AdminDashboard';

const socket = io('http://localhost:3500');

const Layout = () => {
  const userRole = localStorage.getItem('roles');
  const { pathname } = useLocation(); 

  const isRoomPage = pathname.startsWith('/room/video/');
  const isTextPage = pathname.startsWith('/room/text/');
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      <GlobalStateProvider>
        {!isRoomPage && !isAdminPage && userRole === 'Patient' && <Header />}
        {!isRoomPage && !isAdminPage && userRole === 'Therapist' && <Header2 />}
        
        <main>
          <Routers socket={socket} />
        </main>
        
        {!isRoomPage && !isAdminPage && <Footer />}
        
        <Routes> 
          <Route path="/room/video/:roomId" element={<Room socket={socket} />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </GlobalStateProvider>
    </>
  );
};

export default Layout;
