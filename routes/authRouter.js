const router = require('express').Router();
const authCtrl = require('../controllers/authCtrl');
const auth = require('../middleware/auth');


router.post('/register', authCtrl.register);
router.post("/register_admin", authCtrl.registerAdmin);
router.post("/changePassword", auth,  authCtrl.changePassword);


router.post("/login", authCtrl.login);
// Admin login route has been moved to adminRouter.js


router.post("/logout", authCtrl.logout);


router.post("/refresh_token", authCtrl.generateAccessToken);


module.exports = router;

