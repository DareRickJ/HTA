import React, { useState, useEffect } from "react";


const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    let myVideo = document.getElementById("myVideo");
    if (playing) {
      audio.play();
      myVideo.play();
    } else {
      audio.pause();
      myVideo.pause();
      setTimeout(() => {
        audio.currentTime = 0;
        myVideo.currentTime = 0;
      }, 0);
    }
  },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => {
      setPlaying(false);
    });
    return () => {
      audio.removeEventListener('ended', () => {
        setPlaying(false);
      });
    };
  }, []);

  return [playing, toggle];
};


export default useAudio;