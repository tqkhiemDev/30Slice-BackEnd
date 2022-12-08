const exp = require("express");
const app = exp();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Mailjet = require("node-mailjet");
const { logger, logEvents } = require("./app/middlewares/auth/logger");
const errorHandler = require("./app/middlewares/errorHandler");

// Socket.io
const socketIo = require("socket.io");
const { createServer } = require("http");
const server = createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  io.on("connection", function (socket) {
    console.log("client connect");
    socket.on("comment", function (data) {
      console.log(data);
      io.emit("comment", data);
    });
  });
  res.send("Hello World!");
});
app.use((req, res, next) => {
  req.io = io;
  return next();
});
// end Socket.io
dotenv.config();
app.use(cors());
app.use(exp.json());
// app.use(logger);
// app.use(errorHandler);

const orderRoute = require("./app/routes/order");
const userRoute = require("./app/routes/user");
const adminRoute = require("./app/routes/admin");
const categoryRoute = require("./app/routes/category");
const serviceRoute = require("./app/routes/service");
const styleListRoute = require("./app/routes/stylelist");
const productRoute = require("./app/routes/product");
const newsRoute = require("./app/routes/news");
const bookingRoute = require("./app/routes/booking");
const comboRoute = require("./app/routes/combos");
const userMngt = require("./app/routes/admin/userMngt.route");
const commentRoute = require("./app/routes/comment");

app.use("/api/order", orderRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/category", categoryRoute);
app.use("/api/service", serviceRoute);
app.use("/api/stylelist", styleListRoute);
app.use("/api/product", productRoute);
app.use("/api/news", newsRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/combo", comboRoute);
app.use("/api/comment", commentRoute);
app.use("/api/admin/user-management", userMngt);

// Refresh token
const authRoute = require("./app/routes/auth/auth.routes");
const userTestRoute = require("./app/routes/auth/user.routes");
app.use("/api/auth", authRoute);
app.use("/api/user/test", userTestRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection Successfull!");
    app.listen(process.env.PORT, () => {
      console.log(`Ung dung dang chay voi port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// mongoose.connection.on("error", (err) => {
//   console.log(err);
//   logEvents(
//     `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
//     "mongoErrLog.log"
//   );
// });
