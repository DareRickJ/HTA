const { User, HowToAsk, RoundTable } = require('../database/index.js');
const Cookie = require('./coockieGenerator');
const bcrypt = require('bcrypt');


const controller = {
  HTAgetAll: (req, res) => {
    User.findAll()
      .then(arr => {
        let newArr = []
        for (let user of arr) {
          newArr.push({ userName: user.userName, cookieExpireTime: user.cookieExpireTime });
        }
        res.status(200).send(newArr);
      })
      .catch(err => {
        console.error(err);
        res.status(404).send("error from getAll");
      });
  },

  HTAgetUser: (req, res) => {
    HowToAsk.findOne({ where: { user_id: req.params.id } })
      .then(hta => {
        let obj = {
          JenTelScore: hta.JenTelScore,
          JenMeetScore: hta.JenMeetScore,
          SharrelTelScore: hta.SharrelTelScore,
          SharrelMeetScore: hta.SharrelMeetScore,
          JPTelScore: hta.JPTelScore,
          JPMeetScore: hta.JPMeetScore,
          tutorial: hta.tutorial
        };
        res.status(200).send(obj);
      })
      .catch(err => {
        console.error(err);
        res.status(404).send("error from getUser")
      });
  },

  HTAupdateUser: (req, res) => {
    if (!req.body.cookie) {
      console.log('expired');
      res.status(440).send("session expired");
    } else {
      let newCookie = Cookie();
      let cookieExpireTime = new Date(new Date().getTime() + (1 * 60 * 60 * 1000));
      User.update({
        cookie: newCookie,
        cookieExpireTime
      }, {
        where: {
          id: req.params.id,
          cookie: req.body.cookie
        }
      })
        .then(() => {

          let { JenTelScore, JenMeetScore, SharrelTelScore, SharrelMeetScore, JPTelScore, JPMeetScore, tutorial } = req.body;
          HowToAsk.update({
            JenTelScore, JenMeetScore, SharrelTelScore, SharrelMeetScore, JPTelScore, JPMeetScore, tutorial
          }, {
            where: { user_id: req.params.id }
          })
            .then(() => {
              res.status(200).send({ cookie: newCookie, cookieExpireTime });
            })
            .catch(err => {
              console.error("error from updating HTA game data");
              res.status(404).send("error from updating HTA game data")
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

        HowToAsk.destroy({ where: { user_id: req.params.id } })
          .then(() => {

            RoundTable.destroy({ where: { user_id: req.params.id } })
              .then(() => {
                res.status(200).send("success delete user");
              })
              .catch(err => {
                console.error(err);
                res.status(404).send("error from del RoundTable user_id")
              });

          })
          .catch(err => {
            console.error(err);
            res.status(404).send("error from del HowtoAsk user_id")
          });

      })
      .catch(err => {
        console.error(err);
        res.status(404).send("error from delUser")
      });
  },

  newUser: (req, res) => {
    let userId = Math.ceil(Math.random() * 2147483640);
    let hash = bcrypt.hashSync(req.body.password.split('.')[1], 10);
    let newUser = {
      id: userId,
      userName: req.body.userName,
      password: hash,
      cookie: req.body.cookie,
      cookieExpireTime: req.body.cookieExpireTime
    };
    let newUserId = {
      user_id: userId,
    }
    User.create(newUser)
      .then(() => {

        HowToAsk.create(newUserId)
          .then(() => {

            RoundTable.create(newUserId)
              .then(() => {
                res.status(200).send("new user created");
              })
              .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError') {
                  res.status(409).send('user name already exists in RT');
                } else {
                  res.status(404).send("error from RT newUser");
                }
              });

          })
          .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
              res.status(409).send('user name already exists in HTA');
            } else {
              res.status(404).send("error from HTA newUser");
            }
          });

      })
      .catch(err => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          res.status(409).send('user name already exists in User');
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

              HowToAsk.findOne({ where: { user_id: user.id } })
                .then(hta => {
                  HowToAsk.findOne({ where: { user_id: user.id } })
                  res.status(200).send({
                    id: user.id,
                    cookie,
                    cookieExpireTime,
                  });
                })
                .catch(err => {
                  console.log('error from howtoask find one');
                  res.status(404).send("error from howtoask find one");
                })

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