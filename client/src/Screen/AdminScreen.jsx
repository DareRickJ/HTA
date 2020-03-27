import React from 'react';
import Switch from "react-switch";


const Admin = ({ userName, JenTelScore, JenMeetScore, SharrelTelScore, SharrelMeetScore, JPTelScore, JPMeetScore, tutorial, buttonHandler, updateHandler, logoutHandler }) => {
  return (
    <div style={{ float: 'left', width: '50%' }}>
      <h1>{userName}</h1>
      <form style={{ display: 'flex', margin: '20px 0' }}>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='JenTelScore' value={-1} onClick={buttonHandler}> - </button>
        </div>
        <p style={{ margin: 0 }}>Score: {JenTelScore}</p>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='JenTelScore' value={1} onClick={buttonHandler}> + </button>
        </div>
      </form>
      <form style={{ display: 'flex', margin: '20px 0' }}>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='JenMeetScore' value={-1} onClick={buttonHandler}> - </button>
        </div>
        <p style={{ margin: 0 }}>Score: {JenMeetScore}</p>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='JenMeetScore' value={1} onClick={buttonHandler}> + </button>
        </div>
      </form>

      <form style={{ display: 'flex', margin: '20px 0' }}>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='SharrelTelScore' value={-1} onClick={buttonHandler}> - </button>
        </div>
        <p style={{ margin: 0 }}>Score: {SharrelTelScore}</p>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='SharrelTelScore' value={1} onClick={buttonHandler}> + </button>
        </div>
      </form>
      <form style={{ display: 'flex', margin: '20px 0' }}>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='SharrelMeetScore' value={-1} onClick={buttonHandler}> - </button>
        </div>
        <p style={{ margin: 0 }}>Score: {SharrelMeetScore}</p>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='SharrelMeetScore' value={1} onClick={buttonHandler}> + </button>
        </div>
      </form>

      <form style={{ display: 'flex', margin: '20px 0' }}>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='JPTelScore' value={-1} onClick={buttonHandler}> - </button>
        </div>
        <p style={{ margin: 0 }}>Score: {JPTelScore}</p>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='JPTelScore' value={1} onClick={buttonHandler}> + </button>
        </div>
      </form>
      <form style={{ display: 'flex', margin: '20px 0' }}>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='JPMeetScore' value={-1} onClick={buttonHandler}> - </button>
        </div>
        <p style={{ margin: 0 }}>Score: {JPMeetScore}</p>
        <div style={{ height: 20, margin: '0 10px' }}>
          <button name='JPMeetScore' value={1} onClick={buttonHandler}> + </button>
        </div>
      </form>

      <form style={{ display: 'flex', margin: '20px 0' }}>
        <p style={{ margin: 0 }}>Tutorial: &nbsp;</p>
        <Switch size={15} id='tutorial' onChange={buttonHandler} checked={tutorial} />
      </form>
      <div style={{ width: 400 }}>
        <button style={{ width: '100%', height: 25 }} onClick={updateHandler}>Submit changes</button>
      </div>
      <div style={{ width: 400 }}>
        <button style={{ width: '100%', height: 25 }} onClick={logoutHandler}>Log Out</button>
      </div>
    </div>);
};

export default Admin;