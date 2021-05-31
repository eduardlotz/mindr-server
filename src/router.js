const express = require("express");

const {
  clientError,
  serverError,
  authenticate,
  checkToken,
  logout,
  addRoom,
  joinRoom,
} = require("./controllers");

const { withAuth } = require("./middleware");

const router = express.Router();

router.get("/checkToken", checkToken);
router.get("/logout", logout);

router.post("/room", addRoom);
router.post("/join", joinRoom);

router.post("/auth", authenticate);
router.use(clientError);
router.use(serverError);

module.exports = router;
