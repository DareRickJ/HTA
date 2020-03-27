import React from 'react';



const TutoralScreen = ({ Ttext, Ttext2, pageLeft = 0}) => {
  function next()
  {
    
          pageLeft = pageLeft + 1;
         document.getElementById('Part1').style.display = 'none';
         document.getElementById('Part2').style.opacity = 1;
         if(pageLeft == 2)
         {         
          document.getElementById('cover').style.opacity = 0;
         
         }        
  }
  function skip()
  {
    document.getElementById('cover').style.display = 'none';
  }
  var bgImg = new Image();
  bgImg.src = './assets/OracleFish.png';
    return (
      
    <div id = 'cover'>
      <div className='tutorl'>
{/* {() => {pageLeft = pageLeft + 1 ; next; console.log(next) }} */}
      </div>
      <img className='Orical' src= './assets/OracleFish.png' />
      <p id = 'Part1' className='Ttext'>{Ttext}</p>
    <p id = 'Part2' className='Ttext' style={{opacity: 0}}>{Ttext2}</p>
      <button name='nextButton' className = 'tButton'  onClick={next}> Continue  </button>
      <button name='skip' className = 'tSkip'  onClick={skip}> skip </button>
    </div>
  )

};

export default TutoralScreen;