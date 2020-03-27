import React from 'react';
import BackButton from '../components/BackButton.jsx';


const ChooseDonor = ({ chooseDonor, navigateBack }) => {
  var bgImg = new Image();
  bgImg.src = './assets/person.png';
  bgImg.onload = function () {
    document.getElementsByClassName('chooseDonor')[0].style.opacity = 1
  };
  return (
   
    <div className='chooseDonor'>
      <div className='chooseDonorTitle'>
        <h1>Donor Select</h1>
        <div className='TitleUnderline'></div>
      </div>      
      <div className='personContainer'>
        <div
          id="Jennifer"
          className="person Jennifer"
          onClick={() => {
            document.getElementsByClassName('chooseDonor')[0].style.opacity = 0;
            setTimeout(() => { chooseDonor('Franco'); }, 800);
          }}

        >
          <button ></button>
          <div
          >Jennifer Walker</div>
        </div>
        <div
          className="person Sharrel"
          onClick={() => {
            document.getElementsByClassName('chooseDonor')[0].style.opacity = 0;
            setTimeout(() => { chooseDonor('Sharrel'); }, 800);
          }}
        >
          <button ></button>
          <div
          >Sharrel Letkin</div>
        </div>
        <div
          className="person JP"
          onClick={() => {
            document.getElementsByClassName('chooseDonor')[0].style.opacity = 0;
            setTimeout(() => { chooseDonor('JP'); }, 800);
          }}
        >
          <button ></button>
          <div
          >JP Romero</div>
        </div>
      </div>
      <BackButton
        navigateBack={() => {
          document.getElementsByClassName('chooseDonor')[0].style.opacity = 0;
          setTimeout(() => {
            navigateBack();
          }, 800);
        }}
      />


    <button name='GameTutoralButton' className = 'tutorlButton'  onClick={() => {document.getElementsByClassName('GameTutoral')[0].style.opacity = 0; } }> Tutoral? </button>
    
    </div>
  );
};

export default ChooseDonor;