const exp = require("express");
const port = 3200;
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = exp();


const cateRoute = require("./routes/categories");
const proRoute = require("./routes/products");
const orderRoute = require("./routes/order");

dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!")).catch((err) => {
  console.log(err);
});
app.use(cors());
app.use(exp.json());


app.use("/api/categories", cateRoute);
app.use("/api/products", proRoute);
app.use("/api/orders", orderRoute);
app.get("/",(req, res)=>{
  res.send("ahihi 123")
})



app.listen(port, () =>{
  console.log(`Ung dung dang chay voi port ${port}`);
});
