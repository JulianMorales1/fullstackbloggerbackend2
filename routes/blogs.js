var express = require('express');
var router = express.Router();

var { blogsDB } = require('../mongo.js');

/* GET home page. */
router.get('/hello-blogs', function (req, res, next) {
	res.json({ message: 'hello from express' });
});

router.post('/blog-submit', async function (req, response, next) {
	const title = req.body.title;
	const text = req.body.text;
	const author = req.body.author;
	const collection = await blogsDB().collection("blogs")
	const count = await collection.count()
	const id = count + 1;
	console.log(count);

	/*
	- title {string}
- text {string}
- author {string}
- createdAt {date}
- id {number}
- lastModified {date}
*/

	const blogPost = {
		title: title,
		text: text,
		author: author,
		createdAt: new Date(),
		id: id,
		lastModified: new Date()
	};

	const db = blogsDB();
	db.collection('blogs').insertOne(blogPost, function (err, res) {
		if (err) throw err;
		console.log('blog post inserted');
		response.send({
			message: res,
		});
	});
});

router.get('/all-blogs', async function (req, res, next) {
	// incoming params
	const limit = Number(req.query.limit);
	const skip = Number(req.query.limit) * (Number(req.query.page) - 1);
	const sortField = req.query.sortField;
	const sortOrder = req.query.sortOrder;
	const filterField = req.query.filterField;
	const filterValue = req.query.filterValue;



	//Validation
	let dbLimit = limit
	if (!limit) {
		dbLimit = 100
	}

	let dbSkip = skip
	if (!skip) {
		dbSkip = 0
	}



	let filterObj = {};
	if (filterField && filterValue) {
		filterObj = { [filterField]: filterValue };
	}
	let sortObj = {};
	if (sortField && sortOrder) {
		sortObj = { [sortField]: sortOrder };
	}

	const db = blogsDB();
	const collection = await db.collection('blogs')

	console.log(filterObj)

	const result = await collection.find(filterObj)
		.sort(sortObj)
		.limit(dbLimit)
		.skip(dbSkip)
		.toArray();

	console.log(result)

	res.send({
		message: result,
	});
});

module.exports = router;

/*

		.toArray(function (err, allBlogs) {
			if (err) {
				res.status(400).send('Error fetching blogs');
			} else {
				res.status(200).json({
					message: allBlogs,
				});
			}
		});

		*/
