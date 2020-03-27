import React from 'react';

const NatalieBubble = ({ text }) => {
  return (
    <div
      className='natalieBubble'
    >
      <div className='textForBubbleButton'>
        <p>
          {text}
        </p>
      </div>
    </div>
  )
};

export default NatalieBubble;