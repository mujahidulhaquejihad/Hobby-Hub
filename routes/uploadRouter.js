const router = require("express").Router();
const auth = require("../middleware/auth");
const uploadCtrl = require("../controllers/uploadCtrl");

router.post("/upload", auth, uploadCtrl.multerConfig, uploadCtrl.uploadImage);

module.exports = router;
