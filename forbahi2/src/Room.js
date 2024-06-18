import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import Video from './Video';
import { FaVideo, FaPhone, FaMicrophone, FaMicrophoneSlash, FaVideoSlash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001',
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:numb.viagenie.ca' },
      { urls: 'stun:stun.services.mozilla.com' }
    ]
  }
});

async function getUserMedia() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    return stream;
  } catch (error) {
    console.error('Error accessing user media:', error);
    throw error;
  }
}

const Room = ({ socket }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [peers, setPeers] = useState({});
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const videoGridRef = useRef(null);
  const myVideoRef = useRef(null);

  useEffect(() => {
    const videoGrid = videoGridRef.current;
    const myVideo = myVideoRef.current;
    let myStream;

    const initializePeer = async () => {
      try {
        myStream = await getUserMedia();
        addVideoStream(myVideo, myStream);

        myPeer.on('call', (call) => {
          call.answer(myStream);
          const videoRef = React.createRef();

          call.on('stream', (userVideoStream) => {
            const video = videoRef.current;
            if (video) {
              video.srcObject = userVideoStream;
            }
            setPeers((prevPeers) => ({
              ...prevPeers,
              [call.peer]: { call, stream: userVideoStream, ref: videoRef },
            }));
          });
        });

        socket.on('user-connected', (userId) => {
          console.log(`User connected: ${userId}`);
          connectToNewUser(userId, myStream);
        });
      } catch (error) {
        console.error('Error accessing user media:', error);
      }
    };

    initializePeer();

    socket.on('user-disconnected', (userId) => {
      setPeers((prevPeers) => {
        const updatedPeers = { ...prevPeers };
        if (updatedPeers[userId]) {
          updatedPeers[userId].call.close();
          delete updatedPeers[userId];
        }
        return updatedPeers;
      });
    });

    myPeer.on('open', (id) => {
      console.log(`Peer opened with ID: ${id}`);
      socket.emit('join-video-room', roomId, id);
    });

    return () => {
      myStream?.getTracks().forEach((track) => {
        track.stop();
      });
      myPeer.destroy();
    };
  }, [roomId, socket]);

  function connectToNewUser(userId, stream) {
    console.log(`Connecting to new user: ${userId}`);
    const call = myPeer.call(userId, stream);

    call.on('stream', (userVideoStream) => {
      console.log(`Received stream from user ${userId}`);
      setPeers((prevPeers) => ({
        ...prevPeers,
        [userId]: { call, stream: userVideoStream },
      }));
    });

    call.on('close', () => {
      console.log(`Call closed by user ${userId}`);
      setPeers((prevPeers) => {
        const updatedPeers = { ...prevPeers };
        delete updatedPeers[userId];
        return updatedPeers;
      });
    });
  }

  function toggleVideo() {
    setVideoEnabled((prevEnabled) => !prevEnabled);
    const myVideoTrack = myVideoRef.current.srcObject.getVideoTracks()[0];
    myVideoTrack.enabled = !videoEnabled;
  }

  function toggleAudio() {
    setAudioEnabled((prevEnabled) => !prevEnabled);
    const myAudioTrack = myVideoRef.current.srcObject.getAudioTracks()[0];
    myAudioTrack.enabled = !audioEnabled;
  }

  function addVideoStream(video, stream) {
    if (video) {
      video.srcObject = stream;
      video.play();
    }
  }

  function handleDisconnect() {
    myPeer.destroy();
    socket.emit('leave-room', roomId); // Emit a custom event to handle disconnection
    navigate('/'); // Redirect the user to the home page or another appropriate page
  }

  return (
    <div className="App">
      <div ref={videoGridRef} id="video-container">
        <video ref={myVideoRef} muted={videoEnabled} autoPlay playsInline />
        {Object.keys(peers).map((peerId) => (
          <Video key={peerId} stream={peers[peerId].stream} videoRef={peers[peerId].ref} />
        ))}
      </div>
      <div id='stream-control'>
        <button className='stream-control-button' onClick={toggleVideo} style={{ backgroundColor: videoEnabled ? 'green' : 'red' }}>
          {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button className='stream-control-button' onClick={toggleAudio} style={{ backgroundColor: audioEnabled ? 'green' : 'red' }}>
          {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button className='stream-control-button' onClick={handleDisconnect}><FaPhone /></button>
      </div>
    </div>
  );
};

export default Room;
