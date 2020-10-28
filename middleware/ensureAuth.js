const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.json({error: 'Unauthorized. Please sign in.'});
  }
};

module.exports = ensureAuth;
