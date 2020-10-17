const router = require("express").Router();
const { userRegister, userLogin, userAuth ,serializeUser,checkRole} = require("../utils/Auth");

// User registration route
router.post("/register-user", async (req, res) => {
  await userRegister(req.body, "user", res);
});

// Admin registration route
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

// Super-Admin registration route
router.post("/register-super-admin", async (req, res) => {
  await userRegister(req.body, "super-admin", res);
});

// User login route
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

// Admin login route
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

// Super-Admin login route
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req.body, "super-admin", res);
});

// profile route
router.post("/profile", userAuth, (req, res) => {
  return res.send("Profile");
});

//User protected route
router.post("/user-protected", userAuth,checkRole(['user','admin','super-admin']), (req, res) => {
  return res.send(serializeUser(req.user));
});

//Admin protected route
router.post("/admin-protected", userAuth,checkRole(['admin','super-admin']), (req, res) => {
  return res.send("admin-protected");
});

//Super-Admin protected route
router.post("/super-admin-protected", userAuth,checkRole(['super-admin']), (req, res) => {
  return res.send("super-admin-protected");
});

module.exports = router;
