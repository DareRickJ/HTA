import React from 'react';
import useAudio from './AudioPlayer.js';

const DonorBubble = ({ text, audioUrl }) => {
  const [playing, toggle] = useAudio(audioUrl);

  return (
    <div
      id='respondButton'
      className='respondButton'
      onClick={() => {
        toggle();
      }}
    >
      <p className='textForRespondButton'>
        {text}
      </p>

    </div>
  )
};

export default DonorBubble;