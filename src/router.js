const express = require("express");

const {
  clientError,
  serverError,
  authenticate,
  checkToken,
  logout,
  addRoom,
  addUser,
} = require("./controllers");

const { withAuth } = require("./middleware");

const router = express.Router();

router.get("/checkToken", checkToken);
router.get("/logout", logout);
router.get("/room", addRoom);
router.post("/user", addUser);
router.post("/auth", authenticate);
router.use(clientError);
router.use(serverError);

module.exports = router;
