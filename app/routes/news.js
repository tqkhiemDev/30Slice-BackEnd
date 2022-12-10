const News = require("../models/News");

const router = require("express").Router();

//show all
router.get("/getAllNews", async (req, res) => {
  try {
    const news = await News.aggregate([
      {
        $lookup: {
          from: "logins",
          localField: "Create_By",
          foreignField: "_id",
          as: "Create_By",
        },
      },
      {
        $unwind: "$Create_By",
      },
      {
        $project: {
          __v: 0,
          Create_By: {
            __v: 0,
            Password: 0,
            createdAt: 0,
            updatedAt: 0,
            _id: 0,
            Email: 0,
            Phone: 0,
          },
        },
      },
    ]).sort({ Create_At: -1 });
    res.status(200).json(news);
  } catch (err) {
    res.status(400).json(err);
  }
});
router.get("/getAllNewsByUser", async (req, res) => {
  try {
    const news = await News.aggregate([
      {
        $match: { Is_Show: true },
      },
      {
        $lookup: {
          from: "logins",
          localField: "Create_By",
          foreignField: "_id",
          as: "Create_By",
        },
      },
      {
        $unwind: "$Create_By",
      },
      {
        $project: {
          __v: 0,
          Create_By: {
            __v: 0,
            Password: 0,
            createdAt: 0,
            updatedAt: 0,
            _id: 0,
            Email: 0,
            Phone: 0,
          },
        },
      },
    ]);
    res.status(200).json(news);
  } catch (err) {
    res.status(400).json(err);
  }
});

//show 1
router.get("/getOneNews/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("Create_By","Full_Name");
    await News.findByIdAndUpdate(req.params.id, {
      $set: { Views: news.Views + 1 },
    });

    res.status(200).json(news);
  } catch (err) {
    res.status(400).json(err);
  }
});

//them
router.post("/", async (req, res) => {
  const newNews = new News(req.body);
  try {
    const savedNews = await newNews.save();
    console.log(savedNews);
    res.status(200).json(savedNews);
  } catch (err) {
    res.status(400).json(err);
  }
});

//sua
router.put("/", async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(
      req.body._id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedNews);
  } catch (err) {
    res.status(400).json(err);
  }
});

//xoa
router.put("/delete", async (req, res) => {
  try {
    await News.findOneAndUpdate(
      { _id: req.body._id },
      { Is_Delete: req.body.Is_Delete }
    );
    res.status(200).json("delete success!!");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/", async (req, res) => {
  try {
    await News.findByIdAndDelete({ _id: req.body._id });
    res.status(200).json("delete success!!");
  } catch (err) {
    res.status(400).json(err);
  }
});
module.exports = router;
