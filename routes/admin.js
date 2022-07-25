var express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");


router.get('/blog-list', async function (req, res, next) {


  const db = blogsDB();
  const collection = await db.collection('blogs')


  const result = await collection.find({})
    .project({ id: 1, title: 1, author: 1, createdAt: 1, lastModified: 1 })
    .toArray();

  res.json({
    message: result,
  });

});

router.put("/edit-blog", async function (req, res, next) {
  const title = req.body.title;
  const text = req.body.text;
  const author = req.body.author;
  const id = Number(req.body.id);

  try {
    const collection = await blogsDB().collection("blogs")
    const updatedPost = {
      title: title,
      text: text,
      author: author
    }
    await collection.updateOne({
      id: id
    }, {
      $set: {
        ...updatedPost,
        lastModified: new Date()
      }
    })
    res.json({ success: true })
  } catch (e) {
    console.error(e)
    res.json({ success: false })
  }

});

router.delete("/delete-blog/:blogId", async function (req, res, next) {

  try {
    const collection = await blogsDB().collection("blogs")
    console.log(Number(req.params.blogId))
    console.log(await collection.findOne({ id: Number(req.params.blogId) }))
    await collection.deleteOne({
      id: Number(req.params.blogId)
    })
    res.json({ success: true })
  } catch (e) {
    console.error(e)
    res.json({ success: false })
  }
});


module.exports = router;