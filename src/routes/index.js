const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");

const notificationRouter = require("./notificationRoutes");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/notifications", notificationRouter);
};

module.exports = routes;
