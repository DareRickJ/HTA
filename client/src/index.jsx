import React from 'react';
import ReactDOM from 'react-dom';


import Authentication from './components/AuthenticationScreen.jsx';
import Admin from './Screen/AdminScreen.jsx';
import Dialogue from './Dialogue/Dialogue.js';
import FirstPage from './Screen/FirstPage.jsx';
import ChooseDonor from './Screen/ChooseDonorScreen.jsx';
import GameScreen from './Screen/GameScreen.jsx';
import ChooseCommunication from './Screen/ChooseCommunicationScreen.jsx';
import End from './Screen/EndScreen.jsx';

// const address = 'http://192.168.1.100:3001';
// const address = 'http://192.168.1.2:3001';
const address = 'http://localhost:3001';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticate: 'login',
      userNameValid: true,
      passwordValid: true,
      warningStatus: '',
      id: '',
      userName: '',
      password: '',
      JenTelScore: 0,
      JenMeetScore: 0,
      SharrelTelScore: 0,
      SharrelMeetScore: 0,
      JPTelScore: 0,
      JPMeetScore: 0,
      tutorial: true,
      allUsers: [],
      currentVideo: "",
      currentPoster: "",
      currentAudio: "",
      playerDialogues: [],
      donorDialogue: {},
      playerClickable: false,
      gameChosen: '',
      subScore: 0,
    };
    this.trySignInWithCookie = this.trySignInWithCookie.bind(this);
    this.fetchGameData = this.fetchGameData.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.signupHandler = this.signupHandler.bind(this);
    this.signInWithPasswordHandler = this.signInWithPasswordHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.authenticateSwitch = this.authenticateSwitch.bind(this);
    this.checkInputValidity = this.checkInputValidity.bind(this);
    this.buttonHandler = this.buttonHandler.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.changeVideoHandler = this.changeVideoHandler.bind(this);
    this.dialogueHandler = this.dialogueHandler.bind(this);
    this.chooseGameHandler = this.chooseGameHandler.bind(this);
  }

  componentDidMount() {
    this.trySignInWithCookie();
  }

  trySignInWithCookie() {
    let cookie = Cookies.get('cookie');
    let userName = localStorage.getItem('userName');
    if (!!cookie && cookie !== 'undefined') { // cookie valid
      fetch(`${address}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          cookie
        })
      })
        .then(res => { return res.json(); })
        .then(({ id, cookie, cookieExpireTime }) => {
          let inAnHour = new Date(cookieExpireTime);
          window.Cookies.set('cookie', cookie, { expires: inAnHour });
          this.setState({
            userName,
            authenticate: 'passed',
            id,
          }, () => {
            this.fetchGameData();
            // this.getAllUsers();
          });
        })
        .catch(err => {
          console.log(err)
        });

    } else {
      this.setState({
        userName,
        authenticate: "login"
      }, () => {
        // this.getAllUsers();
      });
    }
  }

  fetchGameData() {
    let { id } = this.state;
    fetch(`${address}/api/howToAsk/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => { return res.json(); })
      .then(({ JenTelScore, JenMeetScore, SharrelTelScore, SharrelMeetScore, JPTelScore, JPMeetScore, tutorial }) => {
        this.setState({
          JenTelScore: Number(JenTelScore),
          JenMeetScore: Number(JenMeetScore),
          SharrelTelScore: Number(SharrelTelScore),
          SharrelMeetScore: Number(SharrelMeetScore),
          JPTelScore: Number(JPTelScore),
          JPMeetScore: Number(JPMeetScore),
          tutorial
        });
        // this.getAllUsers();
      })
      .catch(err => {
        console.log(err)
      });
  }

  checkInputValidity(e) {
    let { userName, password } = this.state;
    var usernameRegex = /^[A-Za-z]\w{5,20}$/;
    var passwordRegex = /^[A-Za-z]\w{3,12}$/;

    if (e && e.target.name === 'password') {
      let passwordValid = password.match(passwordRegex) ? true : false;
      this.setState({ passwordValid });
    } else if (e && e.target.name === 'userName') {
      let userNameValid = userName.match(usernameRegex) ? true : false;
      this.setState({ userNameValid });
    } else {
      let userNameValid = userName.match(usernameRegex) ? true : false;
      let passwordValid = password.match(passwordRegex) ? true : false;
      this.setState({ userNameValid, passwordValid });
    }
  }

  getAllUsers() {
    fetch(`${address}/api/howToAsk`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          allUsers: data
        });
      })
      .catch(err => {
        console.log(err)
      })
  }

  changeHandler(e) {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  }

  submitHandler() {
    const checkValidity = async () => {
      this.checkInputValidity();
      this.setState({ warningStatus: '' })
    };

    checkValidity()
      .then(() => {
        if (this.state.authenticate === 'signup') {
          this.signupHandler();
        } else {
          this.signInWithPasswordHandler();
        }
      })
      .catch(err => { console.log(err) })
  }

  signupHandler() {
    let { userName, password, userNameValid, passwordValid } = this.state;
    let lastRequest = new Date();
    if (userNameValid && passwordValid) {
      fetch(`${address}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName,
          password: 'afdi34tdsf3r3.' + password,
          lastRequest
        })
      })
        .then((response) => {
          if (response.status === 409) {
            this.setState({ warningStatus: 409 });
            throw new Error('This user name exists, try something else')
          } else {
            return;
          }
        })
        .then(() => {
          document.getElementById("authentication").reset();
          // this.getAllUsers();
        })
        .catch(err => {
          console.log("err", err)
        });
    }
  }

  signInWithPasswordHandler() {
    let { userName, password, userNameValid, passwordValid } = this.state;
    localStorage.setItem('userName', userName);
    if (userNameValid && passwordValid) {
      fetch(`${address}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName,
          password: 'jhtrfg9876rg.' + password,
          lastRequest: new Date()
        })
      })
        .then((response) => {
          if (response.status === 403) {
            this.setState({ warningStatus: 403 });
            throw new Error('wrong password')
          } else if (response.status === 401) {
            this.setState({ warningStatus: 401 });
            throw new Error('no user with this name found')
          } else {
            return response.json();
          }
        })
        .then(({ id, cookie, cookieExpireTime, JenTelScore, JenMeetScore, SharrelTelScore, SharrelMeetScore, JPTelScore, JPMeetScore, tutorial }) => {
          let inAnHour = new Date(cookieExpireTime);
          window.Cookies.set('cookie', cookie, { expires: inAnHour });
          this.setState({
            authenticate: 'passed',
            id,
          }, () => {
            this.fetchGameData();
          });
          if (document.getElementById("authentication")) {
            document.getElementById("authentication").reset();
          }
          // this.getAllUsers();
        })
        .catch(err => {
          console.log(err)
        });
    }
  }

  deleteHandler(id) {
    fetch(`${address}/api/auth/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        // this.getAllUsers();
      })
      .catch(err => {
        console.log("err", err)
      });
  }

  authenticateSwitch() {
    let { authenticate } = this.state;
    if (authenticate === 'signup') {
      this.setState({ authenticate: 'login' });
    } else {
      this.setState({ authenticate: 'signup' });
    }
    this.setState({
      userNameValid: true,
      passwordValid: true,
      warningStatus: '',
      id: '',
      userName: '',
      password: '',
      JenTelScore: 0,
      JenMeetScore: 0,
      SharrelTelScore: 0,
      SharrelMeetScore: 0,
      JPTelScore: 0,
      JPMeetScore: 0,
      tutorial: true,
    });
    document.getElementById("authentication").reset();
  }

  buttonHandler(e) {
    if (e === false || e === true) { // tutorial
      this.setState({
        tutorial: !this.state.tutorial
      });
    } else { // change telscore & meetingscore
      e.preventDefault();
      this.setState({
        [e.target.name]: this.state[e.target.name] + Number(e.target.value)
      })
    }
  }

  logoutHandler(e) {
    e.preventDefault();
    Cookies.remove('cookie');
    this.setState({
      authenticate: 'login',
      password: '',
      id: '',
      JenTelScore: 0,
      JenMeetScore: 0,
      SharrelTelScore: 0,
      SharrelMeetScore: 0,
      JPTelScore: 0,
      JPMeetScore: 0,
      tutorial: true
    }, () => {
      this.trySignInWithCookie();
    });
  }

  updateHandler(e) {
    e.preventDefault();
    let cookie = Cookies.get('cookie') || '';
    let { id, JenTelScore, JenMeetScore, SharrelTelScore, SharrelMeetScore, JPTelScore, JPMeetScore, tutorial } = this.state;
    fetch(`${address}/api/howToAsk/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cookie,
        JenTelScore,
        JenMeetScore,
        SharrelTelScore,
        SharrelMeetScore,
        JPTelScore,
        JPMeetScore,
        tutorial,
      })
    })
      .then((response) => {
        if (response.status === 440) {
          console.error("session expired");
          this.setState({ warningStatus: 440, authenticate: 'login' });
        } else {
          return response.json();
        }
      })
      .then(({ cookie, cookieExpireTime }) => {
        let inAnHour = new Date(cookieExpireTime);
        Cookies.set('cookie', cookie, { expires: inAnHour });
        // this.getAllUsers();
      })
      .catch(err => {
        console.log(err)
      });
  }

  changeVideoHandler(newVid) {
    let vid = document.getElementById("myVideo");
    this.setState({
      currentVideo: newVid
    }, () => {
    });
    vid.load();
  }

  dialogueHandler(player, newDialogue, skip, point) {
    let { subScore, playerDialogues, gameChosen, playerClickable } = this.state;
    if (typeof newDialogue === 'string' && (newDialogue.includes('End') || newDialogue.includes('Natalie'))) {
      let person = '', status = '', person2 = '', status2 = '', num = "0";

      if (gameChosen.includes('Franco')) {
        person = 'Franco'; person2 = 'Jen';
      } else if (gameChosen.includes('Sharrel')) {
        person = person2 = 'Sharrel';
      } else if (gameChosen.includes('JP')) {
        person = person2 = 'JP';
      }

      if (newDialogue.includes('telephoneFail')) {
        status = 'telephoneFail';
        status2 = 'Tel';
      } else if (newDialogue.includes('telephoneSuccess')) {
        status = 'telephoneSuccess';
        status2 = 'Tel';
      } else if (newDialogue.includes('meetingFail')) {
        status = 'meetingFail';
        status2 = 'Meet';
      } else if (newDialogue.includes('meetingSuccess')) {
        status = 'meetingSuccess';
        status2 = 'Meet';
      }
      num = newDialogue.split(" ")[2];
      let pageChosen = status.length > 0 ? `${status} ${person} ${num}` : person;
      document.getElementById('videoContainer').style.opacity = 0;
      if (this.state[person2 + status2 + 'Score'] < subScore) {
        this.setState({
          [person2 + status2 + 'Score']: subScore,
        })
      }
      setTimeout(() => {
        this.setState({
          donorDialogue: null,
          playerDialogues: [],
          gameChosen: pageChosen,
          subScore: 0,
        })
      }, 800);
    } else {

      if (player) {
        if (gameChosen === 'FrancoPhone' && newDialogue === 'Gate1') {
          if (subScore + point <= 2) {
            newDialogue = 'Gate1-1';
            this.changeVideoHandler("./assets/Franco2.2.mp4");
          } else if (3 <= subScore + point && subScore + point <= 4) {
            newDialogue = 'Gate1-2'
          } else {
            newDialogue = 'Gate1-3'
          }
        } else if (gameChosen === 'FrancoPhone' && newDialogue === 'Gate2') {
          if (subScore + point <= 4) {
            newDialogue = 'Gate2-1';
            this.changeVideoHandler("./assets/Franco2.2.mp4");
          } else if (5 == subScore + point) {
            newDialogue = 'Gate2-2'
          } else if (6 == subScore + point) {
            newDialogue = 'Gate2-6'
          } else if (7 <= subScore + point && subScore + point <= 9) {
            newDialogue = 'Gate2-3'
          } else if (10 == subScore + point) {
            newDialogue = 'Gate2-4'
          } else { // 11
            newDialogue = 'Gate2-5'
          }
        } else if (gameChosen === 'FrancoMeeting' && newDialogue === 'Gate1') {
          if (subScore + point <= 4) {
            newDialogue = 'Gate1-4';
            this.changeVideoHandler("./assets/Jennifer2.2.mp4");
          } else if (5 <= subScore + point && subScore + point <= 7) {
            newDialogue = 'Gate1-1'
          } else if (8 <= subScore + point && subScore + point <= 12) {
            newDialogue = 'Gate1-2'
          } else {
            newDialogue = 'Gate1-3'
          }
        } else if (gameChosen === 'SharrelPhone' && newDialogue === 'Gate1') {
          if (subScore + point <= 3) {
            newDialogue = 'Gate1-1';
            this.changeVideoHandler("./assets/Franco2.2.mp4");
          } else if (4 <= subScore + point && subScore + point <= 7) {
            newDialogue = 'Gate1-2'
          } else {
            newDialogue = 'Gate1-3'
          }
        } else if (gameChosen === 'SharrelPhone' && newDialogue === 'Gate2') {
          if (subScore + point <= 11) {
            newDialogue = 'Gate2-1';
            this.changeVideoHandler("./assets/Franco2.2.mp4");
          } else if (12 <= subScore + point && subScore + point <= 17) {
            newDialogue = 'Gate2-2'
          } else {
            newDialogue = 'Gate2-3'
          }
        } else if (gameChosen === 'SharrelMeeting' && newDialogue === 'Gate1') {
          if (subScore + point <= 3) {
            newDialogue = 'Gate1-1'
          } else if (4 === subScore + point) {
            newDialogue = 'Gate1-2'
          } else if (5 <= subScore + point && subScore + point <= 6) {
            newDialogue = 'Gate1-3'
          } else {
            newDialogue = 'Gate1-4'
          }
        } else if (gameChosen === 'JPPhone' && newDialogue === 'Gate1') {
          if (subScore + point <= 3) {
            newDialogue = 'Gate1-1';
            this.changeVideoHandler("./assets/Franco2.2.mp4");
          } else if (4 <= subScore + point && subScore + point <= 7) {
            newDialogue = 'Gate1-2'
          } else {
            newDialogue = 'Gate1-3'
          }
        } else if (gameChosen === 'JPPhone' && newDialogue === 'Gate2') {
          if (subScore + point <= 9) {
            newDialogue = 'Gate2-1';
            this.changeVideoHandler("./assets/Franco2.2.mp4");
          } else if (10 <= subScore + point && subScore + point <= 14) {
            newDialogue = 'Gate2-2'
          } else {
            newDialogue = 'Gate2-3'
          }
        } else if (gameChosen === 'JPMeeting' && newDialogue === 'Gate1') {
          if (subScore + point <= 2) {
            newDialogue = 'Gate1-1'
          } else if (3 <= subScore + point && subScore + point <= 4) {
            newDialogue = 'Gate1-2'
          } else if (5 <= subScore + point && subScore + point <= 6) {
            newDialogue = 'Gate1-3'
          } else {
            newDialogue = 'Gate1-4'
          }
        }
        if (playerClickable) {
          playerDialogues.forEach((e, i) => {
            e.addScore = 0;
            document.getElementById(String(i)).onclick = () => { };
            if (skip != i) {
              let disappear = document.getElementById(String(i));
              disappear.style.opacity = 0;
              disappear.style.left = "-100px";
              setTimeout(() => {
                disappear.style.zIndex = -3;
                disappear.style.transition = 'none';
                disappear.style.display = 'none'
              }, 800);
            }
          });

          this.setState({
            subScore: subScore + point,
            playerClickable: false,
          })
          setTimeout(() => {
            playerDialogues[skip] = { text: ' . . . ' };
            this.setState({
              currentAudio: `./assets/Breezy.m4a`, // this is just a simulation
              donorDialogue: Dialogue[gameChosen][newDialogue],
              playerDialogues,
            }, () => {
              document.getElementById('respondButton').click();
            })
          }, 801);
        }

      } else { // donor
        let newPlayerDialogues = [];
        for (let ix of newDialogue) {
          newPlayerDialogues.push(Dialogue[gameChosen][ix]);
        }
        setTimeout(() => {
          this.setState({
            playerDialogues: newPlayerDialogues,
            playerClickable: true
          });
        }, 800);
      }
    }
  }

  chooseGameHandler(name) {
    if (name === 'FrancoPhone') {
      this.setState({
        gameChosen: name,
        donorDialogue: Dialogue[name][1],
        currentVideo: './assets/Franco1.1.mp4',
        currentPoster: './assets/posterFranco.png',
        currentAudio: './assets/Breezy.m4a',
      });
    } else if (name === 'FrancoMeeting') {
      this.setState({
        gameChosen: name,
        playerClickable: true,
        playerDialogues: [Dialogue[name][1]],
        currentVideo: './assets/Jennifer1.1.mp4',
        currentPoster: './assets/posterJennifer.png',
        currentAudio: './assets/Breezy.m4a',
      });
    } else if (name === 'SharrelPhone') {
      this.setState({
        gameChosen: name,
        donorDialogue: Dialogue[name][1],
        currentVideo: './assets/SharrelPhone/SharrelPhoneNeutral.mp4',
        currentPoster: './assets/SharrelPhone/SharrelPhonePoster.png',
        currentAudio: './assets/Breezy.m4a',
      });
    } else if (name === 'SharrelMeeting') {
      this.setState({
        gameChosen: name,
        playerClickable: true,
        playerDialogues: [Dialogue[name][1]],
        currentVideo: './assets/SharrelMeeting/SharrelMeetingNeutral.mp4',
        currentPoster: './assets/SharrelMeeting/SharrelMeetPoster.png',
        currentAudio: './assets/Breezy.m4a',
      });
    } else if (name === 'JPPhone') {
      this.setState({
        gameChosen: name,
        donorDialogue: Dialogue[name][1],
        currentVideo: './assets/JPPhone/JPPhoneNeutral.mp4',
        currentPoster: './assets/JPPhone/JPPhonePoster.png',
        currentAudio: './assets/Breezy.m4a',
      });
    } else if (name === 'JPMeeting') {
      this.setState({
        gameChosen: name,
        playerClickable: true,
        playerDialogues: [Dialogue[name][1]],
        currentVideo: './assets/JPMeeting/JPMeetingNeutral.mp4',
        currentPoster: './assets/JPMeeting/JPMeetingPoster.png',
        currentAudio: './assets/Breezy.m4a',
      });
    }
  }

  render() {
    let { playerDialogues, donorDialogue, subScore, warningStatus, authenticate, userNameValid, passwordValid, userName, JenTelScore, JenMeetScore, SharrelTelScore, SharrelMeetScore, JPTelScore, JPMeetScore, tutorial, allUsers, currentVideo, currentPoster, currentAudio, gameChosen } = this.state;
    let gameScreen;
    if (authenticate !== 'passed') {
      gameScreen = <div>
        <Authentication
          userName={userName}
          authenticate={authenticate}
          userNameValid={userNameValid}
          passwordValid={passwordValid}
          warningStatus={warningStatus}
          changeHandler={this.changeHandler}
          checkInputValidity={this.checkInputValidity}
          submitHandler={this.submitHandler}
          authenticateSwitch={this.authenticateSwitch}
        />

      </div>
    } else {
      gameScreen = <div style={{ display: 'table', width: '100%' }}>
        <Admin
          userName={userName}
          JenTelScore={JenTelScore}
          JenMeetScore={JenMeetScore}
          SharrelTelScore={SharrelTelScore}
          SharrelMeetScore={SharrelMeetScore}
          JPTelScore={JPTelScore}
          JPMeetScore={JPMeetScore}
          tutorial={tutorial}
          buttonHandler={this.buttonHandler}
          updateHandler={this.updateHandler}
          logoutHandler={this.logoutHandler}
        />

        <div style={{ float: 'left', width: '50%' }}>
          <h2>List of Users</h2>
          <ol style={{ width: '100%' }}>
            {allUsers.map((user, idx) => (
              <li key={idx} >
                <div style={{ width: '100%', display: 'flex' }}>
                  <p style={{ width: '50%' }}>{user.userName}, JenTelScore: {JenTelScore}, JenMeetScore: {JenMeetScore}, SharrelTelScore: {SharrelTelScore}, SharrelMeetScore: {SharrelMeetScore}, JPTelScore: {JPTelScore}, JPMeetScore: {JPMeetScore}, tutorial: {user.tutorial.toString()}, expire: {user.cookieExpireTime} </p>
                  <button style={{ padding: '5px', height: '30px', margin: '20px 0' }} onClick={() => this.deleteHandler(user.id)}>del</button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      // } else {
      //   switch (true) {
      //     case gameChosen === '':
      //       gameScreen = <FirstPage
      //         goToChooseDonor={() => this.setState({ gameChosen: 'choose' })}
      //       />; break;

      //     case gameChosen === 'choose':
      //       gameScreen = <ChooseDonor
      //         chooseDonor={(name) => {
      //           this.setState({
      //             gameChosen: name,
      //           });
      //         }}
      //         navigateBack={() => {
      //           this.setState({ gameChosen: '' })
      //         }}
      //       />; break;

      //     case (gameChosen === 'Franco' || gameChosen === 'Sharrel' || gameChosen === 'JP'):
      //       gameScreen = <ChooseCommunication
      //         name={gameChosen}
      //         canGoToMeeting={(gameChosen === 'Franco') ? (JenTelScore > 6) : (gameChosen === 'Sharrel') ? (SharrelTelScore >= 12) : (JPTelScore >= 10)}
      //         chooseCom={this.chooseGameHandler}
      //         navigateBack={() => {
      //           this.setState({
      //             gameChosen: 'choose'
      //           })
      //         }}
      //       />; break;

      //     case (gameChosen.includes('Fail') || gameChosen.includes('Success')):
      //       let num = gameChosen.split(" ")[2];
      //       gameScreen = <End
      //         ending={gameChosen}
      //         goToMain={(page) => {
      //           this.setState({
      //             subScore: 0,
      //             gameChosen: page,
      //           })
      //         }}
      //         text={Dialogue.Natalie[num].text}
      //       />; break;

      //     default:
      //       gameScreen = <GameScreen
      //         userName={userName}
      //         playerDialogues={playerDialogues}
      //         donorDialogue={donorDialogue}
      //         currentVideo={currentVideo}
      //         currentPoster={currentPoster}
      //         currentAudio={currentAudio}
      //         logoutHandler={this.logoutHandler}
      //         changeVideoHandler={this.changeVideoHandler}
      //         dialogueHandler={this.dialogueHandler}
      //       />;
      // }
    }


    return (
      <div id='main'>
        <h3 style={{ position: "absolute", top: 0, left: "50%" }}>Score : {subScore}</h3>
        {gameScreen}
      </div>
    );
  }
};



ReactDOM.render(<App />, document.getElementById('app'))