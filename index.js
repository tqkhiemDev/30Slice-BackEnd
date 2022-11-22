const exp = require('express');
const app = exp();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mailjet = require('node-mailjet');
const { logger, logEvents } = require('./app/middlewares/auth/logger');
const errorHandler = require('./app/middlewares/errorHandler');

dotenv.config();
app.use(cors());
app.use(exp.json());
app.use(logger);
app.use(errorHandler);

const orderRoute = require('./app/routes/order');
const userRoute = require('./app/routes/user');
const adminRoute = require('./app/routes/admin');
const categoryRoute = require('./app/routes/category');
const serviceRoute = require('./app/routes/service');
const styleListRoute = require('./app/routes/stylelist');
const productRoute = require('./app/routes/product');
const newsRoute = require('./app/routes/news');
const bookingRoute = require('./app/routes/booking');
const combosRoute = require('./app/routes/combos');

app.use('/api/order', orderRoute);
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/category', categoryRoute);
app.use('/api/service', serviceRoute);
app.use('/api/stylelist', styleListRoute);
app.use('/api/product', productRoute);
app.use('/api/news', newsRoute);
app.use('/api/booking', bookingRoute);
app.use('/api/combos', combosRoute);

// Refresh token
const authRoute = require('./app/routes/auth/auth.routes');
const userTestRoute = require('./app/routes/auth/user.routes');
app.use('/api/auth', authRoute);
app.use('/api/user/test', userTestRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connection Successfull!'))
  .catch((err) => {
    console.log(err);
  });

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || '',
  apiSecret: process.env.MJ_APIKEY_PRIVATE || '',
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

app.listen(process.env.PORT, () => {
  console.log(`Ung dung dang chay voi port ${process.env.PORT}`);
});
