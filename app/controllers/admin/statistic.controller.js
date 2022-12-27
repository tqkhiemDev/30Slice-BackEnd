const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Login = require('../../models/Login');
const Booking = require('../../models/Booking');

const date = new Date();

function getFirstDayPrevious11Month() {
  const prev11Month = date.getMonth() - 11;
  const firstDay = 1;
  return new Date(date.getFullYear(), prev11Month, firstDay);
}

exports.getTotalOrderByMonth = async (req, res) => {
  try {
    let data = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: getFirstDayPrevious11Month(),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%m/%Y', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $addFields: {
          month: '$_id',
          totalOrders: '$count',
        },
      },
      {
        $project: {
          _id: 0,
          count: 0,
        },
      },
    ]);

    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    let dt = [];
    for (
      let index = currentMonth - (currentMonth < 12 ? 12 : 11);
      index <= currentMonth;
      index++
    ) {
      let m = '';
      let totalOrders = 0;

      if (index > 0) {
        m = `${index < 10 ? '0' : ''}${index}/${currentYear}`;
        totalOrders = 0;
      }

      if (index < 0) {
        m = `${index + 13 < 10 ? '0' + (index + 13) : index + 13}/${
          currentYear - 1
        }`;
        totalOrders = 0;
      }

      data.forEach((item) => {
        if (index === Number(item.month.slice(0, 2))) {
          m = item.month;
          totalOrders = item.totalOrders;
          return;
        }
      });

      index !== 0 &&
        dt.push({
          month: m,
          totalOrders,
        });
    }

    res.status(200).json(dt);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getTotalProduct = async (req, res) => {
  try {
    let data = await Product.countDocuments();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getTotalOrder = async (req, res) => {
  try {
    let data = await Order.countDocuments();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getTotalCustomer = async (req, res) => {
  try {
    let data = await Login.countDocuments({ Role: 'customer' });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getTotalStylist = async (req, res) => {
  try {
    let data = await Login.countDocuments({ Role: 'styleList' });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getTotalBooking = async (req, res) => {
  try {
    let data = await Booking.countDocuments({ Status: 'pending' });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    let data = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};
