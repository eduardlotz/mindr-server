const { server } = require("./app");

const port = process.env.PORT || 4000;

server.listen(port, () =>
  console.log(`server is running http://localhost:${port}`)
);
