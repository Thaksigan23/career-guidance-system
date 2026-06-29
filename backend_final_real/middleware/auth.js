import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader =
      req.headers["authorization"] ||
      req.headers["Authorization"] ||
      req.headers["AUTHORIZATION"];

    if (!authHeader) {
      return res.status(401).json({ error: "Missing token" });
    }

    // Support both "Bearer <token>" and raw token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      // Attach user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      if (!req.user.id || !req.user.role) {
        return res.status(403).json({ error: "Invalid token payload" });
      }

      next();
    });
  } catch (error) {
    return res.status(500).json({ error: "Authentication failed" });
  }
};
