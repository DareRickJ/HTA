import React from 'react';

const PlayerBubble = ({ id, text, point, nextArray, dialogueHandler }) => {
  return (
    <div
      id={id}
      className={text === ' . . . ' ? 'bubbleButton tripleDots' : 'bubbleButton'}
      onClick={() => {
        if (text === ' . . . ') {
          document.getElementById('respondButton').click();
        } else {
          dialogueHandler(true, nextArray, id, point);
        }
      }}
    >
      <div className='textForBubbleButton'>
        <p>
          {text}
        </p>
      </div>
    </div>
  )
};

export default PlayerBubble;