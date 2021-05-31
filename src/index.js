const { server } = require("./app");
var assert = require("assert");

const port = process.env.PORT || 4000;

server.listen(port, () =>
  console.log(`server is running http://localhost:${port}`)
);
