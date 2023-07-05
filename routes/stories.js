const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const upload = require("../app")
const cloudinary = require("cloudinary").v2

const Story = require("../models/Story")

// @desc Show add page
// @route GET /stories/add

router.get('/add', ensureAuth, (req, res) => {
    res.render("stories/add")
})

// @desc Process add form
// @route POST /stories

router.post('/', ensureAuth, upload.single('image'), async (req, res) => {
    try {
        req.body.user = req.user.id;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            req.body.image_id = result.public_id;
            req.body.image = result.secure_url;
        }
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// @desc Show all stories
// @route GET /stories/index

router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: "public" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean()

        res.render("stories/index", {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render("error/500")
    }
})

// @desc Show single story
// @route GET /stories/:id

router.get("/:id", ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id)
            .populate("user")
            .lean()
        if (!story) {
            return res.render("error/404")
        }
        res.render("stories/show", {
            story,
        })
    } catch (err) {
        console.error(err)
        res.render("error/404")
    }
})

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id,
        }).lean()

        if (!story) {
            res.render("error/404")
        }

        //checks to see if it's the owner of the story
        if (story.user != req.user.id) {
            res.redirect("/stories")
        } else {
            res.render("stories/edit", {
                story,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render("error/500")
    }

})

// @desc Update story
// @route PUT /stories/:id

router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return res.render("error/404")
        }
        //checks to see if it's the owner of the story
        if (story.user != req.user.id) {
            res.redirect("/stories")
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect("/dashboard")
        }

    } catch (err) {
        console.error(err)
        return res.render("error/500")
    }

})

// @desc Delete story
// @route DELETE /stories/:id

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id })
        if (!story) {
            return res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            if (story.image_id) {
                await cloudinary.uploader.destroy(story.image_id)
                console.log('Image deleted successfully')
            }
            await Story.deleteOne({ _id: req.params.id })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        console.log('Error deleting image from Cloudinary:', err.message)
        return res.render('error/500')
    }
})

// @desc User Stories
// @route GET /stories/user/:userId

router.get("/user/:userId", ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: "public"
        })
            .populate("user")
            .lean()

            res.render("stories/index", {
                stories
            })
    } catch (err) {
        console.error(err)
        res.render("error/500")
    }
})

module.exports = router