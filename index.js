const exp = require('express');
const port = 3200;
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = exp();
const Mailjet = require('node-mailjet');
dotenv.config();

<<<<<<< HEAD
const loginRoute = require("./routes/login");
const categoryRoute = require("./routes/category");
const serviceRoute = require("./routes/service");
const styleListRoute = require("./routes/stylelist");
const productRoute = require("./routes/product");
const newsRoute = require("./routes/news");
const orderRoute = require("./routes/order");
=======
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
>>>>>>> 5b4d221c36c1f8b473d6126507d5f97b7610f10a

const categoryRoute = require('./routes/category');
const serviceRoute = require('./routes/service');
const styleListRoute = require('./routes/stylelist');
const productRoute = require('./routes/product');
const newsRoute = require('./routes/news');
const bookingRoute = require('./routes/booking');

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || '',
  apiSecret: process.env.MJ_APIKEY_PRIVATE || '',
});
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connection Successfull!'))
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(exp.json());

<<<<<<< HEAD
app.use("/api/users", loginRoute);
app.use("/api/category", categoryRoute);
app.use("/api/services", serviceRoute);
app.use("/api/stylelist", styleListRoute);
app.use("/api/product", productRoute);
app.use("/api/news", newsRoute);
app.use("/api/order", orderRoute);
=======
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/category', categoryRoute);
app.use('/api/service', serviceRoute);
app.use('/api/stylelist', styleListRoute);
app.use('/api/product', productRoute);
app.use('/api/news', newsRoute);
app.use('/api/booking', bookingRoute);
>>>>>>> 5b4d221c36c1f8b473d6126507d5f97b7610f10a

app.get('/', (req, res) => {
  res.send('ahihi 1234');
});

app.post('/send-email', async (req, res) => {
  try {
    const request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'no-reply@30slice.com',
            Name: '30slice',
          },
          To: [
            {
              Email: 'tqkpro.dev@gmail.com',
              Name: 'passenger 1',
            },
          ],
          Variables: {
            day: 'Monday',
          },
          TemplateID: 4275347,
          TemplateLanguage: true,
          Subject: 'Lịch cắt tóc của bạn',
        },
      ],
    });
    console.log(request.body);
    res.send(request.body);
  } catch (err) {
    console.log(err);
  }

  //   request
  //     .then(result => {
  //       console.log(result.body)
  //       res.send(result.body);
  //     })
  //     .catch(err => {
  //       console.log(err.statusCode)
  //     })
});

app.listen(port, () => {
  console.log(`Ung dung dang chay voi port ${port}`);
});
