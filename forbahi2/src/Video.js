import React, { useEffect, useRef } from 'react';

const Video = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (stream) {
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline />;
};

export default Video;