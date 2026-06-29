const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Admin check failed" });
  }
};

export default isAdmin;
