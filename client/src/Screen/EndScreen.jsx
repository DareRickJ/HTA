import React from 'react';
import NatalieBubble from '../components/NatalieBubble.jsx';


const End = ({ ending, goToMain, text }) => {
  var bgImg = new Image();
  bgImg.src = './assets/person.png';
  bgImg.onload = function () {
    document.getElementsByClassName('chooseDonor')[0].style.opacity = 1;
  };

  return (
    <div className="chooseDonor">
      <div
        className={ending.split(' ')[0]}
        onClick={() => {
          document.getElementsByClassName('chooseDonor')[0].style.opacity = 0;
          setTimeout(() => { goToMain(ending.split(' ')[1]); }, 800);
        }}>
        <NatalieBubble
          text={text}
        />
      </div>
    </div>
  );
};

export default End;
