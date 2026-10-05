const router = require('express').Router();
const auth = require('../middleware/auth');

const authCtrl = process.env.DATABASE_URL
  ? require('../controllers/authCtrlPg')
  : require('../controllers/authCtrl');

router.post('/register', authCtrl.register);
router.post("/register_admin", authCtrl.registerAdmin);
router.post("/changePassword", auth,  authCtrl.changePassword);


router.post("/login", authCtrl.login);
// Admin login route has been moved to adminRouter.js


router.post("/logout", authCtrl.logout);


router.post("/refresh_token", authCtrl.generateAccessToken);


module.exports = router;

