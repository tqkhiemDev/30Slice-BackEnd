const Comment = require("../models/Comment");

const router = require("express").Router();

//show all
router.get("/getAllComment", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json(err);
  }
});
//show theo san pham
router.get("/getCommentByProduct/:id", async (req, res) => {
  const id_product = req.params.id;
  try {
    const comments = await Comment.find({ Id_Product: id_product }).populate(
      "Id_Customter",
      { _id: 1, Full_Name: 1, Role: 1, Images: 1 }
    );

    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json(err);
  }
});

//show theo combo
router.get("/getCommentByCombo", async (req, res) => {
  const id_combo = req.body.Id_Combo;

  try {
    const comments = await Comment.find({ Id_Combo: id_combo });

    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json(err);
  }
});

//bình luận
router.post("/", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const saveCmt = await newComment.save();
    // console.log(saveCmt)
    res.status(200).json(saveCmt);
  } catch (err) {
    res.status(400).json(err);
  }
});

//sửa
//xoá = user data Is_User_Delete = true là oke
router.put("/", async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(
      req.body._id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json("sửa thành công!");
  } catch (err) {
    res.status(400).json(err);
  }
});

//xoá
router.delete("/", async (req, res) => {
  try {
    await Comment.findByIdAndDelete({ _id: req.body._id });
    res.status(200).json("delete success!!");
  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;
