var express = require("express");
      var router = express.Router();
      const { blogsDB } = require("../mongo");


      router.get('/blog-list', function (req, res, next) {
        res.json(adminAllBlogs);
    });

module.exports = router;