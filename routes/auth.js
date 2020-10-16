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
    failureRedirect: process.env.NODE_ENV === 'production' ? '/login' : 'http://localhost:3000/login',
    successRedirect: process.env.NODE_ENV === 'production' ? '/login' : 'http://localhost:3000/login',
    failureFlash: true,
  }),
  // (req, res) => {
  //
  //   res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000/');
  // }
);
// @desc      Check if authenticated
// @route     GET /auth/user
// @access    Public
router.get('/user', (req, res) => {
  const flashObj = req.flash();
  const user = {
    firstName: req.user && req.user.firstName ? req.user.firstName : null,
    lastName: req.user && req.user.lastName ? req.user.lastName : null,
    email: req.user && req.user.email ? req.user.email : null,
    isAuthenticated: req.isAuthenticated(),
    // Get flash message added by Passport authentication if
    // it exists. Message will just contain the email unauthorized email address
    unauthorizedEmail: flashObj.error && flashObj.error.length > 0 ? flashObj.error[0] : null,
  }
  res.json(user);
});

// @desc      Logout user
// @route     GET /auth/logout
// @access    Public
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000/');
});

module.exports = router;
