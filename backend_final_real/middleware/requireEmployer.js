export const requireEmployer = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ error: "Only employers can perform this action" });
  }
  next();
};
