const router = require('express').Router();
const controller = require('./controller.js');

router
  .route('/howToAsk/:id')
  .get(controller.HTAgetUser)
  .put(controller.HTAupdateUser)

router
  .route('/howToAsk')
  .get(controller.HTAgetAll)

router
  .route('/auth/signup')
  .post(controller.newUser)

router
  .route('/auth/signin')
  .post(controller.signInUser)

router
  .route('/auth/:id')
  .delete(controller.delUser)

module.exports = router;