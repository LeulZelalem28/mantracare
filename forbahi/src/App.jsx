// src/App.jsx
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStateProvider } from './provider/GlobalStateProvider'; // Adjust the path based on your file structure
import Routers from './routes/Routers';
import { io } from 'socket.io-client';
import Layout from './layout/Layout';

const socket = io('http://localhost:3500');

function App() {
  return (
   
        <Layout />
          
       
    
  );
}

export default App;
