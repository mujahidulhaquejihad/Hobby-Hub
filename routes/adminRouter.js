const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

// Admin Login Route (from authCtrl)
router.post('/admin/login', authCtrl.adminLogin);

// Admin Data Routes (from adminCtrl)
router.get('/get_total_users' , auth, authAdmin, adminCtrl.getTotalUsers);
router.get("/get_total_posts", auth, authAdmin, adminCtrl.getTotalPosts);
router.get("/get_total_comments", auth, authAdmin, adminCtrl.getTotalComments);
router.get("/get_total_likes", auth, authAdmin, adminCtrl.getTotalLikes);
router.get("/get_total_spam_posts", auth, authAdmin, adminCtrl.getTotalSpamPosts);
router.get("/get_spam_posts", auth, authAdmin, adminCtrl.getSpamPosts);
router.delete("/delete_spam_posts/:id", auth, authAdmin, adminCtrl.deleteSpamPost);


module.exports = router;

