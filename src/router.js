const express = require("express");

const {
  clientError,
  serverError,
  authenticate,
  login,
  checkToken,
  logout,
  addRoom,
} = require("./controllers");

const { withAuth } = require("./middleware");

const router = express.Router();

router.get("/checkToken", checkToken);
router.get("/logout", logout);
router.get("/room", withAuth, addRoom);
router.post("/auth", authenticate);
router.post("/login", login);
router.use(clientError);
router.use(serverError);

module.exports = router;
