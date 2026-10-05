const router = require('express').Router();
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/userCtrl');
const userCtrlPg = require('../controllers/userCtrlPg');
const usePg = !!process.env.DATABASE_URL;

router.get('/search', auth, userCtrl.searchUser);

router.get('/user/:id', auth, usePg ? userCtrlPg.getUser : userCtrl.getUser);

router.patch("/user", auth, userCtrl.updateUser);

router.patch("/user/:id/follow", auth, usePg ? userCtrlPg.follow : userCtrl.follow);
router.patch("/user/:id/unfollow", auth, usePg ? userCtrlPg.unfollow : userCtrl.unfollow);
router.post("/follow/:id", auth, usePg ? userCtrlPg.follow : (req, res) => res.status(501).json({ msg: "Set DATABASE_URL for POST /follow/:id." }));
router.delete("/follow/:id", auth, usePg ? userCtrlPg.unfollow : (req, res) => res.status(501).json({ msg: "Set DATABASE_URL for DELETE /follow/:id." }));

router.get("/suggestionsUser", auth, userCtrl.suggestionsUser);





module.exports = router;