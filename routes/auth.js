const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc      Auth with Google
// @route     GET /auth/google
// @access    Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc      Google auth callback
// @route     GET /auth/google/callback
// @access    Public
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000/',
    successRedirect: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000/',
    failureFlash: true,
  }),
  // // (req, res) => {
  //   res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000');
  // }
);
// @desc      Check if authenticated
// @route     GET /auth/user
// @access    Public
router.get('/user', (req, res) => {

  const user = {
    isAuthenticated: req.isAuthenticated(),
    unauthorizedEmail: null,
    firstName: req.user && req.user.firstName ? req.user.firstName : null,
    email: req.user && req.user.email ? req.user.email : null,
  }
  // Get flash message added by Passport authentication if
  // it exists. Message will just contain the email unauthorized email address
  const flashObj = req.flash();
  let unauthorizedEmail = null;
  if (flashObj.error && flashObj.error.length > 0) {
    unauthorizedEmail = flashObj.error[0];
  }
  res.json(user);
})

// @desc      Logout user
// @route     GET /auth/logout
// @access    Public
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000/');
});

module.exports = router;
