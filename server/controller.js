const User = require('../database/index.js');
const Cookie = require('./coockieGenerator');
const bcrypt = require('bcrypt');


const controller = {
  getAll: (req, res) => {
    let hash = bcrypt.hashSync('myPassword', 10);
    if (bcrypt.compareSync('myPassword', hash)) {
      console.log("match")
    } else {
      console.log("not match")
    }
    User.findAll()
      .then(arr => {
        let newArr = [];
        for (let data of arr) {
          newArr.push({
            id: data.id,
            userName: data.userName,
            cookie: data.cookie,
            cookieExpireTime: data.cookieExpireTime,
            JenTelScore: data.JenTelScore,
            JenMeetScore: data.JenMeetScore,
            SharrelTelScore: data.SharrelTelScore,
            SharrelMeetScore: data.SharrelMeetScore,
            JPTelScore: data.JPTelScore,
            JPMeetScore: data.JPMeetScore,
            tutorial: data.tutorial
          })
        }
        res.status(200).send(newArr);
      })
      .catch(err => {
        console.error(err);
        res.status(404).send("error from getAll")
      });
  },

  getUser: (req, res) => {
    User.findOne({ where: { id: req.params.id } })
      .then(data => {
        let obj = {
          id: data.id,
          userName: data.userName,
          cookie: data.cookie,
          cookieExpireTime: data.cookieExpireTime,
          JenTelScore: data.JenTelScore,
          JenMeetScore: data.JenMeetScore,
          SharrelTelScore: data.SharrelTelScore,
          SharrelMeetScore: data.SharrelMeetScore,
          JPTelScore: data.JPTelScore,
          JPMeetScore: data.JPMeetScore,
          tutorial: data.tutorial
        };
        res.status(200).send(obj);
      })
      .catch(err => {
        console.error(err);
        res.status(404).send("error from getUser")
      });
  },

  updateUser: (req, res) => {
    if (!req.body.cookie) {
      console.log('expired');
      res.status(440).send("session expired");
    } else {
      let cookieExpireTime = new Date(new Date().getTime() + (1 * 60 * 60 * 1000));
      let newObj = { ...req.body, cookieExpireTime };
      User.update(newObj, {
        where: {
          id: req.params.id,
          cookie: newObj.cookie
        }
      })
        .then(() => {
          User.findOne({ where: { id: req.params.id } })
            .then(data => {
              let obj = {
                userName: data.userName,
                cookieExpireTime: data.cookieExpireTime,
                JenTelScore: data.JenTelScore,
                JenMeetScore: data.JenMeetScore,
                SharrelTelScore: data.SharrelTelScore,
                SharrelMeetScore: data.SharrelMeetScore,
                JPTelScore: data.JPTelScore,
                JPMeetScore: data.JPMeetScore,
                tutorial: data.tutorial
              };
              res.status(200).send(obj);
            })
            .catch(err => {
              console.error("error from finding updated user");
              res.status(404).send("error from finding updated user")
            });
        })
        .catch(err => {
          console.error("error from updating user");
          console.error(err);
          res.status(404).send("error from updating user")
        });
    }
  },

  delUser: (req, res) => {
    User.destroy({ where: { id: req.params.id } })
      .then(() => {
        res.status(200).send("success delete user");
      })
      .catch(err => {
        console.error(err);
        res.status(404).send("error from delUser")
      });
  },

  newUser: (req, res) => {
    let userId = Math.ceil(Math.random() * 2147483640);
    let hash = bcrypt.hashSync(req.body.password.split('.')[1], 10);
    let newUser = { id: userId, ...req.body, password: hash };
    User.create(newUser)
      .then(() => {
        User.findOne({ where: { id: userId } })
          .then(() => {
            res.status(200).send("new user created");
          })
          .catch(err => {
            console.error(err);
            res.status(404).send("error from newUser")
          });
      })
      .catch(err => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          res.status(409).send('user name already exists');
        } else {
          res.status(404).send("error from newUser");
        }
      });
  },

  signInUser: (req, res) => {
    User.findOne({ where: { userName: req.body.userName } })
      .then(user => {
        if (user === null) {
          console.log("user not found")
          res.status(401).send('user not found')
        } else if (req.body.cookie === user.cookie || bcrypt.compareSync(req.body.password.split('.')[1], user.password)) {
          let cookieExpireTime = new Date(new Date().getTime() + (1 * 60 * 60 * 1000));
          let cookie = Cookie();
          User.update({ cookie, cookieExpireTime }, { where: { id: user.id } })
            .then(() => {
              res.status(200).send({
                id: user.id,
                cookie,
                cookieExpireTime,
                JenTelScore: user.JenTelScore,
                JenMeetScore: user.JenMeetScore,
                SharrelTelScore: user.SharrelTelScore,
                SharrelMeetScore: user.SharrelMeetScore,
                JPTelScore: user.JPTelScore,
                JPMeetScore: user.JPMeetScore,
                tutorial: user.tutorial
              });
            })
            .catch(err => {
              console.error('error from signin, unable to update info');
              res.status(404).send("error from signin, unable to update info")
            });
        } else {
          console.log('wrong password')
          res.status(403).send('wrong password')
        }
      })
      .catch(err => {
        console.error('error from sign-in, no user with this name found', err);
        res.status(404).send("error from sign-in, no user with this name found")
      })
  }
};

module.exports = controller;