const router = require("express").Router();
const auth = require("../middleware/auth");
const postCtrl = require("../controllers/postCtrl");
const postCtrlPg = require("../controllers/postCtrlPg");
const usePg = !!process.env.DATABASE_URL;

router.route("/posts")
  .post(auth, usePg ? postCtrlPg.createPost : postCtrl.createPost)
  .get(auth, usePg ? postCtrlPg.getFeed : postCtrl.getPosts);

router.get("/posts/feed", auth, usePg ? postCtrlPg.getFeed : postCtrl.getPosts);

router.route("/post/:id")
  .patch(auth, postCtrl.updatePost)
  .get(auth, postCtrl.getPost)
  .delete(auth, postCtrl.deletePost);

router.patch("/post/:id/like", auth, postCtrl.likePost);
router.patch("/post/:id/unlike", auth, postCtrl.unLikePost);
router.get('/post_discover', auth, postCtrl.getDiscoverPosts);
router.patch("/post/:id/report", auth, postCtrl.reportPost);

router.get("/user_posts/:id", auth, postCtrl.getUserPosts);
router.patch("/savePost/:id", auth, postCtrl.savePost);
router.patch("/unSavePost/:id", auth, postCtrl.unSavePost);
router.get("/getSavePosts", auth, postCtrl.getSavePost);




module.exports = router;
