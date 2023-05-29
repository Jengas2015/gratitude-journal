const express = require("express")
const passport = require("passport")
const router = express.Router()

// @desc Auth with Google
// @route GET /auth/google

//passport.authenticate specifies which strategy to use. Here we use google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

// @desc Google Auth Callback
// @route GET /auth/google/callback

//failureRedirect is pretty self-explanatory, where does the app take you if the login fails. The res.redirect("/dashboard") line is where the user is redirected upon successful login.
router.get('/google/callback', passport.authenticate("google", { failureRedirect: '/' }), (req, res)=> {
    res.redirect("/dashboard")
})

module.exports = router