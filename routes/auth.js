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
  }),
  // (req, res) => {
  //   res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000');
  // }
);
// @desc      Check if authenticated
// @route     GET /auth/isAuthenticated
// @access    Public
router.get('/isAuthenticated', (req, res) => {
  res.json({isAuthenticated: req.isAuthenticated()})
})

// @desc      Logout user
// @route     GET /auth/logout
// @access    Public
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000/');
});

module.exports = router;
