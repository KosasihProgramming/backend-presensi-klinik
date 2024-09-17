exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.selectedDatabase) {
    next(); // Lanjutkan jika pengguna sudah login
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
